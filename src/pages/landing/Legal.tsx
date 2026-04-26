import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const LegalPage = () => {
  const { pathname } = useLocation();
  const isPrivacy = pathname.includes('privacy');

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-secondary text-stone-900">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-brand-accent transition-colors mb-12 text-sm">
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-stone-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-brand-accent/10 rounded-2xl text-brand-accent">
              {isPrivacy ? <Shield size={32} /> : <FileText size={32} />}
            </div>
            <div>
              <h1 className="text-4xl font-serif text-brand-primary">
                {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
              </h1>
              <p className="text-stone-400 text-sm mt-1">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none space-y-8 text-stone-600 font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using Makao Realtors, you agree to be bound by these {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}. 
                Our platform is designed to provide premium real estate services in Kenya, and your compliance with these terms ensures 
                a secure and high-quality experience for all users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4">{isPrivacy ? '2. Data Collection' : '2. Use of Platform'}</h2>
              <p>
                {isPrivacy 
                  ? 'We collect information that identifies, relates to, describes, or could reasonably be linked with a particular user. This includes contact details, search preferences, and interactions with property listings to enhance our locator services.'
                  : 'You may use our platform only for lawful purposes. You are responsible for ensuring that all persons who access our platform through your internet connection are aware of these terms and comply with them.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4">3. Premium Standards</h2>
              <p>
                Makao Realtors maintains an elitist real estate ecosystem. We reserve the right to verify all listings and 
                remove any content that does not meet our high-quality visual and informational standards without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4">4. Limitation of Liability</h2>
              <p>
                Makao Realtors acts as a locator service and facilitator. While we strive for absolute accuracy in our listings, 
                we are not liable for discrepancies in property details provided by third-party landlords or agents.
              </p>
            </section>

            <div className="pt-12 border-t border-stone-100 text-sm text-stone-400 italic">
              For any inquiries regarding our legal framework, please contact our legal department at legal@makaorealtors.co.ke
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
