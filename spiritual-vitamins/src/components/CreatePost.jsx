// src/components/CreatePost.jsx
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Upload, X } from 'lucide-react';

function CreatePost({ initialData = null, onPostSaved }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const isEditing = !!initialData;

  // Set initial data if provided (for editing mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      
      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      }
    }
  }, [initialData]);

  // Handle image selection
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    handleFile(file);
  }

  // Handle drag events
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  // Handle drop event
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  // Process the file
  function handleFile(file) {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    setImage(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  // Clear image selection
  function clearImage() {
    setImage(null);
    setImagePreview(null);
  }

  // Open file dialog
  function openFileDialog() {
    fileInputRef.current.click();
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
      
      let imageUrl = initialData?.image_url || null;
      
      // If a new image was selected, upload it
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
      
      if (isEditing) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({ 
            title, 
            content, 
            image_url: imageUrl,
          })
          .eq('id', initialData.id);
        
        if (error) throw error;
        
        alert('Vitamin updated successfully!');
      } else {
        // Insert new post
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
        
        alert('Vitamin created successfully!');
      }
      
      // Reset form fields
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      
      // Call the callback if provided
      if (onPostSaved) {
        onPostSaved();
      }
      
    } catch (error) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} vitamin: ` + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full px-4 py-6 bg-white">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          {/* Drag and drop area or image preview */}
          {!imagePreview ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-300 hover:bg-red-50/30'
              }`}
              onClick={openFileDialog}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop an image here, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-md"
              />
              <button 
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
              >
                <X size={20} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Spiritual Vitamin' : 'Create Spiritual Vitamin')
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;