import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer"

const Home = () => {
  // Sample card data - replace with your actual data
  const cards = [
    { id: 1, title: "Vitamin Card 1", content: "Description for vitamin 1" },
    { id: 2, title: "Vitamin Card 2", content: "Description for vitamin 2" },
    { id: 3, title: "Vitamin Card 3", content: "Description for vitamin 3" },
    { id: 4, title: "Vitamin Card 4", content: "Description for vitamin 4" },
    { id: 5, title: "Vitamin Card 5", content: "Description for vitamin 5" },
    { id: 6, title: "Vitamin Card 6", content: "Description for vitamin 6" },
  ];

  return (
    <>
      <Header />
      <section className="p-10">
        <SearchBar />
        <h1 className="text-3xl font-bold mt-8 mb-6">Latest</h1>
        {/* Responsive card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card image placeholder - replace with your actual image */}
              <div className="bg-gray-200 h-40 w-full"></div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.content}</p>
              </div>
            </div>
          ))}
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default Home;