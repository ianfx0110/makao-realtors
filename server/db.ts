import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Database File Path
const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Direct Types Definition
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "admin" | "staff" | "landlord" | "seller" | "renter" | "buyer";
  status: "active" | "suspended";
  joinedDate: string;
  passwordHash: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  roomType: string;
  price: number;
  available: boolean;
}

export interface Property {
  id: string;
  landlordId: string;
  landlordName: string;
  name: string;
  listingType: "rent" | "sale";
  propertyType: "Apartment" | "Bungalow" | "Maisonette" | "Studio" | "Bedsitter" | "Commercial" | "Land" | "Other";
  county: string;
  town: string;
  estate?: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  deposit?: number;
  serviceCharge?: number;
  description: string;
  amenities: string[];
  images: string[];
  isComplex: boolean;
  rooms: Room[];
  status: "pending" | "published"; // "pending" until KES 100 paid
  available: boolean;
  views: number;
  likes: number;
  saves: number;
  contactPhone: string;
  contactWhatsApp?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  purpose: "listing_fee" | "connection_fee";
  targetId: string; // propertyId
  targetName: string; // propertyName
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  checkoutRequestId: string;
  phone: string;
  mpesaReceipt?: string;
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  propertyId: string;
  propertyName: string;
  landlordId: string;
  landlordName: string;
  landlordContactPhone: string;
  landlordContactWhatsApp?: string;
  price: number; // 10% fee
  paymentId: string;
  status: "pending" | "approved" | "rejected";
  contactRevealed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // Specific user ID or "all" or "role:staff"
  title: string;
  message: string;
  type: string; // "payment_success" | "connection_approved" | "new_connection_request" | "sys_broadcast"
  read: boolean;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string; // "staff" or specific user ID
  message: string;
  createdAt: string;
}

export interface SiteSettings {
  listingFee: number;
  connectionFeePercent: number;
  mpesaShortcode: string;
  mpesaPasskey: string;
  staffWhatsAppNumber: string;
  whatsappApiKey?: string;
}

export interface DatabaseSchema {
  users: User[];
  properties: Property[];
  payments: Payment[];
  connections: ConnectionRequest[];
  notifications: Notification[];
  messages: SupportMessage[];
  settings: SiteSettings;
}

// Ensure database directory exists
const ensureDbDir = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Seed Initial Data
const getSeedData = (): DatabaseSchema => {
  const salt = bcrypt.genSaltSync(10);
  
  const adminPasswordHash = bcrypt.hashSync("Admin@1234", salt);
  const commonPasswordHash = bcrypt.hashSync("Password@1234", salt);

  const users: User[] = [
    {
      id: "usr_admin1",
      name: "Makao Admin Peter",
      phone: "+254712345678",
      email: "peter@makao.co.ke",
      role: "admin",
      status: "active",
      joinedDate: "2026-05-01T12:00:00Z",
      passwordHash: adminPasswordHash
    },
    {
      id: "usr_staff1",
      name: "Sharon Kemboi (Staff)",
      phone: "+254722222222",
      email: "sharon@makao.co.ke",
      role: "staff",
      status: "active",
      joinedDate: "2026-05-02T10:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_staff2",
      name: "David Ochieng (Staff)",
      phone: "+254733333333",
      email: "david@makao.co.ke",
      role: "staff",
      status: "active",
      joinedDate: "2026-05-03T11:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_landlord1",
      name: "John Kamau",
      phone: "+254744444444",
      email: "kamau@gmail.com",
      role: "landlord",
      status: "active",
      joinedDate: "2026-05-04T08:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_landlord2",
      name: "Mary Wambui",
      phone: "+254755555555",
      email: "wambui@yahoo.com",
      role: "landlord",
      status: "active",
      joinedDate: "2026-05-05T09:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_seller1",
      name: "Ezra Kiprop",
      phone: "+254766666666",
      email: "kiprop@realtors.com",
      role: "seller",
      status: "active",
      joinedDate: "2026-05-06T14:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_renter1",
      name: "Alice Muthoni",
      phone: "+254777777777",
      email: "alice@outlook.com",
      role: "renter",
      status: "active",
      joinedDate: "2026-05-07T15:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_renter2",
      name: "Brian Kipkemboi",
      phone: "+254788888888",
      email: "brian@gmail.com",
      role: "renter",
      status: "active",
      joinedDate: "2026-05-08T16:00:00Z",
      passwordHash: commonPasswordHash
    },
    {
      id: "usr_buyer1",
      name: "Caroline Mwangi",
      phone: "+254799999999",
      email: "carol@gmail.com",
      role: "buyer",
      status: "active",
      joinedDate: "2026-05-09T17:00:00Z",
      passwordHash: commonPasswordHash
    }
  ];

  const properties: Property[] = [
    {
      id: "prop_1",
      landlordId: "usr_landlord1",
      landlordName: "John Kamau",
      name: "Kilimani Heights Apartment",
      listingType: "rent",
      propertyType: "Apartment",
      county: "Nairobi",
      town: "Kilimani",
      estate: "Chania Avenue",
      bedrooms: 2,
      bathrooms: 2,
      price: 55000,
      deposit: 55000,
      serviceCharge: 3500,
      description: "Elegant 2 bedroom apartment located in the prime area of Kilimani. Features a spacious living area, master en-suite, fully fitted kitchen, high-speed elevators, backup generator, backup borehole water, and state-of-the-art security.",
      amenities: ["WiFi", "Parking", "Security", "Water", "Electricity", "Lift", "CCTV", "Gym"],
      images: [],
      isComplex: false,
      rooms: [],
      status: "published",
      available: true,
      views: 145,
      likes: 24,
      saves: 18,
      contactPhone: "+254744444444",
      contactWhatsApp: "+254744444444"
    },
    {
      id: "prop_2",
      landlordId: "usr_landlord1",
      landlordName: "John Kamau",
      name: "Wendani Elite Complex",
      listingType: "rent",
      propertyType: "Bedsitter",
      county: "Kiambu",
      town: "Kahawa Wendani",
      estate: "Near KU Main Gate",
      bedrooms: 0,
      bathrooms: 1,
      price: 12000,
      deposit: 12000,
      serviceCharge: 500,
      description: "An exceptional modern student housing hostel apartment complex located near Kenyatta University main gate. This complex contains individual rooms and bedsitters with premium amenities like continuous water supply, solar tokens, and security guards.",
      amenities: ["WiFi", "Parking", "Security", "Water", "Electricity", "CCTV"],
      images: [],
      isComplex: true,
      rooms: [
        { id: "room_1", roomNumber: "A101", floor: "Ground Floor", roomType: "Standard Bedsitter", price: 11500, available: true },
        { id: "room_2", roomNumber: "A102", floor: "Ground Floor", roomType: "Standard Bedsitter", price: 11500, available: false },
        { id: "room_3", roomNumber: "B201", floor: "1st Floor", roomType: "Premium Bedsitter", price: 12500, available: true },
        { id: "room_4", roomNumber: "B202", floor: "1st Floor", roomType: "Premium Bedsitter", price: 12500, available: true }
      ],
      status: "published",
      available: true,
      views: 320,
      likes: 45,
      saves: 29,
      contactPhone: "+254744444444",
      contactWhatsApp: "+254744444444"
    },
    {
      id: "prop_3",
      landlordId: "usr_landlord2",
      landlordName: "Mary Wambui",
      name: "Ruaka executive studio",
      listingType: "rent",
      propertyType: "Studio",
      county: "Kiambu",
      town: "Ruaka",
      estate: "Joyland Area",
      bedrooms: 1,
      bathrooms: 1,
      price: 18000,
      deposit: 18000,
      serviceCharge: 1000,
      description: "Fully styled cozy executive studio in the vibrant area of Ruaka. Ideal for professional singles or couples. High end finishes, balcony with superb sunset views, ample security, secure compound.",
      amenities: ["WiFi", "Parking", "Security", "Water", "Electricity", "CCTV"],
      images: [],
      isComplex: false,
      rooms: [],
      status: "published",
      available: true,
      views: 98,
      likes: 12,
      saves: 7,
      contactPhone: "+254755555555",
      contactWhatsApp: "+254755555555"
    },
    // Sellers (Sample properties for sale)
    {
      id: "prop_4",
      landlordId: "usr_seller1",
      landlordName: "Ezra Kiprop",
      name: "Syokimau Gateway Villa",
      listingType: "sale",
      propertyType: "Bungalow",
      county: "Machakos",
      town: "Syokimau",
      estate: "Airport Road Estate",
      bedrooms: 3,
      bathrooms: 3,
      price: 8500000, // KES 8.5M
      description: "Exquisite 3 bedroom modern bungalow on a 50x100 plot in Syokimau. All bedrooms are en-suite, featuring a spacious kitchen garden, modern lounge, individual title deed, gated community, CCTV and electric fencing.",
      amenities: ["Parking", "Security", "Water", "Electricity", "CCTV"],
      images: [],
      isComplex: false,
      rooms: [],
      status: "published",
      available: true,
      views: 210,
      likes: 38,
      saves: 31,
      contactPhone: "+254766666666",
      contactWhatsApp: "+254766666666"
    },
    {
      id: "prop_5",
      landlordId: "usr_seller1",
      landlordName: "Ezra Kiprop",
      name: "Runda Pines Maisonette",
      listingType: "sale",
      propertyType: "Maisonette",
      county: "Nairobi",
      town: "Runda",
      estate: "Runda Boulevard",
      bedrooms: 5,
      bathrooms: 5,
      price: 45000000, // KES 45M
      description: "Palatial 5 bedroom classic maisonette standing on a half-acre manicured compound in Runda. Fully fitted bar, home theater room, swimming pool, detached staff quarters (DSQ) for 2, underground water storage of 50,000 liters.",
      amenities: ["WiFi", "Parking", "Security", "Water", "Electricity", "CCTV", "Pool", "Gym"],
      images: [],
      isComplex: false,
      rooms: [],
      status: "published",
      available: true,
      views: 412,
      likes: 87,
      saves: 95,
      contactPhone: "+254766666666",
      contactWhatsApp: "+254766666666"
    }
  ];

  const payments: Payment[] = [
    {
      id: "pay_1",
      userId: "usr_landlord1",
      userName: "John Kamau",
      userPhone: "+254744444444",
      amount: 100,
      purpose: "listing_fee",
      targetId: "prop_1",
      targetName: "Kilimani Heights Apartment",
      status: "completed",
      checkoutRequestId: "ws_CO_30052026154312111",
      phone: "+254744444444",
      mpesaReceipt: "KQE3MKA76B",
      createdAt: "2026-05-20T10:15:00Z"
    },
    {
      id: "pay_2",
      userId: "usr_landlord1",
      userName: "John Kamau",
      userPhone: "+254744444444",
      amount: 100,
      purpose: "listing_fee",
      targetId: "prop_2",
      targetName: "Wendani Elite Complex",
      status: "completed",
      checkoutRequestId: "ws_CO_30052026154312222",
      phone: "+254744444444",
      mpesaReceipt: "KQE5PLO90D",
      createdAt: "2026-05-21T11:22:00Z"
    }
  ];

  const connections: ConnectionRequest[] = [
    {
      id: "conn_1",
      renterId: "usr_renter1",
      renterName: "Alice Muthoni",
      renterPhone: "+254777777777",
      propertyId: "prop_1",
      propertyName: "Kilimani Heights Apartment",
      landlordId: "usr_landlord1",
      landlordName: "John Kamau",
      landlordContactPhone: "+254744444444",
      landlordContactWhatsApp: "+254744444444",
      price: 5500, // 10% of 55,000 rent
      paymentId: "pay_conn_1",
      status: "approved",
      contactRevealed: true,
      createdAt: "2026-05-25T14:30:00Z"
    }
  ];

  const notifications: Notification[] = [
    {
      id: "not_1",
      userId: "usr_landlord1",
      title: "Listing Published Successfully!",
      message: "Your Kilimani Heights Apartment listing has been approved and published.",
      type: "payment_success",
      read: true,
      createdAt: "2026-05-20T10:16:00Z"
    },
    {
      id: "not_2",
      userId: "usr_renter1",
      title: "Contact Revealed!",
      message: "Your connection request for Kilimani Heights Apartment has been approved. The Landlord is John Kamau (+254744444444).",
      type: "connection_approved",
      read: false,
      createdAt: "2026-05-25T14:45:00Z"
    }
  ];

  const messages: SupportMessage[] = [
    {
      id: "msg_1",
      senderId: "usr_renter1",
      senderName: "Alice Muthoni",
      senderRole: "renter",
      recipientId: "staff",
      message: "Hello Makao support, I have a question about Kilimani Heights. Do they accept small pets like cats?",
      createdAt: "2026-05-28T09:00:00Z"
    },
    {
      id: "msg_2",
      senderId: "usr_staff1",
      senderName: "Sharon Kemboi (Staff)",
      senderRole: "staff",
      recipientId: "usr_renter1",
      message: "Hi Alice! Yes, Kilimani Heights Apartment is indeed pet-friendly, though they prefer cats and quiet pets over large dogs. Feel free to request the contact of the landlord to confirm exact rules!",
      createdAt: "2026-05-28T09:12:00Z"
    }
  ];

  const settings: SiteSettings = {
    listingFee: 100,
    connectionFeePercent: 10,
    mpesaShortcode: "174379",
    mpesaPasskey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72dec11002234",
    staffWhatsAppNumber: "+254722222222",
    whatsappApiKey: "makao_wh_key"
  };

  return { users, properties, payments, connections, notifications, messages, settings };
};

// Supabase Client Setup
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseKey);
};

// Database Schema Mappers (PostgreSQL Compatibility)
function toUserDb(user: User) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    status: user.status,
    joined_date: user.joinedDate,
    password_hash: user.passwordHash
  };
}

function fromUserDb(row: any): User {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    role: row.role,
    status: row.status,
    joinedDate: row.joined_date || row.joinedDate || new Date().toISOString(),
    passwordHash: row.password_hash || row.passwordHash || ""
  };
}

function toPropertyDb(p: Property) {
  return {
    id: p.id,
    landlord_id: p.landlordId,
    landlord_name: p.landlordName,
    name: p.name,
    listing_type: p.listingType,
    property_type: p.propertyType,
    county: p.county,
    town: p.town,
    estate: p.estate,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    price: p.price,
    deposit: p.deposit,
    service_charge: p.serviceCharge,
    description: p.description,
    amenities: p.amenities,
    images: p.images,
    is_complex: p.isComplex,
    status: p.status,
    available: p.available,
    views_count: p.views,
    likes_count: p.likes,
    saves_count: p.saves,
    contact_phone: p.contactPhone,
    contact_whatsapp: p.contactWhatsApp
  };
}

function fromPropertyDb(row: any, rooms: Room[] = []): Property {
  return {
    id: row.id,
    landlordId: row.landlord_id || row.landlordId,
    landlordName: row.landlord_name || row.landlordName,
    name: row.name,
    listingType: row.listing_type || row.listingType || "rent",
    propertyType: row.property_type || row.propertyType || "Apartment",
    county: row.county,
    town: row.town,
    estate: row.estate,
    bedrooms: Number(row.bedrooms || 0),
    bathrooms: Number(row.bathrooms || 0),
    price: Number(row.price || 0),
    deposit: row.deposit ? Number(row.deposit) : undefined,
    serviceCharge: row.service_charge !== undefined ? Number(row.service_charge) : (row.serviceCharge !== undefined ? Number(row.serviceCharge) : undefined),
    description: row.description || "",
    amenities: row.amenities || [],
    images: row.images || [],
    isComplex: row.is_complex !== undefined ? !!row.is_complex : !!row.isComplex,
    rooms: rooms,
    status: row.status || "published",
    available: row.available !== undefined ? !!row.available : true,
    views: Number(row.views_count || row.views || 0),
    likes: Number(row.likes_count || row.likes || 0),
    saves: Number(row.saves_count || row.saves || 0),
    contactPhone: row.contact_phone || row.contactPhone || "",
    contactWhatsApp: row.contact_whatsapp || row.contactWhatsApp
  };
}

function toRoomDb(room: Room, propertyId: string) {
  return {
    id: room.id,
    property_id: propertyId,
    room_number: room.roomNumber,
    floor: room.floor,
    room_type: room.roomType,
    price: room.price,
    available: room.available
  };
}

function fromRoomDb(row: any): Room {
  return {
    id: row.id,
    roomNumber: row.room_number || row.roomNumber,
    floor: row.floor,
    roomType: row.room_type || row.roomType || "Room",
    price: Number(row.price || 0),
    available: row.available !== undefined ? !!row.available : true
  };
}

function toPaymentDb(p: Payment) {
  return {
    id: p.id,
    user_id: p.userId,
    user_name: p.userName,
    user_phone: p.userPhone,
    amount: p.amount,
    purpose: p.purpose,
    target_id: p.targetId,
    target_name: p.targetName,
    status: p.status,
    checkout_request_id: p.checkoutRequestId,
    phone: p.phone,
    mpesa_receipt: p.mpesaReceipt,
    created_at: p.createdAt
  };
}

function fromPaymentDb(row: any): Payment {
  return {
    id: row.id,
    userId: row.user_id || row.userId,
    userName: row.user_name || row.userName,
    userPhone: row.user_phone || row.userPhone,
    amount: Number(row.amount || 0),
    purpose: row.purpose || "listing_fee",
    targetId: row.target_id || row.targetId,
    targetName: row.target_name || row.targetName,
    status: row.status || "pending",
    checkoutRequestId: row.checkout_request_id || row.checkoutRequestId || "",
    phone: row.phone || "",
    mpesaReceipt: row.mpesa_receipt || row.mpesaReceipt,
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

function toConnectionDb(c: ConnectionRequest) {
  return {
    id: c.id,
    renter_id: c.renterId,
    renter_name: c.renterName,
    renter_phone: c.renterPhone,
    property_id: c.propertyId,
    property_name: c.propertyName,
    landlord_id: c.landlordId,
    landlord_name: c.landlordName,
    landlord_contact_phone: c.landlordContactPhone,
    landlord_contact_whatsapp: c.landlordContactWhatsApp,
    price: c.price,
    payment_id: c.paymentId,
    status: c.status,
    contact_revealed: c.contactRevealed,
    created_at: c.createdAt
  };
}

function fromConnectionDb(row: any): ConnectionRequest {
  return {
    id: row.id,
    renterId: row.renter_id || row.renterId,
    renterName: row.renter_name || row.renterName,
    renterPhone: row.renter_phone || row.renterPhone,
    propertyId: row.property_id || row.propertyId || "",
    propertyName: row.property_name || row.propertyName,
    landlordId: row.landlord_id || row.landlordId,
    landlordName: row.landlord_name || row.landlordName,
    landlordContactPhone: row.landlord_contact_phone || row.landlordContactPhone || "",
    landlordContactWhatsApp: row.landlord_contact_whatsapp || row.landlordContactWhatsApp,
    price: Number(row.price || 0),
    paymentId: row.payment_id || row.paymentId || "",
    status: row.status || "pending",
    contactRevealed: row.contact_revealed !== undefined ? !!row.contact_revealed : !!row.contactRevealed,
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

function toNotificationDb(n: Notification) {
  return {
    id: n.id,
    user_id: n.userId,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    created_at: n.createdAt
  };
}

function fromNotificationDb(row: any): Notification {
  return {
    id: row.id,
    userId: row.user_id || row.userId || "",
    title: row.title || "",
    message: row.message || "",
    type: row.type || "info",
    read: row.read !== undefined ? !!row.read : false,
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

function toSupportMessageDb(m: SupportMessage) {
  return {
    id: m.id,
    sender_id: m.senderId,
    sender_name: m.senderName,
    sender_role: m.senderRole,
    recipient_id: m.recipientId,
    message: m.message,
    created_at: m.createdAt
  };
}

function fromSupportMessageDb(row: any): SupportMessage {
  return {
    id: row.id,
    senderId: row.sender_id || row.senderId || "",
    senderName: row.sender_name || row.senderName || "",
    senderRole: row.sender_role || row.senderRole || "",
    recipientId: row.recipient_id || row.recipientId || "",
    message: row.message || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

function toSettingsDb(s: SiteSettings) {
  return {
    id: 1,
    listing_fee: s.listingFee,
    connection_fee_percent: s.connectionFeePercent,
    mpesa_shortcode: s.mpesaShortcode,
    mpesa_passkey: s.mpesaPasskey,
    staff_whatsapp_number: s.staffWhatsAppNumber,
    whatsapp_api_key: s.whatsappApiKey
  };
}

function fromSettingsDb(row: any): SiteSettings {
  return {
    listingFee: Number(row.listing_fee !== undefined ? row.listing_fee : (row.listingFee !== undefined ? row.listingFee : 100)),
    connectionFeePercent: Number(row.connection_fee_percent !== undefined ? row.connection_fee_percent : (row.connectionFeePercent !== undefined ? row.connectionFeePercent : 10)),
    mpesaShortcode: row.mpesa_shortcode || row.mpesaShortcode || "174379",
    mpesaPasskey: row.mpesa_passkey || row.mpesaPasskey || "",
    staffWhatsAppNumber: row.staff_whatsapp_number || row.staffWhatsAppNumber || "+254722222222",
    whatsappApiKey: row.whatsapp_api_key || row.whatsappApiKey
  };
}

// Global DB Singleton
let _db: DatabaseSchema | null = null;

export const getDB = (): DatabaseSchema => {
  ensureDbDir();
  if (!_db) {
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, "utf8");
        _db = JSON.parse(raw);
      } catch (err) {
        console.error("Error reading database file, reseeding: ", err);
        _db = getSeedData();
        saveDB();
      }
    } else {
      _db = getSeedData();
      saveDB();
    }
  }
  return _db!;
};

// Async Database Synchronization Function Called on server initialization
export const initDatabase = async (): Promise<void> => {
  ensureDbDir();
  
  // Load local database representation first
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, "utf8");
      _db = JSON.parse(raw);
    } catch (err) {
      _db = getSeedData();
      saveDB();
    }
  } else {
    _db = getSeedData();
    saveDB();
  }

  if (!isSupabaseConfigured) {
    console.log("[DB] Supabase credentials not found in env. Running with local db.json storage fallback mapping.");
    return;
  }

  console.log("[DB] Supabase detected! Orchestrating automatic database synchronization mapping...");
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // 1. Fetch Users
    const { data: usersData, error: usersErr } = await supabase.from("users").select("*");
    if (usersErr) throw usersErr;
    if (usersData && usersData.length > 0) {
      getDB().users = usersData.map(fromUserDb);
      console.log(`[SUPABASE] Loaded ${getDB().users.length} users successfully.`);
    } else {
      console.log("[SUPABASE] users table empty, seeding active database records...");
      const { error: seedErr } = await supabase.from("users").insert(getDB().users.map(toUserDb));
      if (seedErr) console.warn("[SUPABASE] User seeding warning:", seedErr);
    }

    // 2. Fetch Rooms & Properties
    const { data: roomsData } = await supabase.from("rooms").select("*");
    const allRooms = (roomsData || []).map(fromRoomDb);

    const { data: propsData, error: propsErr } = await supabase.from("properties").select("*");
    if (propsErr) throw propsErr;
    if (propsData && propsData.length > 0) {
      getDB().properties = propsData.map(p => {
        const propRooms = allRooms.filter((r: any) => r.property_id === p.id || r.propertyId === p.id);
        return fromPropertyDb(p, propRooms);
      });
      console.log(`[SUPABASE] Loaded ${getDB().properties.length} properties.`);
    } else {
      console.log("[SUPABASE] properties empty, seeding properties & rooms...");
      for (const p of getDB().properties) {
        // Try insert property
        const { error: pErr } = await supabase.from("properties").insert(toPropertyDb(p));
        if (pErr) {
          console.warn(`[SUPABASE] Property ${p.name} insert warning:`, pErr);
        } else if (p.rooms && p.rooms.length > 0) {
          const { error: rErr } = await supabase.from("rooms").insert(p.rooms.map(r => toRoomDb(r, p.id)));
          if (rErr) console.warn("[SUPABASE] Rooms seeding warning:", rErr);
        }
      }
    }

    // 3. Fetch Payments
    const { data: paysData, error: paysErr } = await supabase.from("payments").select("*");
    if (paysErr) throw paysErr;
    if (paysData && paysData.length > 0) {
      getDB().payments = paysData.map(fromPaymentDb);
      console.log(`[SUPABASE] Loaded ${getDB().payments.length} payments.`);
    } else {
      console.log("[SUPABASE] seeding payments...");
      const { error: seedErr } = await supabase.from("payments").insert(getDB().payments.map(toPaymentDb));
      if (seedErr) console.warn("[SUPABASE] Payments seeding warning:", seedErr);
    }

    // 4. Fetch Connections
    const { data: connsData, error: connsErr } = await supabase.from("connection_requests").select("*");
    if (connsErr) throw connsErr;
    if (connsData && connsData.length > 0) {
      getDB().connections = connsData.map(fromConnectionDb);
      console.log(`[SUPABASE] Loaded ${getDB().connections.length} connection records.`);
    } else {
      console.log("[SUPABASE] seeding connections...");
      const { error: seedErr } = await supabase.from("connection_requests").insert(getDB().connections.map(toConnectionDb));
      if (seedErr) console.warn("[SUPABASE] Connections seeding warning:", seedErr);
    }

    // 5. Fetch Notifications
    const { data: notsData, error: notsErr } = await supabase.from("notifications").select("*");
    if (notsErr) throw notsErr;
    if (notsData && notsData.length > 0) {
      getDB().notifications = notsData.map(fromNotificationDb);
    } else {
      const { error: seedErr } = await supabase.from("notifications").insert(getDB().notifications.map(toNotificationDb));
      if (seedErr) console.warn("[SUPABASE] Notifications seeding warning:", seedErr);
    }

    // 6. Fetch Messages
    const { data: msgsData, error: msgsErr } = await supabase.from("support_messages").select("*");
    if (msgsErr) throw msgsErr;
    if (msgsData && msgsData.length > 0) {
      getDB().messages = msgsData.map(fromSupportMessageDb);
    } else {
      const { error: seedErr } = await supabase.from("support_messages").insert(getDB().messages.map(toSupportMessageDb));
      if (seedErr) console.warn("[SUPABASE] Support messages seeding warning:", seedErr);
    }

    // 7. Fetch Site Settings
    const { data: settingsData, error: settingsErr } = await supabase.from("site_settings").select("*");
    if (settingsErr) throw settingsErr;
    if (settingsData && settingsData.length > 0) {
      getDB().settings = fromSettingsDb(settingsData[0]);
    } else {
      const { error: seedErr } = await supabase.from("site_settings").insert({ id: 1, ...toSettingsDb(getDB().settings) });
      if (seedErr) console.warn("[SUPABASE] Settings seeding warning:", seedErr);
    }

    console.log("[SUPABASE] Integration Synchronization Completed successfully.");
  } catch (supabaseError: any) {
    console.error("[SUPABASE RUNTIME EXCEPTION] Error syncing with Supabase:", supabaseError.message || supabaseError);
    console.log("[SUPABASE FALLBACK] Continuing with local JSON read/write logic safely.");
  }
};

export const saveDB = () => {
  if (_db) {
    ensureDbDir();
    // 1. Local Persistence
    fs.writeFileSync(DB_PATH, JSON.stringify(_db, null, 2), "utf8");

    // 2. Transmit to Supabase asynchronously if configured
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        Promise.all([
          supabase.from("users").upsert(_db.users.map(toUserDb)),
          ..._db.properties.map(p => supabase.from("properties").upsert(toPropertyDb(p))),
          ..._db.properties.flatMap(p => p.rooms && p.rooms.length > 0 ? [supabase.from("rooms").upsert(p.rooms.map(r => toRoomDb(r, p.id)))] : []),
          supabase.from("payments").upsert(_db.payments.map(toPaymentDb)),
          supabase.from("connection_requests").upsert(_db.connections.map(toConnectionDb)),
          supabase.from("notifications").upsert(_db.notifications.map(toNotificationDb)),
          supabase.from("support_messages").upsert(_db.messages.map(toSupportMessageDb)),
          supabase.from("site_settings").upsert({ id: 1, ...toSettingsDb(_db.settings) })
        ]).then(() => {
          console.log("[SUPABASE BACKGROUND SYNC] Operations flushed successfully.");
        }).catch(syncWarn => {
          console.warn("[SUPABASE BACKGROUND SYNC WARNING] Failed to flush state changes completely:", syncWarn.message || syncWarn);
        });
      }
    }
  }
};
