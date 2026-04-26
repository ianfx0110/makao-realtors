import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

import { MakaoLogo } from '../brand/MakaoLogo';

export const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <MakaoLogo className="scale-90 origin-left" light />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
              Elevating Kenyan Living — Premium real estate locator and listing platform across all 47 counties.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-accent transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-brand-accent transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-brand-accent transition-colors"><Facebook size={20} /></a>
            </div>
          </div>


          <div>
            <h4 className="font-serif text-lg mb-6 text-brand-accent">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/listings" className="hover:text-white transition-colors">Property Search</Link></li>
              <li><Link to="/neighborhoods" className="hover:text-white transition-colors">Neighborhood Guides</Link></li>
              <li><Link to="/create-listing" className="hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Saved Listings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-brand-accent">Popular Areas</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/listings?search=Westlands" className="hover:text-white transition-colors">Westlands, Nairobi</Link></li>
              <li><Link to="/listings?search=Kilimani" className="hover:text-white transition-colors">Kilimani, Nairobi</Link></li>
              <li><Link to="/listings?search=Kapsoya" className="hover:text-white transition-colors">Kapsoya, Eldoret</Link></li>
              <li><Link to="/listings?search=Elgon View" className="hover:text-white transition-colors">Elgon View, Eldoret</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-brand-accent">Contact Information</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-brand-accent" />
                <span>info@makaorealtors.co.ke</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone size={16} className="text-brand-accent group-hover:scale-110 transition-transform" />
                <a href="tel:+2547115481162" className="hover:text-brand-accent transition-colors">+254 711 548 1162</a>
              </li>
              <li className="pt-2">
                <a 
                  href="https://wa.me/254115481162?text=Hello%20Makao%20Realtors%20Support%2C%20I%20have%20an%20inquiry." 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg"
                >
                  <MessageCircle size={16} />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© 2026 Makao Realtors. All rights reserved.</p>

          <div className="flex space-x-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
