// src/pages/ManagePosts.jsx
import { useState, useEffect, useCallback } from "react";
import CreatePost from "../components/CreatePost";
import PostsList from "../components/PostsList";
import Header from "../components/Header";

const ManageVitamins = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this state to trigger refreshes

  // Add scroll listener to improve performance by only showing certain elements when needed
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle editing a post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowCreateForm(true);
    // Scroll to the top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle successful post creation or update
  const handlePostSaved = useCallback(() => {
    // Reset editing state and hide form
    setEditingPost(null);
    setShowCreateForm(false);
    
    // Trigger a refresh of the posts list
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Form title based on whether we're editing or creating
  const formTitle = editingPost ? 'Edit Spiritual Vitamin' : 'Create New Spiritual Vitamin';
  
  // Button text based on form state
  const buttonText = showCreateForm 
    ? 'Hide Form' 
    : editingPost 
      ? 'Edit Vitamin' 
      : 'Create New Vitamin';

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pb-10 pt-5">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-center mb-6">Spiritual Vitamin Management</h1>
          
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (showCreateForm) {
                  setEditingPost(null); // Clear editing state when hiding form
                }
              }}
              className="px-5 py-2 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors"
            >
              {buttonText}
            </button>
          </div>
          
          {showCreateForm && (
            <div className="mb-8 bg-gray-50 rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">{formTitle}</h2>
              <CreatePost 
                initialData={editingPost} 
                onPostSaved={handlePostSaved} 
              />
            </div>
          )}
          
          <div className="mt-8">
            {/* Pass refreshTrigger as key to force re-render when posts are modified */}
            <PostsList 
              key={refreshTrigger} 
              onEditPost={handleEditPost} 
              onPostDeleted={handlePostSaved} 
            />
          </div>
        </div>
        
        {/* Back to top button - only shows when scrolled down */}
        {isScrolled && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-4 right-4 bg-red-500/70 text-white p-3 rounded-full shadow-lg hover:bg-red-600/90 transition-colors"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default ManageVitamins;