import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const CartBadge = ({ count = 0 }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          key="cart-badge"
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1,
            height: "16px",
            width: "16px"
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
          }}
        >
          {count > 9 ? "9+" : count}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartBadge;
