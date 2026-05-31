-- =============================================================================
-- MAKAO REALTORS — SECURE KENYAN INTERMEDIARY DATABASE SCHEMA
-- Target Database: PostgreSQL v12+
-- Designed for the Safaricom M-PESA Verified Ledger & Real Estate portal.
-- =============================================================================

-- Enable extension for generation of UUID vectors
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. ENUM TYPES & STATIONS
-- =============================================================================

CREATE TYPE user_role AS ENUM (
  'admin', 
  'staff', 
  'landlord', 
  'seller', 
  'renter', 
  'buyer'
);

CREATE TYPE user_status AS ENUM (
  'active', 
  'suspended'
);

CREATE TYPE listing_type AS ENUM (
  'rent', 
  'sale'
);

CREATE TYPE property_type AS ENUM (
  'Apartment', 
  'Bungalow', 
  'Maisonette', 
  'Studio', 
  'Bedsitter', 
  'Commercial', 
  'Land', 
  'Other'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 
  'processing', 
  'completed', 
  'failed', 
  'refunded'
);

CREATE TYPE payment_purpose AS ENUM (
  'listing_fee', 
  'connection_fee'
);

CREATE TYPE request_status AS ENUM (
  'pending', 
  'approved', 
  'rejected'
);

CREATE TYPE property_status AS ENUM (
  'pending', 
  'published'
);

-- =============================================================================
-- 2. CORE SCHEMAS & RELATIONSHIPS
-- =============================================================================

-- Table: users
-- Holds authentication identity, phone records (Kenyan structure) and system authority status
CREATE TABLE users (
  id VARCHAR(80) PRIMARY KEY, -- Supports custom IDs or Auth0/Firebase strings
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE, -- Standardised Safariom format e.g. 2547XXXXXXXX
  email VARCHAR(150) UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  role user_role NOT NULL DEFAULT 'renter',
  status user_status NOT NULL DEFAULT 'active',
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: properties
-- Main rental, land and sale units. Built with strict structural coordinates corresponding to Kenya counties.
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  landlord_name VARCHAR(150) NOT NULL,
  name VARCHAR(200) NOT NULL,
  listing_type listing_type NOT NULL DEFAULT 'rent',
  property_type property_type NOT NULL DEFAULT 'Apartment',
  county VARCHAR(80) NOT NULL, -- Nairobi, Kiambu, Nakuru, Mombasa etc
  town VARCHAR(80) NOT NULL,
  estate VARCHAR(100),
  bedrooms INTEGER DEFAULT 0 NOT NULL CHECK (bedrooms >= 0),
  bathrooms INTEGER DEFAULT 0 NOT NULL CHECK (bathrooms >= 0),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  deposit NUMERIC(12, 2) DEFAULT 0 CHECK (deposit >= 0),
  service_charge NUMERIC(12, 2) DEFAULT 0 CHECK (service_charge >= 0),
  description TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}'::TEXT[] NOT NULL, -- Multidimensional array matching ts
  images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL, -- Keeps relative or CDN paths
  is_complex BOOLEAN DEFAULT FALSE NOT NULL, -- Evaluates if contains individual sub-rentals / rooms
  status property_status NOT NULL DEFAULT 'pending',
  available BOOLEAN DEFAULT TRUE NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  saves_count INTEGER DEFAULT 0 NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_whatsapp VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: rooms
-- Maps sub-allocated rooms specifically for multi-unit properties / commercial premises
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  floor VARCHAR(20),
  room_type VARCHAR(50) DEFAULT 'Room',
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  available BOOLEAN DEFAULT TRUE NOT NULL
);

-- Table: payments
-- The core secure system ledger tracking STK Push transactions triggered via Ke-Safaricom API
CREATE TABLE payments (
  id VARCHAR(80) PRIMARY KEY, -- MPESA Checkout Request ID or custom system payment node
  user_id VARCHAR(80) REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
  user_name VARCHAR(150) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  purpose payment_purpose NOT NULL,
  target_id VARCHAR(100) NOT NULL, -- References property id or connection request string
  target_name VARCHAR(200) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  checkout_request_id VARCHAR(150) UNIQUE NOT NULL, -- Safaricom unique correlation key
  phone VARCHAR(20) NOT NULL, -- Payment phone utilized in the PIN prompt
  mpesa_receipt VARCHAR(50) UNIQUE, -- Filled with Safaricom response e.g., OEG377B8N1
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: connection_requests
-- Secure handshake request mapping renters/buyers to listing landlords.
-- Keeps details lockbox safe until verified payment has completed.
CREATE TABLE connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  renter_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  renter_name VARCHAR(150) NOT NULL,
  renter_phone VARCHAR(20) NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  property_name VARCHAR(200) NOT NULL,
  landlord_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  landlord_name VARCHAR(150) NOT NULL,
  landlord_contact_phone VARCHAR(20) NOT NULL,
  landlord_contact_whatsapp VARCHAR(20),
  price NUMERIC(12, 2) NOT NULL,
  payment_id VARCHAR(80) REFERENCES payments(id) ON DELETE SET NULL,
  status request_status NOT NULL DEFAULT 'pending',
  contact_revealed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: notifications
-- Standard inbox notifications for users & landlords
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: support_messages
-- Communications and escalations thread routed between customers and administrative HQ staff Desk
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  sender_name VARCHAR(150) NOT NULL,
  sender_role VARCHAR(50) NOT NULL,
  recipient_id VARCHAR(80) NOT NULL, -- e.g. "staff" or specific user's ID
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: site_settings
-- System configurations to store connection fees, listing cost rates and M-PESA parameters
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Single-row singleton enforcement technique
  listing_fee NUMERIC(12, 2) DEFAULT 100.00 NOT NULL CHECK (listing_fee >= 0),
  connection_fee_percent NUMERIC(5, 2) DEFAULT 10.00 NOT NULL CHECK (connection_fee_percent >= 0),
  mpesa_shortcode VARCHAR(50) NOT NULL DEFAULT '174379',
  mpesa_passkey TEXT NOT NULL,
  staff_whatsapp_number VARCHAR(20) NOT NULL DEFAULT '254711223344',
  whatsapp_api_key TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. SPEED & SEARCH PERFORMANCE INDEXES
-- =============================================================================

-- Search filters on counties and listing category
CREATE INDEX idx_properties_county_town ON properties(county, town);
CREATE INDEX idx_properties_listing_type ON properties(listing_type, status);
CREATE INDEX idx_properties_price ON properties(price);

-- MPESA webhook processing transaction correlation indexes
CREATE INDEX idx_payments_checkout_request ON payments(checkout_request_id);
CREATE INDEX idx_payments_status_purpose ON payments(status, purpose);

-- Quick connection fetch indexes
CREATE INDEX idx_connections_renter_status ON connection_requests(renter_id, status);
CREATE INDEX idx_connections_landlord ON connection_requests(landlord_id);

-- Unread messages query indexes
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE (read = FALSE);
CREATE INDEX idx_support_thread ON support_messages(sender_id, recipient_id);

-- =============================================================================
-- 4. BOOTSTRAP INITIAL DATA SEEDING (DEFAULT SYSTEM PARAMETERS)
-- =============================================================================

INSERT INTO site_settings (
  id, 
  listing_fee, 
  connection_fee_percent, 
  mpesa_shortcode, 
  mpesa_passkey, 
  staff_whatsapp_number
) VALUES (
  1, 
  100.00, 
  10.00, 
  '174379', 
  'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', 
  '254712345678'
) ON CONFLICT (id) DO NOTHING;
