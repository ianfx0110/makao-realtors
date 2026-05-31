export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "admin" | "staff" | "landlord" | "seller" | "renter" | "buyer";
  status: "active" | "suspended";
  joinedDate: string;
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
  status: "pending" | "published";
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
  targetId: string;
  targetName: string;
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
  price: number;
  paymentId: string;
  status: "pending" | "approved" | "rejected";
  contactRevealed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
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
