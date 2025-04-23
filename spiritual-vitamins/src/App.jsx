import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Posts from './pages/Posts'
import ManageVitamins from './pages/ManagePosts'
import PostDetails from './pages/PostDetails';
import AboutPage from './pages/About';



function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vitamins" element={<Posts />} />
          <Route path="/manage-vitamins" element={<ManageVitamins />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/vitamins/:id/:slug" element={<PostDetails />} />
          {/* Add more routes as needed */}
        </Routes>
    </Router>
  );
}

export default App;