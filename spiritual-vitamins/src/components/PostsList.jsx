// src/components/PostsList.jsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, Edit2 } from 'lucide-react';

function PostsList({ onEditPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9; // 3x3 grid like AllVitamins

  // Use useCallback to memoize the fetchPosts function
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at, author_id')
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      
      if (error) throw error;
      
      // If we received fewer items than the page size, there are no more items
      if (data.length < pageSize) {
        setHasMore(false);
      }
      
      if (page === 0) {
        setPosts(data || []);
      } else {
        // Append to existing posts for pagination
        setPosts(prevPosts => [...prevPosts, ...data]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]); // Add dependencies here

  // Fixed useEffect with proper dependency
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Include fetchPosts in the dependency array

  async function handleDelete(id) {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this vitamin?');
      if (!confirmed) return;
      
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
    }
  }

  function handleEdit(post) {
    // If onEditPost callback is provided, call it with the post data
    if (onEditPost) {
      onEditPost(post);
    } else {
      console.log('Edit functionality not implemented yet', post);
      alert('Edit functionality coming soon!');
    }
  }

  // Load more posts
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full px-4 py-6">
      {loading && page === 0 && (
        <div className="flex justify-center my-12">
          <p className="text-gray-500">Loading spiritual vitamins...</p>
        </div>
      )}
      
      {!loading && posts.length === 0 && (
        <div className="text-center my-12">
          <p className="text-gray-500">No vitamins found. Create one above!</p>
        </div>
      )}
      
      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image Section */}
            {post.image_url ? (
              <div className="w-full h-48 overflow-hidden bg-gray-100 relative group">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                  }}
                />
                {/* Action buttons overlay on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(post);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50"
                    aria-label="Edit vitamin"
                  >
                    <Edit2 size={16} className="text-blue-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                    aria-label="Delete vitamin"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative group">
                <span className="text-gray-400">No image</span>
                {/* Action buttons overlay on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(post);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50"
                    aria-label="Edit vitamin"
                  >
                    <Edit2 size={16} className="text-blue-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                    aria-label="Delete vitamin"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Content Section */}
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && !loading && posts.length > 0 && (
        <div className="mt-10 text-center">
          <button 
            onClick={loadMore}
            className="px-6 py-2 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors"
          >
            Load More Vitamins
          </button>
        </div>
      )}
      
      {/* Loading indicator for pagination */}
      {loading && page > 0 && (
        <div className="mt-10 text-center">
          <p className="text-gray-500">Loading more vitamins...</p>
        </div>
      )}
    </div>
  );
}

export default PostsList;