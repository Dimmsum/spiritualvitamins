import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { ArrowLeft } from 'lucide-react';
import { getPostIdFromParams } from '../utils/helpers';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';

const PostDetails = () => {
  const params = useParams();
  const id = getPostIdFromParams(params);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, content, image_url, created_at, author_id')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle go back
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div className="mt-10 px-4 pb-10 max-w-4xl mx-auto">
        {/* Back button */}
        <button 
          onClick={goBack}
          className="mb-6 flex items-center text-gray-600 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to vitamins</span>
        </button>

        {loading && (
          <div className="flex justify-center my-12">
            <p className="text-gray-500">Loading spiritual vitamin...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-6">
            <p>Error: {error}</p>
            <p className="mt-2">The vitamin you're looking for might have been deleted or doesn't exist.</p>
          </div>
        )}

        {!loading && post && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Image section */}
            {post.image_url ? (
              <div className="w-full h-80 sm:h-96 overflow-hidden bg-gray-100">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-60 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            
            {/* Content section */}
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
              
              <div className="flex justify-between items-center mb-6">
                <time className="text-gray-500" dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                <LikeButton postId={post.id} />
              </div>
              
              {/* Render content with proper paragraph breaks */}
              <div className="prose max-w-none text-gray-700">
                {post.content.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
                ))}
              </div>
              
              {/* Comments section */}
              <CommentSection postId={post.id} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDetails;