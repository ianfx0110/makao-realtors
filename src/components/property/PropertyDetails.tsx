import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bed, 
  Bath, 
  Move, 
  MapPin, 
  Share2, 
  Heart, 
  CheckCircle2, 
  Phone, 
  Mail,
  Camera,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { listingService } from '../../services/listingService';
import { Property } from '../../types';
import { MortgageCalculator } from './MortgageCalculator';

export const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeImage, setActiveImage] = React.useState(0);
  const [showVirtualTour, setShowVirtualTour] = React.useState(false);

  React.useEffect(() => {
    const fetch = async () => {
      if (id) {
        setLoading(true);
        const data = await listingService.getListingById(id);
        setProperty(data);
        setLoading(false);
        // Record view
        listingService.recordView(id);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 text-center h-screen bg-brand-secondary">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-stone-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-stone-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-40 text-center h-screen bg-brand-secondary">
        <h1 className="text-4xl font-serif mb-4">Property Not Found</h1>
        <Link to="/listings" className="text-brand-accent hover:underline">Back to search</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-brand-secondary min-h-screen">
      {/* Property Header */}
      <section className="bg-white border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <Link to="/" className="hover:text-brand-accent">Home</Link>
                <span>/</span>
                <Link to="/listings" className="hover:text-brand-accent">Listings</Link>
                <span>/</span>
                <span className="text-brand-primary">{property.neighborhood}</span>
              </nav>
              <h1 className="text-4xl md:text-6xl font-serif text-brand-primary">{property.title}</h1>
              <div className="flex items-center text-gray-500 gap-2">
                <MapPin size={18} className="text-brand-accent" />
                <span className="text-lg font-light">{property.neighborhood}, {property.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="text-2xl md:text-4xl font-serif text-brand-accent font-bold">
                <span className="text-sm mr-2 font-sans font-normal text-gray-400">KES</span>
                {property.price.toLocaleString()}
                {property.status === 'rent' && <span className="text-lg font-sans font-normal text-gray-400 ml-1">/mo</span>}
              </div>
              <div className="flex gap-2">
                <button className="p-3 border hover:border-brand-accent hover:text-brand-accent transition-all text-gray-400"><Share2 size={20} /></button>
                <button className="p-3 border hover:border-brand-accent hover:text-brand-accent transition-all text-gray-400"><Heart size={20} /></button>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
            <div className="lg:col-span-8 relative group overflow-hidden border">
              {showVirtualTour ? (
                <div className="absolute inset-0 bg-brand-primary flex flex-col items-center justify-center text-white space-y-4">
                  <Layers size={48} className="animate-pulse text-brand-accent" />
                  <h3 className="text-2xl font-serif">Interactive Virtual Tour</h3>
                  <p className="text-gray-400">Loading 3D Experience of {property.title}...</p>
                  <button 
                    onClick={() => setShowVirtualTour(false)}
                    className="px-6 py-2 border border-white/20 hover:bg-white hover:text-brand-primary transition-all text-xs uppercase tracking-widest"
                  >
                    Back to Images
                  </button>
                </div>
              ) : (
                <img
                  src={property.images[activeImage]}
                  alt=""
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute bottom-6 left-6 flex gap-2">
                <button 
                  onClick={() => setShowVirtualTour(false)}
                  className={`px-4 py-2 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${!showVirtualTour ? 'bg-brand-primary text-white shadow-xl' : 'bg-white/80 text-brand-primary shadow-sm hover:bg-white'}`}
                >
                  <Camera size={14} /> Photos
                </button>
                <button 
                  onClick={() => setShowVirtualTour(true)}
                  className={`px-4 py-2 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${showVirtualTour ? 'bg-brand-primary text-white shadow-xl' : 'bg-white/80 text-brand-primary shadow-sm hover:bg-white'}`}
                >
                  <Layers size={14} /> 3D Tour
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(i);
                    setShowVirtualTour(false);
                  }}
                  className={`relative overflow-hidden border-2 transition-all ${activeImage === i && !showVirtualTour ? 'border-brand-accent' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover aspect-video lg:aspect-auto" />
                  <div className={`absolute inset-0 bg-black/20 ${activeImage === i ? 'opacity-0' : 'opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b">
                <div className="p-6 bg-white border border-gray-100 flex flex-col items-center">
                  <Bed className="text-brand-accent mb-2" />
                  <div className="text-2xl font-serif">{property.beds}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Bedrooms</div>
                </div>
                <div className="p-6 bg-white border border-gray-100 flex flex-col items-center">
                  <Bath className="text-brand-accent mb-2" />
                  <div className="text-2xl font-serif">{property.baths}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Bathrooms</div>
                </div>
                <div className="p-6 bg-white border border-gray-100 flex flex-col items-center">
                  <Move className="text-brand-accent mb-2" />
                  <div className="text-2xl font-serif">{property.sqft}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Square Feet</div>
                </div>
                <div className="p-6 bg-white border border-gray-100 flex flex-col items-center">
                  <CheckCircle2 className="text-brand-accent mb-2" />
                  <div className="text-2xl font-serif">{property.status}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Listing Type</div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-serif">Property Description</h3>
                <p className="text-gray-500 leading-relaxed font-light text-lg">
                  {property.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 pt-6">
                  {property.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-8 pt-12 border-t border-dashed">
                <h3 className="text-3xl font-serif">User Reviews</h3>
                {property.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {property.reviews.map((r) => (
                      <div key={r.id} className="bg-white p-8 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="font-serif text-xl">{r.userName}</div>
                          <div className="flex text-brand-accent">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 font-light italic">"{r.comment}"</p>
                        <div className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">{r.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No reviews yet for this listing. Be the first to share your experience.</p>
                )}
              </div>
            </div>

            {/* Right Column: Contact & Tools */}
            <div className="space-y-8">
              {/* Landlord Card */}
              <div className="bg-brand-primary text-white p-8 border border-brand-primary shadow-2xl">
                <h4 className="text-brand-accent uppercase tracking-[0.2em] text-[10px] font-bold mb-6">Listing Agent</h4>
                <div className="flex items-center gap-4 mb-8">
                  <img src={property.landlord.image} alt="" className="w-16 h-16 rounded-none object-cover border-2 border-brand-accent p-1" />
                  <div>
                    <div className="text-xl font-serif">{property.landlord.name}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Premium Agent</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <button className="w-full py-4 bg-brand-accent text-brand-primary text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-white transition-all">
                    <Phone size={14} /> {property.landlord.phone}
                  </button>
                  <button className="w-full py-4 border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-brand-primary transition-all">
                    <Mail size={14} /> Send Message
                  </button>
                </div>
              </div>

              {/* Calculator Sidebar */}
              <MortgageCalculator initialPrice={property.price} />
              
              {/* Related Section Guide */}
              <div className="p-8 border border-dashed border-gray-300">
                <h4 className="font-serif text-xl mb-4">Neighborhood Insight</h4>
                <p className="text-sm text-gray-500 font-light mb-6">
                  {property.neighborhood} is currently experiencing a 4.2% YoY growth in property values, making this 
                  an excellent investment choice for 2024.
                </p>
                <Link to="/neighborhoods" className="text-xs uppercase tracking-widest font-bold text-brand-accent hover:underline">
                  Read Full Area Guide
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
