import React from "react";
import { assets } from "../assets/assets";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "../components/animations/FadeIn";
import { COLORS, withOpacity } from "../utils/animationUtils";

const About = () => {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      image: assets.about_img,
    },
    {
      name: "Jane Smith",
      role: "Design Director",
      image: assets.about_img,
    },
    {
      name: "Mike Johnson",
      role: "Development Lead",
      image: assets.about_img,
    },
  ];

  return (
    <main className="border-t pt-10">
      {/* Hero Section */}
      <div className="relative mb-16">
        <div className="h-64 md:h-96 overflow-hidden">
          <img 
            className="w-full object-cover h-full" 
            src={assets.about_img} 
            alt="About ShopEase" 
          />
        </div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative z-10 text-center px-5 py-10 md:px-10 md:py-16 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              backgroundColor: withOpacity(COLORS.gray[50], 0.9)
            }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h1>
            <p className="max-w-lg mx-auto text-gray-700">
              ShopEase was founded with a simple mission: to make online shopping
              effortless, enjoyable, and accessible to everyone. We believe in quality
              products, transparent business practices, and exceptional customer service.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Mission Section */}
      <FadeIn>
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Mission</h2>
          <p className="text-gray-700 mb-8 text-center">
            At ShopEase, we're dedicated to providing high-quality products at reasonable prices
            while creating a shopping experience that's both enjoyable and efficient. Our commitment
            to sustainability guides our sourcing, packaging, and business operations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg text-center"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">
                We source only the finest materials and partner with trusted manufacturers to ensure every product meets our standards.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg text-center"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Ethical Sourcing</h3>
              <p className="text-gray-600 text-sm">
                We're committed to ethical business practices that benefit our customers, partners, and the planet.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg text-center"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Fair Pricing</h3>
              <p className="text-gray-600 text-sm">
                We believe in transparent pricing that gives our customers excellent value for their money.
              </p>
            </motion.div>
          </div>
        </section>
      </FadeIn>

      {/* Team Section */}
      <FadeIn>
        <section className="py-12 px-4 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-12 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-8">
            <AnimatePresence>
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </FadeIn>
    </main>
  );
};

export default About;
