import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { blogService, Blog } from '../../services/blogService';

export const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const data = await blogService.getBlogBySlug(slug!);
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-brand-secondary flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-brand-secondary text-center px-6">
        <h1 className="text-4xl font-serif text-brand-primary mb-6">Article Not Found</h1>
        <p className="text-stone-500 font-light mb-10">The piece of wisdom you're looking for seems to have moved or deleted.</p>
        <Link to="/blog" className="bg-brand-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-stone-400 hover:text-brand-accent transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Insights
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {blog.category}
            </span>
            <div className="flex items-center gap-2 text-stone-300 text-[10px] uppercase font-bold tracking-widest">
              <Calendar size={14} />
              {new Date(blog.created_at || '').toLocaleDateString('en-KE', { dateStyle: 'long' })}
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-primary mb-10 leading-[1.1]">
            {blog.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border-y border-stone-50 py-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden">
                <img src={(blog as any).author?.avatar_url || 'https://i.pravatar.cc/150'} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Written by</p>
                <p className="text-lg font-serif text-brand-primary">{(blog as any).author?.name || 'Makao Editorial Team'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-stone-400 text-xs font-light mr-4">
                <Clock size={16} />
                {blog.read_time} min read
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-stone-400 hover:text-brand-accent hover:bg-stone-50 rounded-2xl transition-all"><Share2 size={20} /></button>
                <button className="p-3 text-stone-400 hover:text-brand-accent hover:bg-stone-50 rounded-2xl transition-all"><Bookmark size={20} /></button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl h-[500px]"
        >
          <img src={blog.featured_image} alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Content */}
        <article className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-primary prose-p:font-light prose-p:leading-relaxed prose-p:text-stone-600 prose-img:rounded-[2.5rem]">
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
        </article>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-stone-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-stone-400 px-4 py-2 bg-stone-50 rounded-full">#{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">Share Wisdom</span>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-brand-primary hover:text-white transition-all"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-brand-primary hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-brand-primary hover:text-white transition-all"><Linkedin size={18} /></a>
              </div>
            </div>
          </div>
        </footer>

        {/* Author Bio (Optional/Future) */}
        <div className="mt-20 p-12 bg-stone-50 rounded-[3rem] border border-stone-100 flex flex-col md:row items-center gap-10">
          <div className="w-24 h-24 rounded-[2rem] bg-stone-200 overflow-hidden flex-shrink-0">
            <img src={(blog as any).author?.avatar_url || 'https://i.pravatar.cc/150'} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-xl font-serif text-brand-primary mb-3">About The Author</h4>
            <p className="text-stone-500 font-light text-base leading-relaxed">
              {(blog as any).author?.bio || 'Makao Realtors Editorial Team provides curated market insights and architectural inspiration for Kenya\'s premium real estate landscape.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
