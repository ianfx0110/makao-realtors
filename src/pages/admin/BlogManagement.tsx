import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, LayoutDashboard, FileText, CheckCircle, Clock, AlertCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { blogService, Blog } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';

export const BlogManagement = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBlog, setEditingBlog] = React.useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<Partial<Blog>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: 'Market Trends',
    status: 'published',
    read_time: 5,
    tags: []
  });

  React.useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogService.getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalData = { 
        ...formData, 
        author_id: user?.id,
        slug: formData.slug || generateSlug(formData.title || '')
      } as Blog;

      if (editingBlog?.id) {
        await blogService.updateBlog(editingBlog.id, finalData);
      } else {
        await blogService.createBlog(finalData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Check slug uniqueness or permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      category: 'Market Trends',
      status: 'published',
      read_time: 5,
      tags: []
    });
    setEditingBlog(null);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif text-brand-primary">Blog Management</h1>
            <p className="text-stone-400 text-sm mt-1">Create and curate editorial content for Makao Realtors</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-all flex items-center gap-2 active:scale-95 shadow-xl"
          >
            <Plus size={16} /> New Article
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-50">
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Article</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Date</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                          <img src={blog.featured_image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-primary text-sm line-clamp-1">{blog.title}</p>
                          <p className="text-[10px] text-stone-400 font-light lowercase">/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-600">{blog.category}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-400">{new Date(blog.created_at || '').toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(blog)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors hover:bg-white rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(blog.id!)} className="p-2 text-stone-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[3rem] w-full max-w-4xl p-12 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-serif text-brand-primary">{editingBlog ? 'Edit' : 'Create'} Article</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-stone-100 text-stone-400 rounded-2xl hover:text-brand-primary transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Article Title</label>
                      <input 
                        type="text" required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light"
                        placeholder="The Future of Housing..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Slug (Optional)</label>
                      <input 
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light"
                        placeholder="future-of-housing"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Featured Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input 
                        type="url" required
                        value={formData.featured_image}
                        onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Excerpt (Brief Summary)</label>
                    <textarea 
                      required rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light"
                      placeholder="A short summary for the preview card..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Full Content (Markdown/HTML supported)</label>
                    <textarea 
                      required rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-100 rounded-[2rem] px-8 py-6 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light leading-relaxed"
                      placeholder="Write your article here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light appearance-none"
                      >
                        <option>Market Trends</option>
                        <option>Investment</option>
                        <option>Interior Design</option>
                        <option>Lifestyle</option>
                        <option>Legal Advise</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Read Time (min)</label>
                      <input 
                        type="number"
                        value={formData.read_time}
                        onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-light appearance-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-brand-primary text-white py-6 rounded-full font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-accent transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : editingBlog ? 'Update Article' : 'Publish Article'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
