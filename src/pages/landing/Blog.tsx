import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService, Blog as BlogType } from '../../services/blogService';

export const Blog = () => {
  const [blogs, setBlogs] = React.useState<BlogType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-brand-secondary flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
      </div>
    );
  }

  const featuredBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-20 text-left">
          <span className="text-brand-accent uppercase tracking-[0.25em] text-[10px] font-bold mb-4 block">Makao Insider</span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-primary mb-6 leading-tight">Wisdom for the <span className="text-brand-accent italic">Discerning</span></h1>
          <p className="text-stone-500 text-lg font-light leading-relaxed">
            Market insights, architectural inspiration, and expert investment strategies 
            curated for Kenya's elite real estate landscape.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-40">
            <p className="text-stone-400 font-light">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-20">
            {/* Featured Post */}
            {featuredBlog && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer relative"
              >
                <Link to={`/blog/${featuredBlog.slug}`}>
                  <div className="h-[600px] rounded-[3.5rem] overflow-hidden relative mb-10 shadow-2xl">
                    <img 
                      src={featuredBlog.featured_image || 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&q=80'} 
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent" />
                    
                    <div className="absolute bottom-16 left-16 right-16">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="bg-brand-accent text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Featured Article
                        </span>
                        <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase font-bold tracking-widest">
                          <Calendar size={14} />
                          {new Date(featuredBlog.created_at || '').toLocaleDateString('en-KE', { dateStyle: 'long' })}
                        </div>
                      </div>
                      <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight max-w-3xl">
                        {featuredBlog.title}
                      </h2>
                      <div className="flex items-center gap-2 group/btn">
                        <span className="text-brand-accent text-[12px] uppercase font-bold tracking-[0.3em]">Read Feature Article</span>
                        <ArrowRight size={16} className="text-white transform group-hover/btn:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {otherBlogs.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm flex flex-col hover:shadow-2xl transition-all duration-500 group relative"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={post.featured_image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary border border-white/50">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-stone-300 tracking-widest">
                        <User size={12} className="text-brand-accent" />
                        {(post as any).author?.name || 'Makao Team'}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-stone-300 tracking-widest">
                        <Clock size={12} />
                        {post.read_time} min
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif text-brand-primary mb-4 group-hover:text-brand-accent transition-colors leading-tight min-h-[4rem]">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 font-light mb-8 leading-relaxed line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="mt-auto flex items-center justify-between group/link"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary group-hover/link:text-brand-accent transition-colors">
                        View More
                      </span>
                      <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover/link:bg-brand-accent group-hover/link:text-white transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-32 bg-brand-primary rounded-[3.5rem] p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/5 -skew-x-12 transform translate-x-20" />
          <div className="max-w-2xl relative z-10 text-left">
            <h2 className="text-4xl font-serif text-white mb-6">Join the <span className="text-brand-accent">Inner Circle</span></h2>
            <p className="text-white/60 font-light mb-10 leading-relaxed">
              Get the latest market analysis and exclusive pre-listed property notifications delivered directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-4 focus:ring-brand-accent/20 transition-all"
              />
              <button type="submit" className="bg-brand-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-brand-primary transition-all shadow-xl whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
