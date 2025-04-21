// src/pages/ManageVitamins.jsx
import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostsList from "../components/PostsList";
import Header from "../components/Header";

const ManageVitamins = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto  pb-10">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-center mb-6">Spiritual Vitamin Management</h1>
          
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-5 py-2 bg-red-500/70 hover:bg-red-600/90 text-white font-medium rounded-md transition-colors"
            >
              {showCreateForm ? 'Hide Create Form' : 'Create New Vitamin'}
            </button>
          </div>
          
          {showCreateForm && (
            <div className="mb-8 bg-gray-50 rounded-lg shadow p-4">
              <CreatePost />
            </div>
          )}
          
          <div className="mt-8">
            <PostsList />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageVitamins;