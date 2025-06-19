import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import FadeIn from "../components/animations/FadeIn";
import ScaleIn from "../components/animations/ScaleIn";
import AnimatedBackground from "../components/3d/AnimatedBackground";

const Contact = () => {
  return (
    <main className='relative'>
      {/* Subtle 3D background for visual interest */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <AnimatedBackground className="h-full" intensity={0.3} />
      </div>
      
      <div className='relative z-10'>
        <FadeIn>
          <div className='text-2xl text-center pt-10 border-t'>
            <Title text1={"CONTACT"} text2={"US"} />
          </div>
        </FadeIn>
        
        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
          <ScaleIn delay={0.1}>
            <motion.img
              className='w-full md:max-w-[480px]'
              src={assets.contact_img}
              alt='contact image'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </ScaleIn>

          <FadeIn direction="left" delay={0.2} className="flex flex-col justify-between items-start gap-6">
            <motion.p 
              className='font-semibold text-xl text-gray-600'
              whileHover={{ x: 5 }}
            >
              Our Store
            </motion.p>
            <p className='text-gray-500'>
              11/18 MG. Marg<br /> Civil lines Prayaraj 
            </p>
            <p className='text-gray-600'>
              Tel:(0532) 98XXXX  <br /> Email: shopease@gmail.com
            </p>
            <motion.p 
              className='font-semibold text-xl text-gray-600'
              whileHover={{ x: 5 }}
            >
              Careers at ShopEase
            </motion.p>
            <p className='text-gray-500'>
              Learn more about our teams and job openings.
            </p>
            <motion.button 
              className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore jobs
            </motion.button>
          </FadeIn>
        </div>
        
        <ScaleIn delay={0.3}>
          <NewsletterBox />
        </ScaleIn>
      </div>
    </main>
  );
};

export default Contact;
