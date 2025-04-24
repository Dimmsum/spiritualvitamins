import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Heart, 
  BookOpen, 
  Feather, 
  Brain,
  ArrowRight,
  Mail
} from "lucide-react";
import { generateSlug } from "../utils/helpers";

const Home = () => {
  const [latestVitamins, setLatestVitamins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
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
        .limit(10);
      
      if (error) throw error;
      setLatestVitamins(data || []);
    } catch (error) {
      console.error('Error fetching latest vitamins:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const navigateToPost = (post) => {
    const slug = generateSlug(post.title);
    navigate(`/vitamins/${post.id}/${slug}`);
  };

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-600 to-red-500 py-20 px-4 mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]" opacity="0.2"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl border border-white/20">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  "For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you a hope and a future"
                </h1>
                <p className="text-xl md:text-2xl text-white/80 font-light mb-8">Jeremiah 29:11</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <button 
                    onClick={() => navigate('/vitamins')}
                    className="px-8 py-3 bg-white text-red-600 rounded-full font-medium shadow-md hover:bg-red-50 transition-all duration-300 flex items-center"
                  >
                    Explore Vitamins
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                  <button className="px-8 py-3 bg-red-700/30 text-white border border-white/30 rounded-full font-medium hover:bg-red-700/50 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Vitamins Carousel Section */}
        <section className="px-4 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 relative">
                <span className="inline-block relative">
                  Latest Vitamins
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-500 rounded-full"></span>
                </span>
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={prev} 
                  className="p-3 rounded-full bg-white shadow-md text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={next} 
                  className="p-3 rounded-full bg-white shadow-md text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  disabled={currentIndex >= latestVitamins.length - 1}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Loading latest vitamins...</p>
                </div>
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
                      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                        {vitamin.image_url ? (
                          <div 
                            className="h-64 overflow-hidden cursor-pointer relative group"
                            onClick={() => navigateToPost(vitamin)}
                          >
                            <img 
                              src={vitamin.image_url} 
                              alt={vitamin.title} 
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ) : (
                          <div 
                            className="bg-gradient-to-br from-red-500 to-red-600 h-64 flex items-center justify-center cursor-pointer relative"
                            onClick={() => navigateToPost(vitamin)}
                          >
                            <span className="text-2xl text-white font-bold">Spiritual Vitamin</span>
                          </div>
                        )}
                        
                        <div className="p-6 md:p-8">
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar size={14} className="mr-2 text-red-500" />
                            {formatDate(vitamin.created_at)}
                          </div>
                          <h3 
                            className="font-bold text-xl md:text-2xl mb-4 text-gray-800 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => navigateToPost(vitamin)}
                          >
                            {vitamin.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-3 mb-6">{vitamin.content}</p>
                          
                          <button 
                            className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors group"
                            onClick={() => navigateToPost(vitamin)}
                          >
                            Read More
                            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {latestVitamins.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-red-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
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
        <section className="px-4 mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 relative inline-block">
              Vitamin Categories
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-500 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Motivation</h3>
                <p className="text-gray-600">Fuel your spirit with daily inspiration to pursue your purpose</p>
                <button className="mt-4 text-red-600 font-medium flex items-center hover:text-red-700 transition-colors">
                  Explore <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Peace</h3>
                <p className="text-gray-600">Find inner calm and tranquility amidst life's challenges</p>
                <button className="mt-4 text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors">
                  Explore <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                  <Feather size={24} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Growth</h3>
                <p className="text-gray-600">Expand your mind and nurture personal development</p>
                <button className="mt-4 text-green-600 font-medium flex items-center hover:text-green-700 transition-colors">
                  Explore <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  <Brain size={24} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Wisdom</h3>
                <p className="text-gray-600">Gain perspective and insights for navigating life</p>
                <button className="mt-4 text-purple-600 font-medium flex items-center hover:text-purple-700 transition-colors">
                  Explore <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 mb-20">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-red-500 to-red-600 p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">About Spiritual Vitamins</h2>
                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  Spiritual Vitamins provides daily doses of inspiration, wisdom, and guidance to nurture your spiritual growth.
                  Created by Flawless Lee, each vitamin is carefully crafted to uplift, encourage, and challenge you on your journey.
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-full font-medium shadow-md hover:bg-red-50 transition-all duration-300">
                  Learn More
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
              <div className="md:w-1/2 p-12">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    We believe that spiritual nourishment is as essential as physical nourishment. Our mission is to provide daily spiritual vitamins that strengthen your faith, inspire hope, and cultivate love.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="text-center p-4 rounded-lg bg-gray-50">
                      <div className="text-3xl font-bold text-red-500 mb-1">1000+</div>
                      <div className="text-gray-600 text-sm">Spiritual Vitamins</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gray-50">
                      <div className="text-3xl font-bold text-red-500 mb-1">5000+</div>
                      <div className="text-gray-600 text-sm">Inspired Readers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 mb-20 bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center relative inline-block">
              <span className="relative z-10">
                What Our Readers Say
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-500 rounded-full"></span>
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                </div>
                <p className="italic text-gray-600 mb-6 pt-6 text-lg">
                  "These spiritual vitamins have been a daily source of strength for me. I start each day with one and feel centered and prepared to face whatever challenges come my way."
                </p>
                <div className="flex items-center mt-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Sarah Johnson</p>
                    <p className="text-gray-500 text-sm">Faithful Reader</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                </div>
                <p className="italic text-gray-600 mb-6 pt-6 text-lg">
                  "The wisdom in these vitamins has helped me navigate some of life's most challenging moments with grace and understanding. They've been a true blessing in my spiritual journey."
                </p>
                <div className="flex items-center mt-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Michael Thompson</p>
                    <p className="text-gray-500 text-sm">Community Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="px-4 mb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-10 text-white text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]" opacity="0.2"></div>
            <div className="relative z-10">
              <Mail size={40} className="mx-auto mb-4 text-white/80" />
              <h2 className="text-3xl font-bold mb-4">Get Daily Vitamins in Your Inbox</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">Subscribe to receive spiritual nourishment delivered directly to you every morning. Start your day with wisdom and inspiration.</p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-5 py-3 rounded-full text-gray-800 outline-none shadow-md"
                />
                <button className="px-6 py-3 bg-white text-red-600 font-medium rounded-full hover:bg-red-50 shadow-md transition-all duration-300">
                  Subscribe Now
                </button>
              </div>
              <p className="text-white/70 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;