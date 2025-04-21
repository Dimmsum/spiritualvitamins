// src/components/PostsList.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this vitamin?');
      if (!confirmed) return;
      
      setLoading(true);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the deleted post from state
      setPosts(posts.filter(post => post.id !== id));
      alert('Vitamin deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('Error deleting vitamin: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full px-4 py-6">
      
      {loading && <p className="text-center py-4">Loading vitamins...</p>}
      
      {!loading && posts.length === 0 && (
        <p className="text-center py-4">No vitamins found. Create one above!</p>
      )}
      
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{post.title}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:text-red-700 text-sm py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.content}</p>
            
            {post.image_url && (
              <div className="mt-3">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsList;