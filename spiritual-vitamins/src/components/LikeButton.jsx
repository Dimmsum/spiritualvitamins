import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid'; // You may need to install this

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Generate or retrieve an anonymous user ID from localStorage
  const getAnonymousId = () => {
    let anonId = localStorage.getItem('anonymous_user_id');
    if (!anonId) {
      anonId = uuidv4();
      localStorage.setItem('anonymous_user_id', anonId);
    }
    return anonId;
  };

  // Check if the user has liked the post and get total likes count
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        setLoading(true);
        
        // Get or create anonymous ID
        const anonymousId = getAnonymousId();
        
        // Check if this anonymous user has liked the post
        const { data: likeData, error: likeError } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('anonymous_id', anonymousId)
          .maybeSingle();
        
        if (likeError) {
          throw likeError;
        }
        
        setLiked(!!likeData);
        
        // Get total likes count
        const { count, error: countError } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', postId);
        
        if (countError) throw countError;
        
        setLikesCount(count || 0);
      } catch (error) {
        console.error('Error checking like status:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      checkLikeStatus();
    }
  }, [postId]);

  // Toggle like status
  const toggleLike = async () => {
    try {
      setLoading(true);
      
      // Get anonymous ID
      const anonymousId = getAnonymousId();
      
      if (liked) {
        // Unlike the post
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('anonymous_id', anonymousId);
        
        if (error) throw error;
        
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like the post
        const { error } = await supabase
          .from('likes')
          .insert([
            { 
              post_id: postId,
              anonymous_id: anonymousId,
              user_id: null // We're not using user_id for anonymous likes
            }
          ]);
        
        if (error) throw error;
        
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error.message);
      alert('Failed to update like status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
        liked 
          ? 'text-red-600 hover:text-red-700' 
          : 'text-gray-600 hover:text-red-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <Heart 
        size={20} 
        fill={liked ? 'currentColor' : 'none'} 
        className={loading ? 'animate-pulse' : ''}
      />
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;