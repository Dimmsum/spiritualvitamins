// src/components/CreatePost.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const user = supabase.auth.user();
      
      const { error } = await supabase
        .from('posts')
        .insert([
          { 
            title, 
            content, 
            image_url: imageUrl,
            image_caption: imageCaption,
            author_id: user.id
          }
        ]);
      
      if (error) throw error;
      
      // Reset form fields
      setTitle('');
      setContent('');
      setImageUrl('');
      setImageCaption('');
      
      alert('Post created successfully!');
    } catch (error) {
      alert('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Component JSX here
}