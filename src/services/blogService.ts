import { supabase } from '../lib/supabase';

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id?: string;
  category: string;
  status: 'draft' | 'published';
  read_time: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export const blogService = {
  async getBlogs() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*, author:user_profiles(name, avatar_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBlogBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*, author:user_profiles(name, avatar_url)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async createBlog(blog: Blog) {
    const { data, error } = await supabase
      .from('blogs')
      .insert(blog)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBlog(id: string, blog: Partial<Blog>) {
    const { data, error } = await supabase
      .from('blogs')
      .update(blog)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBlog(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
