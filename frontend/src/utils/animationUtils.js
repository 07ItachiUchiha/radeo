/**
 * Animation utility functions for consistent animations throughout the app
 */

/**
 * Consistent RGBA colors for animation
 * Using RGBA format makes all color transitions animatable
 */
export const COLORS = {
  transparent: "rgba(0, 0, 0, 0)",
  black: "rgba(0, 0, 0, 1)",
  white: "rgba(255, 255, 255, 1)",
  gray: {
    50: "rgba(249, 250, 251, 1)",
    100: "rgba(243, 244, 246, 1)",
    200: "rgba(229, 231, 235, 1)",
    300: "rgba(209, 213, 219, 1)",
    400: "rgba(156, 163, 175, 1)",
    500: "rgba(107, 114, 128, 1)",
    600: "rgba(75, 85, 99, 1)",
    700: "rgba(55, 65, 81, 1)",
    800: "rgba(31, 41, 55, 1)",
    900: "rgba(17, 24, 39, 1)",
  },
  green: {
    500: "rgba(34, 197, 94, 1)"
  }
};

/**
 * Creates an animatable background color with opacity
 * @param {string} color - Base color (rgb or hex)
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns {string} RGBA color string
 */
export const withOpacity = (color, opacity = 1) => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb(')) {
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length === 3) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
    }
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba(')) {
    const rgba = color.match(/\d+(\.\d+)?/g);
    if (rgba && rgba.length === 4) {
      return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${opacity})`;
    }
  }
  
  return color;
};

/**
 * Convert tailwind class names to RGBA for animation
 * @param {string} tailwindClass - Tailwind color class (e.g., "bg-gray-100")
 * @returns {string} RGBA value for animation
 */
export const tailwindToRgba = (tailwindClass) => {
  // Extract color and shade from tailwind class
  const match = tailwindClass.match(/bg-([a-z]+)-(\d+)/);
  if (match) {
    const [, color, shade] = match;
    if (COLORS[color] && COLORS[color][shade]) {
      return COLORS[color][shade];
    }
  }
  
  // Handle special colors
  if (tailwindClass === "bg-transparent") return COLORS.transparent;
  if (tailwindClass === "bg-black") return COLORS.black;
  if (tailwindClass === "bg-white") return COLORS.white;
  
  // Default fallback
  return COLORS.transparent;
};

/**
 * Create hover animation variants using RGBA colors for consistent animation
 * @param {string} baseColor - Base color in any format (will be converted to rgba)
 * @param {string} hoverColor - Hover color in any format (will be converted to rgba)
 * @returns {Object} Animation variants object for Framer Motion
 */
export const createHoverColorVariants = (baseColor, hoverColor) => {
  const base = baseColor === "transparent" ? COLORS.transparent : withOpacity(baseColor);
  const hover = hoverColor === "transparent" ? COLORS.transparent : withOpacity(hoverColor);
  
  return {
    initial: { backgroundColor: base },
    hover: { backgroundColor: hover },
  };
};

/**
 * Animation variants for background color change on condition
 * @param {boolean} condition - Condition to determine color
 * @param {string} trueColor - Color when condition is true
 * @param {string} falseColor - Color when condition is false
 * @returns {Object} Animation style object for Framer Motion
 */
export const conditionalBackgroundColor = (condition, trueColor, falseColor) => {
  const true_color = trueColor === "transparent" ? COLORS.transparent : withOpacity(trueColor);
  const false_color = falseColor === "transparent" ? COLORS.transparent : withOpacity(falseColor);
  
  return {
    backgroundColor: condition ? true_color : false_color
  };
};

/**
 * Common animation variants
 */
export const ANIMATIONS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  },
  buttonHover: {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  }
};
