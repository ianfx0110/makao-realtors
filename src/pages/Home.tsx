import React from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedListings } from '../components/home/FeaturedListings';
import { Neighborhoods } from '../components/home/Neighborhoods';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <FeaturedListings />
      
      {/* Testimonial / Credibility Section */}
      <section className="py-24 bg-brand-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-brand-accent mb-8 font-serif text-6xl">"</div>
          <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
            "BomaHub helped us find our dream home in Runda within two weeks. The virtual tours were 
            indistinguishable from reality, saving us countless hours of driving."
          </h2>
          <div className="space-y-1">
            <div className="font-serif text-xl">The Odhiambo Family</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Property Owners in Runda</div>
          </div>
        </div>
      </section>

      <Neighborhoods />
      
      {/* FAQ Section */}
      <section className="py-32 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-brand-accent uppercase tracking-[0.25em] text-[10px] font-bold mb-4 block">Knowledge Base</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-6">Frequently Asked <span className="text-brand-accent italic">Questions</span></h2>
            <p className="text-stone-500 font-light text-left">Everything you need to know about navigating the Makao ecosystem.</p>          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "How do I verify a property listing?",
                a: "Every listing on Makao Realtors undergoes a rigorous 3-step verification process. Our field agents physically visit the location, verify land title deeds with the ministry, and ensure the landlord's identification is valid before a 'Verified' badge is issued."
              },
              {
                q: "What are the fees for listing my property?",
                a: "For landlords and sellers, listing is free for the first 30 days. After that, we offer premium placement packages starting from KES 5,000 per month. We do not take commission on the final sale or lease unless you use our VIP closing services."
              },
              {
                q: "Can I schedule a virtual tour?",
                a: "Yes, many of our luxury listings come with high-definition 3D virtual tours. For properties without this feature, you can request a live WhatsApp video tour with one of our verified agents directly from the property details page."
              },
              {
                q: "Is my personal data secure?",
                a: "Absolutely. We use bank-grade encryption for all user data and never share your contact details with third parties until you explicitly express interest in a specific property to a verified lister."
              }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm"
              >
                <h4 className="text-lg font-serif text-brand-primary mb-4 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs font-bold font-sans">0{i+1}</span>
                  {faq.q}
                </h4>
                <p className="text-stone-500 font-light leading-relaxed pl-12">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-stone-400 text-sm mb-6">Still have questions?</p>
            <Link to="/support" className="inline-flex items-center gap-3 text-brand-accent font-bold uppercase tracking-widest text-[10px] hover:gap-5 transition-all">
              Contact Support <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-1/4 h-full bg-brand-accent/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-8">Ready to <span className="italic">list your property?</span></h2>
          <p className="max-w-xl text-gray-500 font-light mb-12">
            Join Kenya's fastest-growing premium property network. List your villas, apartments, or land 
            and reach thousands of verified buyers today.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="px-12 py-5 bg-brand-primary text-white text-xs uppercase tracking-widest font-bold hover:bg-brand-accent transition-all">
              List Your Property
            </button>
            <button className="px-12 py-5 border border-brand-primary text-brand-primary text-xs uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-white transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
