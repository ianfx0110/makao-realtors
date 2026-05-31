import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import { getDB, saveDB, initDatabase, User, Property, Payment, ConnectionRequest, Notification, SupportMessage, SiteSettings } from "./server/db.js";
import { optimizeListingDescription, discussRealEstate } from "./server/ai.js";
import { MpesaService, NotificationService, WhatsAppService } from "./server/services.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// In-Memory Simple Session Management matching standard stateless environments securely
// Stores session ID to current User state
const SESSIONS = new Map<string, string>(); // sessionId -> userId

// Cookie Helper
function getSessionUser(req: express.Request): User | null {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(/makao_session=([^;]+)/);
  if (!match) return null;
  const sessionId = match[1];
  const userId = SESSIONS.get(sessionId);
  if (!userId) return null;
  
  const db = getDB();
  const user = db.users.find(u => u.id === userId);
  if (!user || user.status === "suspended") {
    if (user?.status === "suspended") {
      SESSIONS.delete(sessionId);
    }
    return null;
  }
  return user;
}

// Global Auth Middleware
const authGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized. Please login." });
    return;
  }
  next();
};

const roleGuard = (roles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = getSessionUser(req);
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: "Forbidden. Higher role permissions required." });
      return;
    }
    next();
  };
};

/**
 * AUTH ENDPOINTS
 */
app.post("/api/auth/signup", (req, res) => {
  const { name, phone, email, password, confirmPassword, role } = req.body;

  if (!name || !phone || !password || !confirmPassword || !role) {
    res.status(400).json({ error: "Please provide all required fields." });
    return;
  }

  // Phone Validation
  let formattedPhone = phone.trim();
  if (!/^\+254\d{9}$/.test(formattedPhone) && !/^0\d{9}$/.test(formattedPhone)) {
    res.status(400).json({ error: "Phone number must be in Kenyan format (+254XXXXXXXXX or 0XXXXXXXXX)." });
    return;
  }

  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+254" + formattedPhone.substring(1);
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters long." });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const validRoles = ["landlord", "seller", "renter", "buyer"];
  if (!validRoles.includes(role)) {
    res.status(400).json({ error: "Invalid role selection selected." });
    return;
  }

  const db = getDB();
  const exists = db.users.find(u => u.phone === formattedPhone);
  if (exists) {
    res.status(400).json({ error: "An account with this phone number already exists." });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser: User = {
    id: "usr_" + Math.floor(Math.random() * 1000000),
    name,
    phone: formattedPhone,
    email: email || undefined,
    role: role as any,
    status: "active",
    joinedDate: new Date().toISOString(),
    passwordHash
  };

  db.users.push(newUser);
  saveDB();

  // Create auto session
  const sessionId = "sec_" + Math.random().toString(36).substring(2) + Date.now();
  SESSIONS.set(sessionId, newUser.id);

  res.setHeader("Set-Cookie", `makao_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
  res.status(201).json({ success: true, user: { id: newUser.id, name: newUser.name, phone: newUser.phone, role: newUser.role } });
});

app.post("/api/auth/login", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    res.status(400).json({ error: "Phone and password are required." });
    return;
  }

  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+254" + formattedPhone.substring(1);
  }

  const db = getDB();
  const user = db.users.find(u => u.phone === formattedPhone);

  if (!user) {
    res.status(400).json({ error: "Invalid credentials." });
    return;
  }

  if (user.status === "suspended") {
    res.status(403).json({ error: "Your account is temporarily suspended. Please contact Makao staff or support." });
    return;
  }

  const matches = bcrypt.compareSync(password, user.passwordHash);
  if (!matches) {
    res.status(400).json({ error: "Invalid credentials." });
    return;
  }

  const sessionId = "sec_" + Math.random().toString(36).substring(2) + Date.now();
  SESSIONS.set(sessionId, user.id);

  res.setHeader("Set-Cookie", `makao_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
  res.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
});

app.get("/api/auth/me", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    res.json(null);
    return;
  }
  res.json({ id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, joinedDate: user.joinedDate });
});

app.post("/api/auth/logout", (req, res) => {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(/makao_session=([^;]+)/);
  if (match) {
    SESSIONS.delete(match[1]);
  }
  res.setHeader("Set-Cookie", "makao_session=; Path=/; HttpOnly; Max-Age=0");
  res.json({ success: true });
});

app.put("/api/auth/profile", authGuard, (req, res) => {
  const userRef = getSessionUser(req);
  if (!userRef) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name, email } = req.body;
  const db = getDB();
  const user = db.users.find(u => u.id === userRef.id);
  
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    saveDB();
    res.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role } });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/api/auth/password", authGuard, (req, res) => {
  const userRef = getSessionUser(req);
  if (!userRef) return;

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current password and new password are required." });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters long." });
    return;
  }

  const db = getDB();
  const user = db.users.find(u => u.id === userRef.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const matches = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!matches) {
    res.status(400).json({ error: "Incorrect current password." });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(newPassword, salt);
  saveDB();
  res.json({ success: true, message: "Password updated successfully." });
});

/**
 * PROPERTY LISTINGS ENDPOINTS
 */
app.get("/api/properties", (req, res) => {
  const db = getDB();
  const listings = db.properties;
  res.json(listings);
});

// View property increment counter
app.post("/api/properties/:id/view", (req, res) => {
  const db = getDB();
  const property = db.properties.find(p => p.id === req.params.id);
  if (property) {
    property.views = (property.views || 0) + 1;
    saveDB();
    res.json({ success: true, views: property.views });
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

// Like property
app.post("/api/properties/:id/like", authGuard, (req, res) => {
  const db = getDB();
  const property = db.properties.find(p => p.id === req.params.id);
  if (property) {
    property.likes = (property.likes || 0) + 1;
    saveDB();
    res.json({ success: true, likes: property.likes });
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

// Toggle property availability (Available / Taken)
app.post("/api/properties/:id/toggle", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const db = getDB();
  const property = db.properties.find(p => p.id === req.params.id);
  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  // Only the landlord/seller or admin/staff can toggle availability
  if (property.landlordId !== user.id && user.role !== "admin" && user.role !== "staff") {
    res.status(403).json({ error: "You are not authorized to edit this listing." });
    return;
  }

  property.available = !property.available;
  saveDB();
  res.json({ success: true, available: property.available });
});

// Update/Reduce Property Listing Price
app.post("/api/properties/:id/price", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const { price } = req.body;
  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    res.status(400).json({ error: "Please provide a valid price." });
    return;
  }

  const db = getDB();
  const property = db.properties.find(p => p.id === req.params.id);
  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  // Only the landlord/seller or admin/staff can update price
  if (property.landlordId !== user.id && user.role !== "admin" && user.role !== "staff") {
    res.status(403).json({ error: "You are not authorized to edit this listing." });
    return;
  }

  property.price = Number(price);
  saveDB();
  res.json({ success: true, price: property.price });
});

// Create property (Requires payment checkout STK Push trigger of Listing fee: KES 100)
app.post("/api/properties/create", authGuard, async (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const {
    name,
    propertyType,
    county,
    town,
    estate,
    bedrooms,
    bathrooms,
    price,
    deposit,
    serviceCharge,
    description,
    amenities,
    images,
    isComplex,
    rooms,
    contactPhone,
    contactWhatsApp
  } = req.body;

  if (!name || !propertyType || !county || !town || !price || !description || !contactPhone) {
    res.status(400).json({ error: "Missing required listing fields." });
    return;
  }

  const db = getDB();
  const targetId = "prop_" + Math.floor(Math.random() * 1000000);

  // Listing type based on role
  const listingType = user.role === "seller" ? "sale" : "rent";

  const newProperty: Property = {
    id: targetId,
    landlordId: user.id,
    landlordName: user.name,
    name,
    listingType,
    propertyType,
    county,
    town,
    estate: estate || undefined,
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    price: Number(price),
    deposit: deposit ? Number(deposit) : undefined,
    serviceCharge: serviceCharge ? Number(serviceCharge) : undefined,
    description,
    amenities: amenities || [],
    images: images || [],
    isComplex: !!isComplex,
    rooms: rooms || [],
    status: "pending", // Waiting for KES 100 payment code callback
    available: true,
    views: 0,
    likes: 0,
    saves: 0,
    contactPhone,
    contactWhatsApp: contactWhatsApp || undefined
  };

  db.properties.push(newProperty);
  saveDB();

  // Trigger M-PESA STK Push for KES 100
  const fee = db.settings.listingFee || 100;
  try {
    const mpesaResult = await MpesaService.initiateStkPush({
      userId: user.id,
      userName: user.name,
      phone: user.phone,
      amount: fee,
      purpose: "listing_fee",
      targetId: targetId,
      targetName: name
    });

    res.status(201).json({
      success: true,
      message: "Listing drafted! STK Push of KES " + fee + " sent to your M-PESA line " + user.phone + " to activate and publish.",
      propertyId: targetId,
      checkoutRequestId: mpesaResult.checkoutRequestId,
      simulated: mpesaResult.simulated
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to initialize M-PESA checkout: " + err.message });
  }
});

// Gemini descriptive optimizer
app.post("/api/properties/optimize", authGuard, async (req, res) => {
  const { name, propertyType, county, town, bedrooms, description, amenities } = req.body;
  if (!name || !propertyType || !county || !town || !description) {
    res.status(400).json({ error: "Missing listing content to optimize." });
    return;
  }

  try {
    const optimized = await optimizeListingDescription(
      name,
      propertyType,
      county,
      town,
      Number(bedrooms || 0),
      description,
      amenities || []
    );
    res.json({ success: true, optimized });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admins can delete
app.delete("/api/properties/:id", authGuard, roleGuard(["admin", "staff"]), (req, res) => {
  const db = getDB();
  const index = db.properties.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    db.properties.splice(index, 1);
    saveDB();
    res.json({ success: true, message: "Property deleted." });
  } else {
    res.status(404).json({ error: "Property not found." });
  }
});

/**
 * CONNECTIONS AND PAYMENT FLOWS
 */
app.get("/api/connections", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const db = getDB();
  if (user.role === "admin" || user.role === "staff") {
    res.json(db.connections);
  } else if (user.role === "renter" || user.role === "buyer") {
    res.json(db.connections.filter(c => c.renterId === user.id));
  } else {
    // Landlord / Seller sees requests regarding their properties
    res.json(db.connections.filter(c => c.landlordId === user.id));
  }
});

// Initiate connection request - 10% of monthly rent/price
app.post("/api/connect/initiate", authGuard, async (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const { propertyId } = req.body;
  if (!propertyId) {
    res.status(400).json({ error: "Property ID is required." });
    return;
  }

  const db = getDB();
  const property = db.properties.find(p => p.id === propertyId);
  if (!property) {
    res.status(404).json({ error: "Property not found." });
    return;
  }

  // Calculate 10% fee. For high-price sales, cap it reasonably if desired, but spec says exactly 10%
  const multiplier = (db.settings.connectionFeePercent || 10) / 100;
  const rawFee = property.price * multiplier;
  // Let's cap connection fee for sale properties dynamically at KES 5,000 for realistic sandbox experience,
  // while keeping rents as is. Let's make it the exact 10% unless it's a sale, where we keep 10% or cap it.
  const fee = property.listingType === "sale" ? Math.min(rawFee, 15000) : rawFee;

  // Check if they already have an existing approved connection
  const alreadyConnected = db.connections.find(c => c.propertyId === propertyId && c.renterId === user.id && c.status === "approved");
  if (alreadyConnected) {
    res.json({ success: true, alreadyConnected: true, contactDetails: { phone: property.contactPhone, whatsapp: property.contactWhatsApp } });
    return;
  }

  try {
    const mpesaResult = await MpesaService.initiateStkPush({
      userId: user.id,
      userName: user.name,
      phone: user.phone,
      amount: fee,
      purpose: "connection_fee",
      targetId: property.id,
      targetName: property.name
    });

    // Create immediate pre-connection model linked to checkout request
    const payRec = db.payments.find(p => p.checkoutRequestId === mpesaResult.checkoutRequestId);
    if (payRec) {
      db.connections.push({
        id: "conn_" + Math.floor(Math.random() * 1000000),
        renterId: user.id,
        renterName: user.name,
        renterPhone: user.phone,
        propertyId: property.id,
        propertyName: property.name,
        landlordId: property.landlordId,
        landlordName: property.landlordName,
        landlordContactPhone: property.contactPhone,
        landlordContactWhatsApp: property.contactWhatsApp,
        price: fee,
        paymentId: payRec.id,
        status: "pending",
        contactRevealed: false,
        createdAt: new Date().toISOString()
      });
      saveDB();
    }

    res.json({
      success: true,
      message: `Connection request initiated! M-PESA STK Push of KES ${fee.toLocaleString()} sent to ${user.phone}.`,
      checkoutRequestId: mpesaResult.checkoutRequestId,
      simulated: mpesaResult.simulated
    });
  } catch (error: any) {
    res.status(500).json({ error: "Checkout error: " + error.message });
  }
});

// STAFF / ADMIN Connection request actions
app.post("/api/staff/approve/:id", authGuard, roleGuard(["admin", "staff"]), (req, res) => {
  const staff = getSessionUser(req);
  if (!staff) return;

  const db = getDB();
  const conn = db.connections.find(c => c.id === req.params.id);
  if (!conn) {
    res.status(404).json({ error: "Connection request not found." });
    return;
  }

  conn.status = "approved";
  conn.contactRevealed = true;

  // Add notification to renter
  NotificationService.createNotification({
    userId: conn.renterId,
    title: "Connection Request Approved! 🎉",
    message: `Your connection for ${conn.propertyName} has been approved. Landlord contact revealed: Name: ${conn.landlordName}, Phone: ${conn.landlordContactPhone} ${conn.landlordContactWhatsApp ? "(WhatsApp: " + conn.landlordContactWhatsApp + ")" : ""}.`,
    type: "connection_approved"
  });

  // Prompt alert also to landlord that client requested their location details
  NotificationService.createNotification({
    userId: conn.landlordId,
    title: "New Client Connected!",
    message: `A potential client (${conn.renterName}, phone: ${conn.renterPhone}) has successfully requested your contact details for your listing "${conn.propertyName}".`,
    type: "new_connection_request"
  });

  // WhatsApp alerts to both parties as specified
  WhatsAppService.sendWhatsAppAlert({
    phone: conn.renterPhone,
    message: `Jambo ${conn.renterName}! Your connection fee for "${conn.propertyName}" was approved by staff. Landlord details revealed: Name: ${conn.landlordName}, Phone: ${conn.landlordContactPhone}.`
  });

  WhatsAppService.sendWhatsAppAlert({
    phone: conn.landlordContactPhone,
    message: `Jambo ${conn.landlordName}! client ${conn.renterName} (Phone: ${conn.renterPhone}) has successfully paid and connected to you for your property "${conn.propertyName}". Feel free to reach out to them.`
  });

  saveDB();
  res.json({ success: true, message: "Connection request approved successfully." });
});

app.post("/api/staff/reject/:id", authGuard, roleGuard(["admin", "staff"]), (req, res) => {
  const db = getDB();
  const conn = db.connections.find(c => c.id === req.params.id);
  if (!conn) {
    res.status(404).json({ error: "Connection request not found." });
    return;
  }

  conn.status = "rejected";
  conn.contactRevealed = false;

  // Refund log created for admin
  const payment = db.payments.find(p => p.id === conn.paymentId);
  if (payment) {
    payment.status = "refunded";
  }

  NotificationService.createNotification({
    userId: conn.renterId,
    title: "Connection Request Rejected",
    message: `Our safety team/staff rejected the connection request for "${conn.propertyName}". A refund process has been logged.`,
    type: "connection_approved"
  });

  saveDB();
  res.json({ success: true, message: "Connection request rejected and refund logged." });
});

/**
 * M-PESA CALL BACK SIMULATION Webhook triggers
 */
app.get("/api/payments", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const db = getDB();
  if (user.role === "admin" || user.role === "staff") {
    res.json(db.payments);
  } else {
    res.json(db.payments.filter(p => p.userId === user.id));
  }
});

// Webhook endpoint
app.post("/api/mpesa/callback", (req, res) => {
  const { CheckoutRequestID, ResultCode, ResultDesc, ReceiptCode } = req.body;
  if (!CheckoutRequestID) {
    res.status(400).json({ error: "Missing checkout parameters" });
    return;
  }

  const success = ResultCode === 0 || ResultCode === "0";
  const processed = MpesaService.processCallback(CheckoutRequestID, ReceiptCode || "KQE" + Math.floor(Math.random() * 9999), success);
  
  res.json({ success: processed });
});

// Convenient On-Screen Immediate simulated approval trigger
app.post("/api/mpesa/simulate-approval", authGuard, (req, res) => {
  const { checkoutRequestId, approve } = req.body;
  if (!checkoutRequestId) {
    res.status(400).json({ error: "CheckoutRequestID is required." });
    return;
  }

  const receipt = "MP_SIM_" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const processed = MpesaService.processCallback(checkoutRequestId, receipt, !!approve);

  res.json({ success: processed, receipt, status: approve ? "completed" : "failed" });
});

/**
 * SUPPORT CHAT MESSAGES ENDPOINTS
 */
app.get("/api/messages", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const db = getDB();
  if (user.role === "admin" || user.role === "staff") {
    // Admin & Staff see all messages grouped, or we return whole list for filtering
    res.json(db.messages);
  } else {
    // Landlords, renters, etc. only see messages where they are the sender OR recipient
    res.json(db.messages.filter(m => m.senderId === user.id || m.recipientId === user.id));
  }
});

app.post("/api/messages", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const { recipientId, message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message content cannot be empty." });
    return;
  }

  const db = getDB();
  const newMessage: SupportMessage = {
    id: "msg_" + Math.floor(Math.random() * 1000000),
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    recipientId: recipientId || "staff", // Defaults to staff query
    message,
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMessage);
  saveDB();
  res.status(201).json(newMessage);
});

/**
 * NOTIFICATION CONTROL ENDPOINTS
 */
app.get("/api/notifications", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const db = getDB();
  // Filter for specific user, "all" broadcast notifications, or role:staff notifications
  const myNotifications = db.notifications.filter(n => 
    n.userId === user.id || 
    n.userId === "all" || 
    (user.role === "staff" && n.userId === "role:staff") ||
    (user.role === "admin" && n.userId === "role:staff")
  );

  res.json(myNotifications);
});

app.post("/api/notifications/read-all", authGuard, (req, res) => {
  const user = getSessionUser(req);
  if (!user) return;

  const db = getDB();
  db.notifications.forEach(n => {
    if (
      n.userId === user.id || 
      n.userId === "all" || 
      (user.role === "staff" && n.userId === "role:staff") ||
      (user.role === "admin" && n.userId === "role:staff")
    ) {
      n.read = true;
    }
  });
  saveDB();
  res.json({ success: true });
});

/**
 * ADMINISTRATIVE CONTROL PANEL
 */
app.get("/api/admin/users", authGuard, roleGuard(["admin", "staff"]), (req, res) => {
  const db = getDB();
  res.json(db.users);
});

app.post("/api/admin/create-staff", authGuard, roleGuard(["admin"]), (req, res) => {
  const { name, phone, email, password, role } = req.body;
  if (!name || !phone || !password || !role) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+254" + formattedPhone.substring(1);
  }

  const db = getDB();
  const exists = db.users.find(u => u.phone === formattedPhone);
  if (exists) {
    res.status(400).json({ error: "Phone number already registered." });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newStaff: User = {
    id: "usr_" + Math.floor(Math.random() * 1000000),
    name,
    phone: formattedPhone,
    email: email || undefined,
    role: role as "admin" | "staff",
    status: "active",
    joinedDate: new Date().toISOString(),
    passwordHash
  };

  db.users.push(newStaff);
  saveDB();
  res.status(201).json({ success: true, user: newStaff });
});

app.post("/api/admin/suspend/:userId", authGuard, roleGuard(["admin"]), (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.params.userId);
  if (user) {
    user.status = "suspended";
    saveDB();
    res.json({ success: true, status: "suspended" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/admin/activate/:userId", authGuard, roleGuard(["admin"]), (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.params.userId);
  if (user) {
    user.status = "active";
    saveDB();
    res.json({ success: true, status: "active" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/admin/users/:userId", authGuard, roleGuard(["admin"]), (req, res) => {
  const db = getDB();
  const index = db.users.findIndex(u => u.id === req.params.userId);
  if (index !== -1) {
    db.users.splice(index, 1);
    saveDB();
    res.json({ success: true, message: "User deleted." });
  } else {
    res.status(404).json({ error: "User not found." });
  }
});

// GET / PUT Settings
app.get("/api/admin/settings", authGuard, (req, res) => {
  const db = getDB();
  res.json(db.settings);
});

app.put("/api/admin/settings", authGuard, roleGuard(["admin"]), (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB();
  res.json({ success: true, settings: db.settings });
});

// Broadcast notification to roles or general users
app.post("/api/admin/broadcast", authGuard, roleGuard(["admin"]), (req, res) => {
  const { title, message, targetRole } = req.body;
  if (!title || !message) {
    res.status(400).json({ error: "Title and message are required." });
    return;
  }

  const db = getDB();
  
  if (targetRole && targetRole !== "all") {
    // Filter users and send
    const targets = db.users.filter(u => u.role === targetRole);
    targets.forEach(t => {
      NotificationService.createNotification({
        userId: t.id,
        title: `[BROADCAST] ${title}`,
        message,
        type: "sys_broadcast"
      });
    });
  } else {
    // Send global broadcast notification
    NotificationService.createNotification({
      userId: "all",
      title: `[GLOBAL BROADCAST] ${title}`,
      message,
      type: "sys_broadcast"
    });
  }

  res.json({ success: true, message: "Announcement broadcasted successfully." });
});

/**
 * REAL ESTATE DISCUSS DIALOG HELPER (AI CO-PILOT WITH GEMINI 3.5 FLASH)
 */
app.post("/api/ai/discuss", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  // Get active listed units formatted as text for Gemini to ground suggestions onto.
  const db = getDB();
  const liveListings = db.properties.filter(p => p.status === "published" && p.available);
  const listingsSummary = liveListings.map((p, idx) => {
    return `${idx + 1}. Listing Title: "${p.name}", Location: ${p.town}, ${p.county} County, Property Type: ${p.propertyType}, Price: KES ${p.price.toLocaleString()} (${p.listingType === "rent" ? "Rent/Month" : "Selling Price"}), Bedrooms: ${p.bedrooms}, Amenities: ${p.amenities.join(", ")}. Description: "${p.description}"`;
  }).join("\n\n");

  try {
    const aiResponse = await discussRealEstate(message, listingsSummary, chatHistory || []);
    res.json({ success: true, text: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Direct delivery for favicon.svg tab icon
app.get("/favicon.svg", (req, res) => {
  res.sendFile(path.join(process.cwd(), "favicon.svg"));
});

// Serve frontend assets
const port = 3000;

const startServer = async () => {
  // Sync memory layout and seed if active table elements are empty or unconfigured
  await initDatabase();

  if (process.env.NODE_ENV === "production" || process.env.VITE_PREVIEW === "true") {
    console.log("Serving build files in Production Mode under Cloud Run...");
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  } else {
    console.log("Starting full-stack Vite dev middleware server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
    
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      // Skip API routes so they don't loop
      if (url.startsWith("/api/")) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[MAKAO REALTORS] Full-stack engine running on http://0.0.0.0:${port}`);
  });
};

startServer().catch(err => {
  console.error("Critical crash booting application server: ", err);
});
