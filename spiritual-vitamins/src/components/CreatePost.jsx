// src/components/CreatePost.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }
      
      let imageUrl = null;
      
      // If an image was selected, upload it first
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `post-images/${fileName}`;
        
        // Upload the image to Supabase Storage
        const { error: uploadError } = await supabase
          .storage
          .from('images')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase
          .storage
          .from('images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Insert the post with the image URL
      const { error } = await supabase
        .from('posts')
        .insert([
          { 
            title, 
            content, 
            image_url: imageUrl,
            author_id: user.id
          }
        ]);
      
      if (error) throw error;
      
      // Reset form fields
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      
      alert('Post created successfully!');
    } catch (error) {
      alert('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full px-4 py-6 bg-white">
      <h1 className="text-xl font-bold text-center mb-6">Create New Spiritual Vitamin</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
            placeholder="Enter title"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
            placeholder="Write your spiritual vitamin message here..."
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-500/70 hover:file:bg-red-100"
          />
          
          {/* Image preview */}
          {imagePreview && (
            <div className="mt-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-40 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Spiritual Vitamin'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;