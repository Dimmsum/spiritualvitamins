import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmails, setUserEmails] = useState({});
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking auth status:', error.message);
        return;
      }
      
      setUser(data.session?.user || null);
    };
    
    getUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        
        // Fetch comments without the join
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id, 
            content, 
            created_at, 
            user_id
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Set comments
        setComments(data || []);
        
        // Get unique user IDs from comments
        const userIds = [...new Set(data.map(comment => comment.user_id))];
        
        // Fetch user emails separately if there are user IDs
        if (userIds.length > 0) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email')
            .in('id', userIds);
            
          if (!userError && userData) {
            // Create a map of user IDs to emails
            const emailMap = {};
            userData.forEach(user => {
              emailMap[user.id] = user.email;
            });
            setUserEmails(emailMap);
          } else {
            console.error('Error fetching user emails:', userError?.message);
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // Redirect to login
      navigate('/login');
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      
      // Insert comment
      const { data, error } = await supabase
        .from('comments')
        .insert([
          { 
            content: newComment.trim(),
            post_id: postId,
            user_id: user.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Add the new comment to the list
      if (data && data.length > 0) {
        // Add the current user's email to the userEmails map if not already there
        if (!userEmails[user.id] && user.email) {
          setUserEmails(prev => ({
            ...prev,
            [user.id]: user.email
          }));
        }
        
        setComments([data[0], ...comments]);
      }
      
      // Clear the input
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.message);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get user display name (email)
  const getUserDisplayName = (comment) => {
    return userEmails[comment.user_id] || 'Anonymous';
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-semibold mb-6">Comments</h2>
      
      {/* Comment form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex flex-col">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <p className="text-gray-600 text-center">
            <a 
              href="/login" 
              className="text-red-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Login
            </a> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Comments list */}
      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{getUserDisplayName(comment)}</span>
                <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;