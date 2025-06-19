import React, { useContext } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ShopContext } from "./context/ShopContext";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import Profile from "./Pages/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from 'react-toastify';
import Verify from "./Pages/Verify";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/animations/PageTransition";
import ScrollToTop from "./components/animations/ScrollToTop";
import "./utils/imageFallbacks"; // Ensure fallback images are available globally

const App = () => {
  const location = useLocation();
  const { authChecked } = useContext(ShopContext);

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex justify-center items-center min-h-screen'>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<PageTransition><Home /></PageTransition>} />
          <Route path='/collection' element={<PageTransition><Collection/></PageTransition>} />
          <Route path='/about' element={<PageTransition><About /></PageTransition>} />
          <Route path='/contact' element={<PageTransition><Contact /></PageTransition>} />
          <Route path='/product/:productId' element={<PageTransition><Product /></PageTransition>} />
          <Route path='/product' element={<PageTransition><Navigate to="/collection" replace /></PageTransition>} />
          <Route path='/cart' element={<PageTransition><Cart /></PageTransition>} />
          <Route path='/login' element={<PageTransition><Login /></PageTransition>} />
          
          {/* Protected routes */}
          <Route path='/profile' element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path='/place-order' element={
            <ProtectedRoute>
              <PageTransition><PlaceOrder /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path='/orders' element={
            <ProtectedRoute>
              <PageTransition><Orders /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path='/verify' element={
            <ProtectedRoute>
              <PageTransition><Verify/></PageTransition>
            </ProtectedRoute>
          } />
          
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;
