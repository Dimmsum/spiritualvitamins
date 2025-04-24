import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, Save, X, AlertTriangle, Loader } from 'lucide-react';

const CreatePost = ({ initialData = null, onPostSaved }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 1500; // Content character limit

  // Reset form or fill with initialData if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setImageUrl(initialData.image_url || '');
      setPreviewUrl(initialData.image_url || '');
      setCharacterCount(initialData.content?.length || 0);
    } else {
      resetForm();
    }
  }, [initialData]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!fileTypes.includes(file.type)) {
      setErrorMessage('Please select an image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file is too large. Maximum size is 5MB.');
      return;
    }

    setErrorMessage('');
    setImageFile(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Validate form
      if (!title.trim()) {
        throw new Error('Please enter a title for your spiritual vitamin');
      }
      
      if (!content.trim()) {
        throw new Error('Please enter content for your spiritual vitamin');
      }

      // Handle image upload if there's a new image
      let uploadedImageUrl = imageUrl;
      if (imageFile) {
        const fileName = `vitamin-${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('vitamin-images')
          .upload(fileName, imageFile);

        if (uploadError) throw new Error(`Error uploading image: ${uploadError.message}`);

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('vitamin-images')
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrl;
      }

      // Determine if creating new or updating existing
      if (initialData) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            title: title.trim(),
            content: content.trim(),
            image_url: uploadedImageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id);

        if (updateError) throw new Error(`Error updating vitamin: ${updateError.message}`);
      } else {
        // Create new post
        const { error: insertError } = await supabase
          .from('posts')
          .insert([{
            title: title.trim(),
            content: content.trim(),
            image_url: uploadedImageUrl,
          }]);

        if (insertError) throw new Error(`Error creating vitamin: ${insertError.message}`);
      }

      // Reset form and notify parent component
      resetForm();
      if (onPostSaved) {
        onPostSaved();
      }
    } catch (error) {
      console.error('Error saving post:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setImageFile(null);
    setPreviewUrl('');
    setErrorMessage('');
    setCharacterCount(0);
  };

  // Handle content input and update character count
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= maxCharacters) {
      setContent(newContent);
      setCharacterCount(newContent.length);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setImageUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Title input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter an inspiring title..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 shadow-sm"
          maxLength={100}
        />
      </div>

      {/* Content textarea */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <span className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
            {characterCount}/{maxCharacters} characters
          </span>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="Share your spiritual wisdom..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 shadow-sm min-h-32"
          rows={6}
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (Optional)
        </label>
        
        {previewUrl ? (
          <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 mx-auto object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                  <span>Upload an image</span>
                  <input 
                    id="image-upload" 
                    name="image-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WEBP up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {initialData ? 'Update Vitamin' : 'Create Vitamin'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;