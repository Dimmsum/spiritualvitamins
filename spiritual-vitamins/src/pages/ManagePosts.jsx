// src/pages/ManagePosts.jsx
import { useState, useEffect, useCallback } from "react";
import { ChevronUp, Plus, X, FileEdit } from "lucide-react"; // Import Lucide icons
import CreatePost from "../components/CreatePost";
import PostsList from "../components/PostsList";
import Header from "../components/Header";

const ManageVitamins = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-red-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto pb-16 pt-8 px-4 sm:px-6">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold text-red-700 mb-2">Spiritual Vitamin Management</h1>
            <p className="text-gray-600 max-w-lg text-center mb-6">Create, edit and manage your spiritual vitamins to share with the community.</p>
            
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (showCreateForm) {
                  setEditingPost(null); // Clear editing state when hiding form
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-md transition-all duration-300 ${
                showCreateForm
                  ? "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
              }`}
            >
              {showCreateForm ? (
                <>
                  <X size={18} />
                  Close Form
                </>
              ) : editingPost ? (
                <>
                  <FileEdit size={18} />
                  Edit Vitamin
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create New Vitamin
                </>
              )}
            </button>
          </div>
          
          {showCreateForm && (
            <div className="mb-12 bg-white rounded-xl shadow-lg p-6 border border-red-100 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-red-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-red-600">{formTitle}</h2>
                <p className="text-gray-500 mt-1">Share your spiritual wisdom with the world</p>
              </div>
              <CreatePost 
                initialData={editingPost} 
                onPostSaved={handlePostSaved} 
              />
            </div>
          )}
          
          <div className={`${showCreateForm ? "mt-8" : ""} transition-all duration-300`}>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-red-500 rounded mr-3"></span>
                Your Spiritual Vitamins
              </h2>
              {/* Pass refreshTrigger as key to force re-render when posts are modified */}
              <PostsList 
                key={refreshTrigger} 
                onEditPost={handleEditPost} 
                onPostDeleted={handlePostSaved} 
              />
            </div>
          </div>
        </div>
        
        {/* Back to top button - only shows when scrolled down */}
        {isScrolled && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center z-50 animate-fadeIn"
            aria-label="Back to top"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>
    </>
  );
};

// Add this to your global CSS file or use styled-components/emotion
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out;
// }

export default ManageVitamins;