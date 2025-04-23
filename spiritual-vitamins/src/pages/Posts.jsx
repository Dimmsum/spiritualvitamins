import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { generateSlug } from '../utils/helpers';

const Posts = () => {
  const navigate = useNavigate();
  const [vitamins, setVitamins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9; // 3x3 grid

  // Use useCallback to memoize the fetch functions
  const fetchVitamins = useCallback(async (pageNum = 0) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at')
        .order('created_at', { ascending: false })
        .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1);
      
      if (error) throw error;
      
      // If we received fewer items than the page size, there are no more items
      if (data.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setVitamins(data || []);
    } catch (error) {
      console.error('Error fetching vitamins:', error.message);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const fetchMoreVitamins = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at')
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      
      if (error) throw error;
      
      // If we received fewer items than the page size, there are no more items
      if (data.length < pageSize) {
        setHasMore(false);
      }
      
      // Append to existing vitamins
      setVitamins(prevVitamins => [...prevVitamins, ...data]);
    } catch (error) {
      console.error('Error fetching more vitamins:', error.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(0);
    fetchVitamins(0);
  }, [searchTerm, fetchVitamins]);

  // Load more when page changes, but not when search changes
  useEffect(() => {
    if (page > 0) {
      fetchMoreVitamins();
    }
  }, [page, fetchMoreVitamins]);

  // Filter vitamins based on search term (title only)
  const filteredVitamins = useMemo(() => {
    return vitamins.filter(vitamin => {
      return vitamin.title?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [vitamins, searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Load more vitamins
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Navigate to post details
  const navigateToVitamin = (vitamin) => {
    const slug = generateSlug(vitamin.title);
    navigate(`/vitamins/${vitamin.id}/${slug}`);
  };

  return (
    <>
      <Header />
      <div className="mt-24 px-4 pb-10 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#FF2C2C]">All Your Vitamins</h1>
        
        {/* Search bar section */}
        <div className="mb-8">
          <SearchBar 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {/* Loading state - only show on initial load */}
        {loading && page === 0 && (
          <div className="flex justify-center my-12">
            <p className="text-gray-500">Loading spiritual vitamins...</p>
          </div>
        )}
        
        {/* No results message */}
        {!loading && filteredVitamins.length === 0 && (
          <div className="text-center my-12">
            <p className="text-gray-500">No spiritual vitamins found.</p>
          </div>
        )}
        
        {/* Vitamins grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVitamins.map(vitamin => (
            <div 
              key={vitamin.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigateToVitamin(vitamin)}
            >
              {vitamin.image_url ? (
                <div className="w-full h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={vitamin.image_url} 
                    alt={vitamin.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{vitamin.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{vitamin.content}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formatDate(vitamin.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load more button */}
        {hasMore && !loading && filteredVitamins.length > 0 && (
          <div className="mt-10 text-center">
            <button 
              onClick={loadMore}
              className="px-6 py-2 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors"
            >
              Load More Vitamins
            </button>
          </div>
        )}
        
        {/* Loading indicator for pagination */}
        {loading && page > 0 && (
          <div className="mt-10 text-center">
            <p className="text-gray-500">Loading more vitamins...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;