import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

import { MakaoLogo } from '../../components/brand/MakaoLogo';

export const SignIn = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First check if user exists in our DB to get their real role
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profile) {
        signIn(email, profile.role, profile.name, profile.phone);
      } else {
        // Fallback or alert if user doesn't exist? 
        // For a smoother demo, we'll allow sign in but default to 'renter' 
        // if they aren't in the DB yet (though they should be after signing up)
        signIn(email, 'renter');
      }
      
      navigate('/');
    } catch (error) {
      console.error('SignIn error:', error);
      signIn(email, 'renter');
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bento-card shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-110">
            <MakaoLogo />
          </Link>
          <h1 className="text-3xl font-display">Welcome Back</h1>
          <p className="text-stone-500 text-sm mt-2 font-light">Access your premium Makao account</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                placeholder="name@example.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg active:scale-95 ${
              isSubmitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-accent'
            }`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center text-sm text-stone-500">
          Don't have an account? <Link to="/signup" className="text-brand-accent font-bold">Sign Up</Link>
        </div>
      </motion.div>
    </div>
  );
};

