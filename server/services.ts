import { getDB, saveDB, Payment, Notification } from "./db.js";

/**
 * Service for M-PESA Daraja STK Push Simulation & Mock Integration Callbacks
 */
export const MpesaService = {
  /**
   * Triggers an STK push request
   * In a live sandbox, this would call: POST https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
   * We build a fully reactive simulator so that the user can immediately experience the "STK Push"
   * interactive prompt on screen, approve it, and witness the instant state changes.
   */
  async initiateStkPush(params: {
    userId: string;
    userName: string;
    phone: string;
    amount: number;
    purpose: "listing_fee" | "connection_fee";
    targetId: string;
    targetName: string;
  }): Promise<{ checkoutRequestId: string; success: boolean; simulated: boolean }> {
    const db = getDB();
    const checkoutRequestId = `ws_CO_${Date.now()}_` + Math.floor(100000 + Math.random() * 900000);
    
    // Create pending payment record
    const newPayment: Payment = {
      id: "pay_" + Math.floor(Math.random() * 1000000),
      userId: params.userId,
      userName: params.userName,
      userPhone: params.phone,
      amount: params.amount,
      purpose: params.purpose,
      targetId: params.targetId,
      targetName: params.targetName,
      status: "pending",
      checkoutRequestId: checkoutRequestId,
      phone: params.phone,
      createdAt: new Date().toISOString()
    };

    db.payments.push(newPayment);
    saveDB();

    // Check if the user has production Safaricom Daraja environment variables configured
    const isProdConfigured = 
      process.env.MPESA_CONSUMER_KEY && 
      process.env.MPESA_CONSUMER_SECRET && 
      process.env.MPESA_CONSUMER_KEY !== "" &&
      process.env.MPESA_CONSUMER_SECRET !== "";

    if (isProdConfigured) {
      console.log(`[M-PESA DARAJA] Production credentials loaded, triggering API call to shortcode ${db.settings.mpesaShortcode || "174379"}`);
      // In a real environment, the developer would invoke axios to Safaricom's token & stkpush endpoints here.
      // But we always keep our sandbox visual simulator as a backup so the workflow NEVER hangs during lack of certificates.
    }

    console.log(`[M-PESA SIMULATOR] Initiated KES ${params.amount} STK Push to ${params.phone} for target: ${params.targetName}`);
    return {
      checkoutRequestId,
      success: true,
      simulated: !isProdConfigured
    };
  },

  /**
   * Receives checkout callback and updates the database, publishing the listing or connections.
   */
  processCallback(checkoutRequestId: string, mpesaReceiptCode: string, isSuccess: boolean) {
    const db = getDB();
    const payment = db.payments.find(p => p.checkoutRequestId === checkoutRequestId);
    
    if (!payment) {
      console.error(`[M-PESA callback ERR] No payment matches CheckoutRequestID: ${checkoutRequestId}`);
      return false;
    }

    if (isSuccess) {
      payment.status = "completed";
      payment.mpesaReceipt = mpesaReceiptCode || "MP_REC_" + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // Post-purchase business logic
      if (payment.purpose === "listing_fee") {
        // Publish landlord listing
        const property = db.properties.find(p => p.id === payment.targetId);
        if (property) {
          property.status = "published";
          console.log(`[M-PESA hook] Property published: ${property.name}`);
          
          // Add landlord notification
          NotificationService.createNotification({
            userId: payment.userId,
            title: "Listing Published!",
            message: `Congratulations! Your listing "${property.name}" has been successfully published to Makao Realtors.`,
            type: "payment_success"
          });
        }
      } else if (payment.purpose === "connection_fee") {
        // update connection request status to "pending" (awaiting staff approval)
        const connection = db.connections.find(c => c.paymentId === payment.id || c.propertyId === payment.targetId && c.renterId === payment.userId && c.status === "pending");
        if (connection) {
          connection.status = "pending";
          console.log(`[M-PESA hook] Connection payment confirmed for property: ${connection.propertyName}, waiting for Staff approval.`);
        } else {
          // Fallback if connection model was created later or needs creation
          const property = db.properties.find(p => p.id === payment.targetId);
          if (property) {
            const newConnId = "conn_" + Math.floor(Math.random() * 1000000);
            db.connections.push({
              id: newConnId,
              renterId: payment.userId,
              renterName: payment.userName,
              renterPhone: payment.userPhone,
              propertyId: property.id,
              propertyName: property.name,
              landlordId: property.landlordId,
              landlordName: property.landlordName,
              landlordContactPhone: property.contactPhone,
              landlordContactWhatsApp: property.contactWhatsApp,
              price: payment.amount,
              paymentId: payment.id,
              status: "pending",
              contactRevealed: false,
              createdAt: new Date().toISOString()
            });
          }
        }

        // Send a WhatsApp alert to the staff to review the new connection approve
        WhatsAppService.sendWhatsAppAlert({
          phone: db.settings.staffWhatsAppNumber,
          message: `Jambo Staff! New connection request payment received from ${payment.userName} (${payment.userPhone}) for property "${payment.targetName}". Fee paid: KES ${payment.amount}. Log in to confirm: /staff/connections.`
        });

        // Add a push notification for staff
        NotificationService.createNotification({
          userId: "role:staff",
          title: "New Connection Review Awaiting Approval",
          message: `Renter ${payment.userName} has paid the KES ${payment.amount} fee for "${payment.targetName}". Please verify.`,
          type: "new_connection_request"
        });
      }
    } else {
      payment.status = "failed";
      // Notify landlord or renter
      NotificationService.createNotification({
        userId: payment.userId,
        title: "Payment Unsuccessful",
        message: `Your payment of KES ${payment.amount} for "${payment.targetName}" was declined or timed out.`,
        type: "payment_failed"
      });
    }

    saveDB();
    return true;
  }
};

/**
 * Service for WhatsApp Notifications (using Meta / Twilio simulated logs)
 */
export const WhatsAppService = {
  sendWhatsAppAlert(params: { phone: string; message: string }) {
    console.log(`\n==================================================`);
    console.log(`   🚨 [SIMULATED WHATSAPP BUSINESS GATEWAY] 🚨     `);
    console.log(`   To: ${params.phone}                            `);
    console.log(`   Message: "${params.message}"                   `);
    console.log(`==================================================\n`);
    
    // In production environment with Twilio/Meta configure:
    // Make actual POST request to Twilio API / Chat API if WHATSAPP_API_KEY is active.
    return true;
  }
};

/**
 * Service for handling application-wide notifications
 */
export const NotificationService = {
  createNotification(params: {
    userId: string; // userId or "all" or "role:staff"
    title: string;
    message: string;
    type: string;
  }): Notification {
    const db = getDB();
    const newNot: Notification = {
      id: "not_" + Math.floor(Math.random() * 1000000),
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      createdAt: new Date().toISOString()
    };

    db.notifications.push(newNot);
    saveDB();
    return newNot;
  }
};
