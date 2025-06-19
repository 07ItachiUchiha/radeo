import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedMobileNav from "./AnimatedMobileNav";
import { COLORS, conditionalBackgroundColor } from "../utils/animationUtils";

const Navbar = () => {
    const { setShowSearch, getCartCount, token, logout } = useContext(ShopContext);
    const [scrolled, setScrolled] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    
    // We still want route changes to trigger re-renders without explicitly using location
    useLocation();

    const navItems = [
        { name: "HOME", path: "/" },
        { name: "COLLECTIONS", path: "/collection" },
        { name: "ABOUT", path: "/about" },
        { name: "CONTACT", path: "/contact" }
    ];

    // Track scroll position for navbar effects
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation variants
    const navbarVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const linkVariants = {
        normal: { scale: 1 },
        hover: { scale: 1.05 }
    };

    return (
        <header>
            <motion.nav 
                className={`flex items-center justify-between py-5 font-medium ${
                    scrolled ? "sticky top-0 bg-white shadow-md z-50 px-4" : ""
                }`}
                initial="hidden"
                animate="visible"
                variants={navbarVariants}
            >
                <Link to='/'>
                    <motion.img 
                        className='w-36' 
                        src={assets.logo} 
                        alt='logo'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    />
                </Link>
                <ul className='hidden sm:flex text-sm gap-5 text-gray-700'>
                    {navItems.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={linkVariants}
                            whileHover="hover"
                            initial="normal"
                        >
                            <NavLink 
                                to={item.path} 
                                className='flex flex-col items-center gap-1'
                            >
                                {({ isActive }) => (
                                    <>
                                        <p>{item.name}</p>
                                        <motion.hr 
                                            className={`h-0.5 w-3/4 border-none bg-gray-700 ${isActive ? '' : 'hidden'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? "75%" : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </>
                                )}
                            </NavLink>
                        </motion.div>
                    ))}
                </ul>

                <div className='flex items-center gap-6'>
                    <motion.img
                        onClick={() => setShowSearch(true)}
                        className='w-5 cursor-pointer'
                        src={assets.search}
                        alt='search'
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                    />
                    <motion.div
                        className='relative'
                        whileHover={{ scale: 1.1 }}
                    >
                        <Link to='/cart'>
                            <img className='w-5' src={assets.bag} alt='Cart' />
                        </Link>
                        <motion.span 
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                            initial={{ scale: 0.8 }}
                            animate={{ 
                                scale: getCartCount() > 0 ? 1 : 0.8, 
                                ...conditionalBackgroundColor(getCartCount() > 0, "#000000", "transparent") 
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {getCartCount()}
                        </motion.span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }}>
                        {token ? (
                            <div className="flex gap-3">
                                <Link to="/profile">
                                    <img className="w-5" src={assets.user} alt="Profile" />
                                </Link>
                                <motion.img
                                    onClick={logout}
                                    className="w-5 cursor-pointer"
                                    src={assets.logout}
                                    alt="logout"
                                    whileHover={{ rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            </div>
                        ) : (
                            <Link to="/login">
                                <img className="w-5" src={assets.user} alt="Login" />
                            </Link>
                        )}
                    </motion.div>
                    <motion.img
                        onClick={() => setOpenModal(true)}
                        className='w-5 cursor-pointer sm:hidden'
                        src={assets.hamburger}
                        alt='hamburger'
                        whileTap={{ scale: 0.9 }}
                    />
                </div>

                {/* Use the enhanced animated mobile navigation */}
                <AnimatedMobileNav 
                    isOpen={openModal}
                    setIsOpen={setOpenModal}
                    navItems={navItems.concat([
                        { name: "CART", path: "/cart" },
                        { name: token ? "PROFILE" : "LOGIN", path: token ? "/profile" : "/login" }
                    ])}
                />
            </motion.nav>
        </header>
    );
};

export default Navbar;
