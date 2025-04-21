import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const [latestVitamins, setLatestVitamins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  let startX, startScrollLeft;

  useEffect(() => {
    fetchLatestVitamins();
  }, []);

  async function fetchLatestVitamins() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10); // Fetch more to allow for scrolling
      
      if (error) throw error;
      setLatestVitamins(data || []);
    } catch (error) {
      console.error('Error fetching latest vitamins:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // Slider navigation functions
  const next = () => {
    if (currentIndex < latestVitamins.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: (currentIndex + 1) * sliderRef.current.offsetWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: (currentIndex - 1) * sliderRef.current.offsetWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  // Touch events for mobile swipe
  const onTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startScrollLeft = sliderRef.current.scrollLeft;
  };

  const onTouchMove = (e) => {
    if (!startX) return;
    const x = e.touches[0].clientX;
    const walk = startX - x;
    sliderRef.current.scrollLeft = startScrollLeft + walk;
  };

  const onTouchEnd = () => {
    startX = null;
    // Snap to closest item
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.offsetWidth;
      const newIndex = Math.round(sliderRef.current.scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
      sliderRef.current.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  // Format date 
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-red-100 py-16 px-4 mb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#FF2C2C] mb-4">Daily Spiritual Vitamins</h1>
            <p className="text-xl text-gray-700 mb-8">Nourishment for your soul, one vitamin at a time.</p>
            <SearchBar />
          </div>
        </section>

        {/* Latest Vitamins Carousel Section */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Latest Vitamins</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={prev} 
                  className="p-2 rounded-full bg-white shadow-md text-[#FF2C2C] hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={next} 
                  className="p-2 rounded-full bg-white shadow-md text-[#FF2C2C] hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentIndex >= latestVitamins.length - 1}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <p className="text-gray-500">Loading latest vitamins...</p>
              </div>
            ) : (
              <div 
                ref={sliderRef}
                className="relative w-full overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="flex snap-x snap-mandatory">
                  {latestVitamins.map((vitamin) => (
                    <div 
                      key={vitamin.id}
                      className="flex-none w-full snap-center px-2"
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {vitamin.image_url ? (
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={vitamin.image_url} 
                              alt={vitamin.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-red-100 to-red-200 h-48 flex items-center justify-center">
                            <span className="text-2xl text-[#FF2C2C] font-bold">Spiritual Vitamin</span>
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="text-sm text-gray-500 mb-2">{formatDate(vitamin.created_at)}</div>
                          <h3 className="font-bold text-xl mb-3 text-gray-800">{vitamin.title}</h3>
                          <p className="text-gray-600 line-clamp-3">{vitamin.content}</p>
                          
                          <button className="mt-4 text-[#FF2C2C] font-medium hover:underline">
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {latestVitamins.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === currentIndex ? 'bg-[#FF2C2C]' : 'bg-gray-300'
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    sliderRef.current.scrollTo({
                      left: index * sliderRef.current.offsetWidth,
                      behavior: 'smooth'
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Categories Section */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vitamin Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-[#FF2C2C]">Motivation</h3>
                <p className="text-gray-700 mt-2">Fuel your spirit</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-blue-600">Peace</h3>
                <p className="text-gray-700 mt-2">Find inner calm</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-green-600">Growth</h3>
                <p className="text-gray-700 mt-2">Expand your mind</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-purple-600">Wisdom</h3>
                <p className="text-gray-700 mt-2">Gain perspective</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 mb-16 bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Spiritual Vitamins</h2>
            <p className="text-gray-600 mb-6">
              Spiritual Vitamins provides daily doses of inspiration, wisdom, and guidance to nurture your spiritual growth.
              Created by Flawless Lee, each vitamin is carefully crafted to uplift, encourage, and challenge you on your journey.
            </p>
            <button className="inline-block px-6 py-3 bg-[#FF2C2C] text-white rounded-md hover:bg-red-600 transition-colors">
              Learn More
            </button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Our Readers Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FF2C2C]">
                <p className="italic text-gray-600 mb-4">"These spiritual vitamins have been a daily source of strength for me. I start each day with one and feel centered."</p>
                <p className="font-medium text-gray-800">- Sarah J.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FF2C2C]">
                <p className="italic text-gray-600 mb-4">"The wisdom in these vitamins has helped me navigate some of life's most challenging moments with grace."</p>
                <p className="font-medium text-gray-800">- Michael T.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="px-4 mb-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Get Daily Vitamins in Your Inbox</h2>
            <p className="mb-6">Subscribe to receive spiritual nourishment delivered directly to you.</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-md text-gray-800 outline-none"
              />
              <button className="px-6 py-2 bg-white text-[#FF2C2C] font-medium rounded-md hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;