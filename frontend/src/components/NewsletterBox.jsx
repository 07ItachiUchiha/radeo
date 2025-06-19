import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { withOpacity } from "../utils/animationUtils";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const controls = useAnimation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@') && email.includes('.')) {
      // Success animation
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
      setSubmitted(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      // Error animation
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  return (
    <motion.div
      className="py-10 sm:py-16 px-5 sm:px-10 bg-gray-50 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      animate={controls}
    >
      <motion.h3
        className="text-2xl font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        SUBSCRIBE TO OUR NEWSLETTER
      </motion.h3>

      <motion.p
        className="my-3 text-gray-500 max-w-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
      >
        Be the first to know about new collections, special events, and exclusive offers.
      </motion.p>

      <motion.form
        className="w-full max-w-lg flex flex-col sm:flex-row gap-2 sm:gap-0"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <input
          className="border flex-1 py-3 px-4 outline-none"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitted}
        />
        <motion.button
          className="bg-black text-white py-3 px-6"
          whileHover={{ backgroundColor: withOpacity ? withOpacity("#333333") : "#333333" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={submitted}
        >
          {submitted ? "Thank you!" : "SUBSCRIBE"}
        </motion.button>
      </motion.form>

      <AnimatedCheckmark visible={submitted} />
    </motion.div>
  );
};

// Animated checkmark component that appears after successful submission
const AnimatedCheckmark = ({ visible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      className="mt-4 text-green-500 flex items-center justify-center"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.5 }}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </motion.svg>
      <span className="ml-2">Subscription successful!</span>
    </motion.div>
  );
};

export default NewsletterBox;
