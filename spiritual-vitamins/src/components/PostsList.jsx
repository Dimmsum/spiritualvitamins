import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Trash2, Edit2, Calendar, ChevronRight, Image, Loader } from 'lucide-react';
import { generateSlug } from '../utils/helpers';

function PostsList({ onEditPost, onPostDeleted }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9;

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
      
      if (data.length < pageSize) {
        setHasMore(false);
      }
      
      if (page === 0) {
        setPosts(data || []);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleDelete(id) {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this vitamin?');
      if (!confirmed) return;
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== id));
      
      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('Error deleting vitamin: ' + error.message);
    }
  }

  function handleEdit(post) {
    if (onEditPost) {
      onEditPost(post);
    }
  }

  function navigateToPost(post) {
    const slug = generateSlug(post.title);
    navigate(`/vitamins/${post.id}/${slug}`);
  }

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate content excerpt that's safer than just truncating
  const getExcerpt = (content, maxLength = 120) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    
    // Find the last space within the maxLength to avoid cutting words
    const lastSpace = content.substring(0, maxLength).lastIndexOf(' ');
    return lastSpace === -1 
      ? content.substring(0, maxLength) + '...' 
      : content.substring(0, lastSpace) + '...';
  };

  return (
    <div className="w-full">
      {loading && page === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="w-10 h-10 text-red-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading spiritual vitamins...</p>
        </div>
      )}
      
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Image className="w-12 h-12 text-red-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No vitamins found</h3>
          <p className="text-gray-500 max-w-md">
            Create your first spiritual vitamin to share wisdom with the community
          </p>
        </div>
      )}
      
      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
          >
            {/* Image Section */}
            <div 
              className="w-full h-56 relative overflow-hidden bg-gray-50 cursor-pointer"
              onClick={() => navigateToPost(post)}
            >
              {post.image_url ? (
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-red-50">
                  <Image className="w-12 h-12 text-red-200" />
                </div>
              )}
              
              {/* Date badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center">
                <Calendar size={12} className="mr-1 text-red-500" />
                {formatDate(post.created_at)}
              </div>
              
              {/* Action buttons - Always visible for better UX */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-blue-50 transition-colors"
                  aria-label="Edit vitamin"
                >
                  <Edit2 size={16} className="text-blue-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  aria-label="Delete vitamin"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
            
            {/* Content Section */}
            <div 
              className="p-5 cursor-pointer"
              onClick={() => navigateToPost(post)}
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-red-600 transition-colors">{post.title}</h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{getExcerpt(post.content)}</p>
              
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                  Read more <ChevronRight size={16} className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && !loading && posts.length > 0 && (
        <div className="mt-12 text-center">
          <button 
            onClick={loadMore}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-full shadow-md transition-all duration-300 flex items-center mx-auto"
          >
            {loading && page > 0 ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>Load More Vitamins</>
            )}
          </button>
        </div>
      )}
      
      {/* Loading indicator for pagination */}
      {loading && page > 0 && (
        <div className="mt-10 text-center">
          <p className="text-gray-500 flex items-center justify-center">
            <Loader size={16} className="animate-spin mr-2" />
            Loading more vitamins...
          </p>
        </div>
      )}
    </div>
  );
}

export default PostsList;