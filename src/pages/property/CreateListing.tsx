import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Plus, Save, AlertCircle } from 'lucide-react';
import { KENYA_COUNTIES } from '../../constants/kenya';
import { useAuth } from '../../context/AuthContext';
import { listingService } from '../../services/listingService';

export const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (!user || (user.role !== 'landlord' && user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const [formData, setFormData] = React.useState({
    title: '',
    county: 'Nairobi',
    neighborhood: '',
    price: '',
    type: 'apartment',
    status: 'rent',
    beds: 1,
    baths: 1,
    area: '',
    description: '',
    images: ['', '', ''],
    features: ''
  });

  const fileInputRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null)
  ];

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeImages = formData.images.filter(img => img.trim() !== '');
    if (activeImages.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.county,
        neighborhood: formData.neighborhood,
        county: formData.county,
        price: Number(formData.price),
        type: formData.type,
        status: formData.status as 'rent' | 'sale',
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        sqft: Number(formData.area),
        images: activeImages,
        features: formData.features.split(',').map(f => f.trim()),
        virtualTourUrl: '',
        landlord: {
          name: user?.name || 'Owner',
          phone: '',
          email: user?.email || '',
          image: ''
        }
      };

      await listingService.createListing(propertyData);
      alert('Listing created successfully! Awaiting admin verification.');
      navigate('/listings');
    } catch (error) {
      console.error('Error in handleCreate:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.price && formData.neighborhood && formData.area;

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newImages = [...formData.images];
      newImages[index] = base64String;
      setFormData({ ...formData, images: newImages });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display">New <span className="text-brand-accent italic">Listing</span></h1>
          <p className="text-stone-500 mt-2">Publish your property to Kenya's premium residence locator.</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-8 h-1 rounded-full ${step >= s ? 'bg-brand-accent' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleCreate} className="space-y-8">
        {step === 1 && (
          <div className="bento-card">
            <h3 className="text-xl font-bold mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Property Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Modern Duplex in Kilimani"
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">County</label>
                <select 
                  value={formData.county}
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                >
                  {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Price (KES)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. 85000"
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Property Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="bedsitter">Bedsitter</option>
                  <option value="studio">Studio</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="villa">Villa</option>
                  <option value="mansion">Mansion</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="land">Commercial/Land</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Beds</label>
                <input 
                  type="number" 
                  value={formData.beds}
                  onChange={(e) => setFormData({...formData, beds: parseInt(e.target.value)})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Neighborhood</label>
                <input 
                  type="text" 
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  placeholder="e.g. Kilimani"
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Area (sqft)</label>
                <input 
                  type="number" 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="e.g. 1200"
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Baths</label>
                <input 
                  type="number" 
                  value={formData.baths}
                  onChange={(e) => setFormData({...formData, baths: parseInt(e.target.value)})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Features (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="Gym, Pool, CCTV"
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="mt-8 bg-brand-primary text-white w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bento-card">
            <h3 className="text-xl font-bold mb-6">Media & Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <div 
                    onClick={() => fileInputRefs[i].current?.click()}
                    className="aspect-square bg-stone-50 border border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-400 overflow-hidden relative group cursor-pointer hover:border-brand-accent transition-all"
                  >
                    {formData.images[i] ? (
                      <div className="relative w-full h-full">
                        <img src={formData.images[i]} alt={`Preview ${i+1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] uppercase font-bold">
                          Change Photo
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera size={24} />
                        <span className="text-[8px] uppercase font-bold mt-2">Photo {i+1}</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file"
                    accept="image/*"
                    ref={fileInputRefs[i]}
                    onChange={(e) => handleFileChange(i, e)}
                    className="hidden"
                  />
                  {formData.images[i] && (
                    <button 
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages[i] = '';
                        setFormData({...formData, images: newImages});
                      }}
                      className="text-[8px] uppercase font-bold text-red-400 hover:text-red-500 w-full text-center"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Detailed Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 h-48 outline-none"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 bg-stone-100 text-stone-500 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)}
                className="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                Final Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bento-card bg-brand-primary text-white">
            <h3 className="text-xl font-bold mb-6">Ready to Publish</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase font-bold opacity-50">Property</span>
                <span className="text-sm font-bold">{formData.title || 'Untitled'}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase font-bold opacity-50">Location</span>
                <span className="text-sm font-bold">{formData.county}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase font-bold opacity-50">Price</span>
                <span className="text-sm font-bold text-brand-accent">KES {formData.price}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase font-bold opacity-50">Details</span>
                <span className="text-sm font-bold">{formData.beds} Beds • {formData.baths} Baths • {formData.area} sqft</span>
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-2xl transition-all ${
                isSubmitting || !isFormValid 
                  ? 'bg-stone-300 cursor-not-allowed' 
                  : 'bg-brand-accent text-white hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
