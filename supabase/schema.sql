-- MAKAO REALTORS - SUPABASE SQL SCHEMA
-- Target: Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Handle Custom Types Safely
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('renter', 'landlord', 'seller', 'buyer', 'admin');
  END IF;
END $$;

-- 2. Drop existing tables if they exist (Be careful with production data)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS neighborhoods CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS mortgage_applications CASCADE;
DROP TABLE IF EXISTS property_tours CASCADE;
DROP TABLE IF EXISTS saved_properties CASCADE;
DROP TABLE IF EXISTS property_applications CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS listing_views CASCADE;

-- 3. User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY, -- Removed explicit ref to auth.users for demo flexibility
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'renter' CHECK (role IN ('admin', 'renter', 'landlord', 'buyer', 'seller')),
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Listings Table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  type TEXT CHECK (type IN ('bedsitter', 'studio', 'apartment', 'townhouse', 'villa', 'mansion', 'penthouse', 'land')),
  status TEXT DEFAULT 'rent' CHECK (status IN ('sale', 'rent')),
  beds INTEGER DEFAULT 0,
  baths INTEGER DEFAULT 0,
  area INTEGER,
  floor_level INTEGER,
  furnished BOOLEAN DEFAULT FALSE,
  images TEXT[],
  features TEXT[],
  amenities TEXT[],
  tags TEXT[],
  virtual_tour_url TEXT,
  video_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  completion_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search Indexes
CREATE INDEX IF NOT EXISTS listings_neighborhood_idx ON listings (neighborhood);
CREATE INDEX IF NOT EXISTS listings_location_idx ON listings (location);
CREATE INDEX IF NOT EXISTS listings_title_idx ON listings (title);
CREATE INDEX IF NOT EXISTS listings_type_idx ON listings (type);
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status);

-- 5. Support Tickets Table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notifications Table (Broadcasts & Direct)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE, -- NULL for global broadcast
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Saved Searches Table
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  query_params JSONB NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Mortgage Applications Table
CREATE TABLE mortgage_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  amount NUMERIC,
  lender_name TEXT,
  interest_rate NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Property Tours (Viewings) Table
CREATE TABLE property_tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  feedback TEXT,
  reminders_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Saved Properties (Favorites) Table
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- 11. Property Applications Table (Renters/Buyers)
CREATE TABLE property_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected')),
  message TEXT,
  document_urls TEXT[],
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Leads Table (Sellers/Landlords)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Neighborhoods Table
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  avg_price NUMERIC,
  amenities TEXT[],
  safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
  commute_score INTEGER CHECK (commute_score >= 0 AND commute_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. Blogs Table
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- Rich text/Markdown
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES user_profiles(id),
  category TEXT NOT NULL DEFAULT 'Market Trends',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  read_time INTEGER DEFAULT 5,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Listing Views (for Analytics)
CREATE TABLE listing_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Direct Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Payments Table (for Revenue Tracking)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL, -- e.g., 'listing_fee', 'verification_fee'
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Row Level Security (RLS) Settings
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 21. RLS Policies for new tables

-- Reviews: Viewable by everyone, created by authenticated reviewers
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Messages: Sent or received by user
CREATE POLICY "Users see own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Payments: Users see own, Admins see all
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 22. Row Level Security (RLS) Settings
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 22. Role Change Requests Table
CREATE TABLE role_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('renter', 'landlord', 'buyer', 'seller')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;

-- 23. RLS Policies

-- User Profiles: Users can view all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Everyone can view, but only owners/admins can manage
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Owners can manage their listings" ON listings FOR ALL USING (auth.uid() = owner_id);

-- Neighborhoods: Everyone can view, only admins can manage
CREATE POLICY "Neighborhoods are viewable by everyone" ON neighborhoods FOR SELECT USING (true);
CREATE POLICY "Only admins can manage neighborhoods" ON neighborhoods FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Support Tickets: Users can only see their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications: Users see notifications targetted at them or global ones
CREATE POLICY "Users see their notifications" ON notifications FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Relational data: Standard user access
CREATE POLICY "Users manage own searches" ON saved_searches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own mortgage_apps" ON mortgage_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own tours" ON property_tours FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own favorites" ON saved_properties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own applications" ON property_applications FOR ALL USING (auth.uid() = user_id);

-- Role Change Requests Policies
CREATE POLICY "Users view own role requests" ON role_change_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create role requests" ON role_change_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage role requests" ON role_change_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Blogs Policies
CREATE POLICY "Published blogs are viewable by everyone" ON blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage all blogs" ON blogs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads and Views: Restricted to Listing Owner
CREATE POLICY "Owners see their leads" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM listings WHERE id = leads.listing_id AND owner_id = auth.uid())
);
CREATE POLICY "Everyone can create leads" ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners see their views" ON listing_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM listings WHERE id = listing_views.listing_id AND owner_id = auth.uid())
);
CREATE POLICY "Everyone can create views" ON listing_views FOR INSERT WITH CHECK (true);

-- 16. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_mortgage_apps_updated_at BEFORE UPDATE ON mortgage_applications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_property_apps_updated_at BEFORE UPDATE ON property_applications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_role_change_requests_updated_at BEFORE UPDATE ON role_change_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();