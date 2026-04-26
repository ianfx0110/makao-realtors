/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Listings } from './components/property/Listings';
import { PropertyDetails } from './components/property/PropertyDetails';
import { NeighborhoodGuides } from './components/home/NeighborhoodGuides';

// Auth & Admin
import { AuthProvider } from './context/AuthContext';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProfileSettings } from './pages/settings/ProfileSettings';

// Landing Pages
import { MainLanding } from './pages/landing/MainLanding';
import { AboutMakao } from './pages/landing/About';
import { OurServices } from './pages/landing/Services';
import { LegalPage } from './pages/landing/Legal';
import { Blog } from './pages/landing/Blog';
import { BlogDetail } from './pages/landing/BlogDetail';
import { Neighborhoods } from './pages/neighborhoods/Neighborhoods';
import { Favorites } from './pages/property/Favorites';

// Role Specific Pages
import { BlogManagement } from './pages/admin/BlogManagement';
import * as AdminPages from './pages/admin/Users';
import { AdminDashboard } from './components/admin/Dashboard';
import { AdminBroadcast } from './pages/admin/Broadcast';
import { SupportTickets } from './pages/admin/Support';
import { AdminSettings } from './pages/admin/Settings';
import { AdminProperties } from './pages/admin/Properties';
import { NeighborhoodManagement } from './pages/admin/Neighborhoods';

import { RenterHome } from './pages/renters/Home';
import { Support as RenterSupport } from './pages/renters/Support';
import { Notifications as RenterNotifications } from './pages/renters/Notifications';

import { LandlordHome } from './pages/landlords/Home';
import { Support as LandlordSupport } from './pages/landlords/Support';
import { Notifications as LandlordNotifications } from './pages/landlords/Notifications';

import { BuyerHome } from './pages/buyers/Home';
import { Support as BuyerSupport } from './pages/buyers/Support';
import { Notifications as BuyerNotifications } from './pages/buyers/Notifications';

import { SellerHome } from './pages/sellers/Home';
import { Support as SellerSupport } from './pages/sellers/Support';
import { Notifications as SellerNotifications } from './pages/sellers/Notifications';

import { CreateListing } from './pages/property/CreateListing';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen selection:bg-brand-accent selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<MainLanding />} />
                <Route path="/about" element={<AboutMakao />} />
                <Route path="/services" element={<OurServices />} />
                <Route path="/privacy" element={<LegalPage />} />
                <Route path="/terms" element={<LegalPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/neighborhoods" element={<Neighborhoods />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/support" element={<SupportTickets />} /> 
                <Route path="/contact" element={<RenterSupport />} />
                <Route path="/create-listing" element={
                  <ProtectedRoute allowedRoles={['landlord', 'seller', 'admin']}>
                    <CreateListing />
                  </ProtectedRoute>
                } />
                <Route path="/property/:id" element={<PropertyDetails />} />
                
                {/* Auth */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Dashboard Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/listings" element={<ProtectedRoute allowedRoles={['admin']}><AdminProperties /></ProtectedRoute>} />
                <Route path="/admin/broadcast" element={<ProtectedRoute allowedRoles={['admin']}><AdminBroadcast /></ProtectedRoute>} />
                <Route path="/admin/support" element={<ProtectedRoute allowedRoles={['admin']}><SupportTickets /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
                <Route path="/admin/neighborhoods" element={<ProtectedRoute allowedRoles={['admin']}><NeighborhoodManagement /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminPages.UserManagement /></ProtectedRoute>} />
                <Route path="/admin/blogs" element={<ProtectedRoute allowedRoles={['admin']}><BlogManagement /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

                <Route path="/renter" element={<ProtectedRoute allowedRoles={['renter', 'admin']}><RenterHome /></ProtectedRoute>} />
                <Route path="/renter/home" element={<ProtectedRoute allowedRoles={['renter', 'admin']}><RenterHome /></ProtectedRoute>} />
                <Route path="/renter/listings" element={<ProtectedRoute allowedRoles={['renter', 'admin']}><Listings /></ProtectedRoute>} />
                <Route path="/renter/support" element={<ProtectedRoute allowedRoles={['renter', 'admin']}><RenterSupport /></ProtectedRoute>} />
                <Route path="/renter/notifications" element={<ProtectedRoute allowedRoles={['renter', 'admin']}><RenterNotifications /></ProtectedRoute>} />
                <Route path="/renter/settings" element={<ProtectedRoute allowedRoles={['renter', 'admin']}><ProfileSettings /></ProtectedRoute>} />

                <Route path="/landlord" element={<ProtectedRoute allowedRoles={['landlord', 'admin']}><LandlordHome /></ProtectedRoute>} />
                <Route path="/landlord/home" element={<ProtectedRoute allowedRoles={['landlord', 'admin']}><LandlordHome /></ProtectedRoute>} />
                <Route path="/landlord/listings" element={<ProtectedRoute allowedRoles={['landlord', 'admin']}><CreateListing /></ProtectedRoute>} />
                <Route path="/landlord/support" element={<ProtectedRoute allowedRoles={['landlord', 'admin']}><LandlordSupport /></ProtectedRoute>} />
                <Route path="/landlord/notifications" element={<ProtectedRoute allowedRoles={['landlord', 'admin']}><LandlordNotifications /></ProtectedRoute>} />
                <Route path="/landlord/settings" element={<ProtectedRoute allowedRoles={['landlord', 'admin']}><ProfileSettings /></ProtectedRoute>} />

                <Route path="/buyer" element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><BuyerHome /></ProtectedRoute>} />
                <Route path="/buyer/home" element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><BuyerHome /></ProtectedRoute>} />
                <Route path="/buyer/listings" element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><Listings /></ProtectedRoute>} />
                <Route path="/buyer/support" element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><BuyerSupport /></ProtectedRoute>} />
                <Route path="/buyer/notifications" element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><BuyerNotifications /></ProtectedRoute>} />
                <Route path="/buyer/settings" element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><ProfileSettings /></ProtectedRoute>} />

                <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SellerHome /></ProtectedRoute>} />
                <Route path="/seller/home" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SellerHome /></ProtectedRoute>} />
                <Route path="/seller/listings" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><CreateListing /></ProtectedRoute>} />
                <Route path="/seller/support" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SellerSupport /></ProtectedRoute>} />
                <Route path="/seller/notifications" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SellerNotifications /></ProtectedRoute>} />
                <Route path="/seller/settings" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><ProfileSettings /></ProtectedRoute>} />
                {/* ...Additional routes mapped to the 25+ pages created... */}
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

