import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

import { MakaoLogo } from '../../components/brand/MakaoLogo';

export const SignUp = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'renter'
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: formData.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // We use upsert here to be safe: it works if trigger already created it
        // or if trigger failed/doesn't exist.
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't necessarily want to block the user if the profile insert fails
          // but they are signed up in Auth.
        }
      }

      alert('Successfully created account! Please check your email for a confirmation link.');
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'An error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bento-card shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-110">
            <MakaoLogo />
          </Link>
          <h1 className="text-3xl font-display">Create Account</h1>
          <p className="text-stone-500 text-sm mt-2 font-light">Join Kenya's most advanced property ecosystem</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                  placeholder="John Doe"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                  placeholder="+254..."
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-brand-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>


          <div>
            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-3">User Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'renter', label: 'Renter' },
                { id: 'buyer', label: 'Buyer' },
                { id: 'landlord', label: 'Landlord' },
                { id: 'seller', label: 'Seller' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({...formData, role: opt.id})}
                  className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    formData.role === opt.id 
                    ? 'bg-brand-primary text-white border-brand-primary shadow-md' 
                    : 'bg-white text-stone-400 border-stone-100 hover:border-brand-accent hover:text-brand-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg active:scale-95 ${
              isSubmitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-accent'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center text-sm text-stone-500">
          Already have an account? <Link to="/signin" className="text-brand-accent font-bold">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};
