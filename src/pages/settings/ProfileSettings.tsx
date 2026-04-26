import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Shield, Bell, CreditCard, Trash2, Save, LayoutGrid, Sun, Moon, Briefcase, Tag, Home as HomeIcon, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [profilePic, setProfilePic] = React.useState<string | null>(null);
  const [requestStatus, setRequestStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pendingRequest, setPendingRequest] = React.useState<any>(null);

  React.useEffect(() => {
    if (user) {
      fetchPendingRequest();
    }
  }, [user]);

  const fetchPendingRequest = async () => {
    const { data } = await supabase
      .from('role_change_requests')
      .select('*')
      .eq('user_id', user?.id)
      .eq('status', 'pending')
      .maybeSingle();
    
    if (data) setPendingRequest(data);
  };

  const handleRoleRequest = async (requestedRole: string) => {
    if (!user) return;
    setRequestStatus('loading');
    try {
      const { error } = await supabase
        .from('role_change_requests')
        .insert([{
          user_id: user.id,
          requested_role: requestedRole,
          status: 'pending'
        }]);
      
      if (error) throw error;
      setRequestStatus('success');
      fetchPendingRequest();
    } catch (error) {
      console.error('Error requesting role change:', error);
      setRequestStatus('error');
    }
  };
  
  const sections = [
    { id: 'profile', name: 'Profile Info', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: LayoutGrid },
    { id: 'role', name: 'Account Type', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  const [activeSection, setActiveSection] = React.useState('profile');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-display mb-2">Account <span className="text-brand-accent">Settings</span></h1>
          <p className="text-stone-500 font-light text-sm">Manage your personal information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  activeSection === section.id
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'bg-white text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                }`}
              >
                <section.icon size={18} />
                {section.name}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
             <motion.div
               key={activeSection}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bento-card p-8"
             >
               {activeSection === 'profile' && (
                 <div className="space-y-8">
                   <div className="flex flex-col md:row items-start md:items-center gap-8 border-b border-stone-100 pb-8">
                     <div className="relative group">
                       <div className="w-24 h-24 rounded-2xl bg-stone-100 overflow-hidden border-2 border-stone-200">
                         {profilePic ? (
                           <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-stone-300">
                             <User size={40} />
                           </div>
                         )}
                       </div>
                       <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-accent text-white rounded-lg flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                         <Camera size={16} />
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                       </label>
                     </div>
                     <div>
                       <h3 className="text-xl font-bold mb-1">Profile Picture</h3>
                       <p className="text-stone-400 text-xs font-light max-w-xs">
                         Upload a professional photo. JPG or PNG, max 1MB.
                       </p>
                       <button 
                         onClick={() => setProfilePic(null)}
                         className="mt-2 text-[10px] uppercase font-bold text-red-400 hover:text-red-600 transition-colors"
                        >
                         Remove Photo
                       </button>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Display Name</label>
                       <div className="relative">
                         <input 
                           type="text" 
                           defaultValue={user?.name}
                           className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                         />
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Phone Number</label>
                       <div className="relative">
                         <input 
                           type="tel" 
                           defaultValue={user?.phone || '+254'}
                           className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                         />
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                       </div>
                     </div>
                     <div className="md:col-span-2">
                       <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Email Address</label>
                       <div className="relative opacity-60">
                         <input 
                           type="email" 
                           disabled
                           defaultValue={user?.email}
                           className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 outline-none text-sm cursor-not-allowed" 
                         />
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                       </div>
                       <p className="text-[8px] text-stone-400 mt-2 uppercase font-bold tracking-widest text-right">Email cannot be changed</p>
                     </div>
                   </div>

                   <div className="pt-8 border-t border-stone-100 flex justify-between items-center">
                     <button className="text-[10px] uppercase font-bold text-red-400 hover:text-red-600 flex items-center gap-2">
                       <Trash2 size={14} /> Deactivate Account
                     </button>
                     <button className="btn-pill bg-brand-primary text-white hover:bg-brand-accent flex items-center gap-2 px-8">
                       <Save size={16} /> Save Changes
                     </button>
                   </div>
                 </div>
               )}

               {activeSection === 'security' && (
                 <div className="space-y-8">
                    <h3 className="text-xl font-bold mb-6">Security Settings</h3>
                    <div className="space-y-6">
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="text-sm font-bold">Two-Factor Authentication</div>
                            <p className="text-[10px] text-stone-400">Add an extra layer of security to your account.</p>
                          </div>
                          <div className="w-12 h-6 bg-stone-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Change Password</h4>
                        <input 
                          type="password" 
                          placeholder="Current Password"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                        />
                        <input 
                          type="password" 
                          placeholder="New Password"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-accent/20 outline-none text-sm" 
                        />
                      </div>
                    </div>
                 </div>
               )}

               {activeSection === 'notifications' && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-6">Notifications</h3>
                    {[
                      { title: 'New Listings', desc: 'Get notified when a property matches your preferences.' },
                      { title: 'Marketing', desc: 'Receive updates about new features and promotions.' },
                      { title: 'Messages', desc: 'Alerts for neighborhood chats and agent inquiries.' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 hover:bg-stone-50 rounded-2xl transition-colors shrink-0">
                        <div>
                          <div className="text-sm font-bold">{item.title}</div>
                          <p className="text-[10px] text-stone-400">{item.desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="accent-brand-accent w-4 h-4" />
                      </div>
                    ))}
                 </div>
               )}

                {activeSection === 'appearance' && (
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold mb-6">Appearance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 border-2 border-brand-accent rounded-3xl bg-white text-left space-y-4">
                        <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-amber-500">
                          <Sun size={24} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Light Mode</div>
                          <div className="text-[10px] text-stone-400">Default clean experience</div>
                        </div>
                      </button>
                      <button className="p-6 border border-stone-100 rounded-3xl bg-stone-900 text-white text-left space-y-4 opacity-50 cursor-not-allowed">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400">
                          <Moon size={24} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Dark Mode</div>
                          <div className="text-[10px] opacity-60">Coming soon</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'role' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Account Category</h3>
                      <p className="text-stone-400 text-xs font-light">Switch your account type to access specialized features.</p>
                    </div>

                    {pendingRequest ? (
                      <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2rem] flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-sm">
                          <Clock size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-amber-900 mb-2">Request Pending</h4>
                        <p className="text-sm text-amber-700 font-light mb-6">
                          Your request to become a <span className="font-bold uppercase tracking-widest">{pendingRequest.requested_role}</span> is currently under review by our administration.
                        </p>
                        <div className="text-[10px] uppercase font-bold text-amber-400 tracking-widest bg-amber-100/50 px-4 py-2 rounded-full">
                          Awaiting Admin Approval
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { role: 'landlord', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'List and manage rental properties' },
                          { role: 'seller', icon: Tag, color: 'text-green-500', bg: 'bg-green-50', desc: 'Sell properties and receive leads' },
                          { role: 'renter', icon: HomeIcon, color: 'text-purple-500', bg: 'bg-purple-50', desc: 'Find and apply for rental homes' },
                          { role: 'buyer', icon: Tag, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Browse and purchase properties' }
                        ].map((item) => (
                          <button 
                            key={item.role}
                            onClick={() => handleRoleRequest(item.role)}
                            disabled={user?.role === item.role}
                            className={`p-6 border rounded-3xl text-left space-y-4 transition-all group ${
                              user?.role === item.role 
                                ? 'border-brand-accent bg-stone-50 cursor-default'
                                : 'border-stone-100 hover:border-brand-accent hover:shadow-xl hover:-translate-y-1'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color}`}>
                                <item.icon size={24} />
                              </div>
                              {user?.role === item.role && (
                                <div className="text-[8px] uppercase font-bold bg-brand-accent text-white px-2 py-1 rounded-md">Active</div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm capitalize">{item.role} Account</div>
                              <div className="text-[10px] text-stone-400 font-light leading-relaxed">{item.desc}</div>
                            </div>
                            {user?.role !== item.role && (
                              <div className="pt-2 text-[8px] uppercase font-bold text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">Request Switch →</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {requestStatus === 'success' && !pendingRequest && (
                      <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700">
                        <CheckCircle2 size={18} />
                        <span className="text-xs font-bold">Request submitted successfully!</span>
                      </div>
                    )}
                  </div>
                )}

               {activeSection === 'billing' && (
                 <div className="text-center py-12">
                   <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                     <CreditCard size={32} />
                   </div>
                   <h3 className="text-lg font-bold">No Active Subscriptions</h3>
                   <p className="text-stone-400 text-sm font-light mt-2">You are currently on the Free Starter plan.</p>
                   <button className="mt-6 btn-pill bg-brand-accent text-white hover:bg-brand-primary">
                     View Premium Plans
                   </button>
                 </div>
               )}
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
