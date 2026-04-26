import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/home/Hero';
import { FeaturedListings } from '../../components/property/FeaturedListings';
import { AppShowcase } from '../../components/home/AppShowcase';

export const MainLanding = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-stone-50"
    >
      <Hero />
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary">Handpicked <span className="text-brand-accent italic">Residences</span></h2>
            <p className="text-stone-500 font-light mt-2 max-w-2xl text-lg">
              Curated listings for renters from verified landlords and exclusive opportunities for buyers from trusted sellers.
            </p>
          </div>
          <Link to="/listings" className="btn-pill bg-brand-primary text-white hover:bg-brand-accent">
            View All
          </Link>
        </div>
        <FeaturedListings />
      </section>
      <AppShowcase />
    </motion.div>
  );
};
