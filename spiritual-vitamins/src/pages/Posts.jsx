import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { generateSlug } from '../utils/helpers';
import { Calendar, Loader, Search, ChevronRight, Image } from 'lucide-react';

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

  // Calculate content excerpt that's safer than just truncating
  const getExcerpt = (content, maxLength = 120) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    
    // Find the last space within the maxLength to avoid cutting words
    const lastSpace = content.substring(0, maxLength).lastIndexOf(' ');
    return lastSpace === -1 
      ? content.substring(0, maxLength) + '...' 
      : content.substring(0, lastSpace) + '...';
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-red-600 to-red-500 pt-16 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Spiritual Vitamins</h1>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              Discover daily doses of spiritual wisdom to nourish your soul
            </p>
          </div>
          
          {/* Enhanced Search bar section */}
          <div className="max-w-xl mx-auto relative">
            <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden pl-5 pr-2 py-2">
              <Search className="text-red-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for spiritual vitamins..."
                className="w-full border-none outline-none pl-3 py-2 text-gray-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 mb-16">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
          {/* Loading state - only show on initial load */}
          {loading && page === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="w-10 h-10 text-red-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading spiritual vitamins...</p>
            </div>
          )}
          
          {/* No results message */}
          {!loading && filteredVitamins.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-red-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No vitamins found</h3>
              <p className="text-gray-500 max-w-md">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try a different search term.` 
                  : "There are no spiritual vitamins available at the moment."}
              </p>
            </div>
          )}
          
          {/* Vitamins grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVitamins.map(vitamin => (
              <div 
                key={vitamin.id} 
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                onClick={() => navigateToVitamin(vitamin)}
              >
                {/* Image Section */}
                <div className="w-full h-56 overflow-hidden bg-gray-50 relative cursor-pointer">
                  {vitamin.image_url ? (
                    <img 
                      src={vitamin.image_url} 
                      alt={vitamin.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <Image className="w-12 h-12 text-red-200" />
                    </div>
                  )}
                  
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center">
                    <Calendar size={12} className="mr-1 text-red-500" />
                    {formatDate(vitamin.created_at)}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 cursor-pointer">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-red-600 transition-colors">{vitamin.title}</h2>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{getExcerpt(vitamin.content)}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                      Read more <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load more button */}
          {hasMore && !loading && filteredVitamins.length > 0 && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMore}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-full shadow-md transition-all duration-300 flex items-center mx-auto"
              >
                {loading && page > 0 ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>Load More Vitamins</>
                )}
              </button>
            </div>
          )}
          
          {/* Loading indicator for pagination */}
          {loading && page > 0 && (
            <div className="mt-10 text-center">
              <p className="text-gray-500 flex items-center justify-center">
                <Loader size={16} className="animate-spin mr-2" />
                Loading more vitamins...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Posts;