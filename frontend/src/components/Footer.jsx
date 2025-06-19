import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FadeIn from "./animations/FadeIn";

const Footer = () => {
  const footerLinks = [
    { title: "About", path: "/about" },
    { title: "Our Store", path: "/contact" },
    { title: "Blog", path: "/collection" },
    { title: "FAQ's", path: "/collection" },
    { title: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: assets.facebook, url: "https://facebook.com", name: "Facebook" },
    { icon: assets.instagram, url: "https://instagram.com", name: "Instagram" },
    { icon: assets.twitter, url: "https://twitter.com", name: "Twitter" },
    { icon: assets.linkedin, url: "https://linkedin.com", name: "LinkedIn" }
  ];

  const newsletterFormVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }
  };

  const socialIconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.95 }
  };

  const linkVariants = {
    hover: { x: 5, color: "#000", transition: { type: "spring", stiffness: 300 } }
  };
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-14 pt-10 border-t">
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/">
              <motion.img
                className="w-36"
                src={assets.logo}
                alt="logo"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
            <p className="text-gray-600 my-4 text-sm">
              ShopEase offers high-quality clothing for everyone. Shop the latest trends in fashion.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  aria-label={social.name}
                >
                  <img className="w-5" src={social.icon} alt={social.name} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link to={link.path} className="text-gray-600 hover:text-black">
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Customer Service</h3>
            <ul className="space-y-2">
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/collection" className="text-gray-600 hover:text-black">
                  Help Center
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/collection" className="text-gray-600 hover:text-black">
                  Returns & Refunds
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/collection" className="text-gray-600 hover:text-black">
                  Shipping & Delivery
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/collection" className="text-gray-600 hover:text-black">
                  Privacy Policy
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/collection" className="text-gray-600 hover:text-black">
                  Terms of Service
                </Link>
              </motion.li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Newsletter</h3>
            <p className="text-gray-600 mb-3 text-sm">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <motion.form 
              className="flex gap-2"
              variants={newsletterFormVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border p-2 text-sm outline-gray-300"
              />
              <motion.button
                className="bg-black text-white px-4 py-2 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </div>
      </FadeIn>

      <motion.div 
        className="py-4 text-center border-t text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>© {currentYear} ShopEase Clothing. All rights reserved.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;
