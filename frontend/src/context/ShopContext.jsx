import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import API_BASE_URL from "../config/api";
 
export const ShopContext = createContext();

// Fix: Named component export for better Fast Refresh compatibility
const ShopContextProvider = ({ children }) => {
    const currency = "₹"
    const delivery_fee = 20; 
    // Use the imported API_BASE_URL as a fallback if env variable is undefined
    const backendUrl = import.meta.env.VITE_BACKEND_URL || API_BASE_URL;
    const [search , setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    // Initialize token from localStorage immediately to prevent flashing of login state
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    // Add authentication state tracking
    const [authChecked, setAuthChecked] = useState(false);

    const navigate = useNavigate();

    // Add a function to make API requests with proper URL
    const makeApiRequest = async (endpoint, method = 'get', data = null, headers = {}) => {
        // Add token to headers if available
        if (token && !headers.token) {
            headers.token = token;
        }
        
        const url = `${backendUrl}${endpoint}`;
        try {
            const config = { headers };
            if (method.toLowerCase() === 'get') {
                return await axios.get(url, config);
            } else {
                return await axios[method.toLowerCase()](url, data, config);
            }
        } catch (error) {
            console.error(`API Request Error: ${endpoint}`, error);
            // Handle authentication errors
            if (error.response?.status === 401) {
                handleAuthError();
            }
            throw error;
        }
    };

    // Handle authentication errors
    const handleAuthError = () => {
        // Only clear auth if we had a token (prevent multiple notifications)
        if (token) {
            localStorage.removeItem("token");
            setToken("");
            setCartItems({});
            toast.error("Authentication expired. Please log in again.");
        }
    };

    // Set token with proper persistence
    const saveToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    // Log out function
    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
        navigate("/login");
    };

    // Add a function to get the full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${backendUrl}${imagePath}`;
    };

    const addToCart = async (itemId, size) => {
        if (!size) {
          toast.error("Size not select!");
          return;
        }
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
          if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
          } else {
            cartData[itemId][size] = 1;
          }
        } else {
          cartData[itemId] = {};
          cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
          try {
            await makeApiRequest("/api/cart/add", "post", { itemId, size }, { token });
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) { //product
          for (const item in cartItems[items]) { //iterate size
            try {
              if (cartItems[items][item] > 0) {
                totalCount += cartItems[items][item];
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
          try {
            await makeApiRequest("/api/cart/update", "post", { itemId, size, quantity }, { token });
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
          let itemInfo = products.find((product) => product._id === items);

          for (const item in cartItems[items]) {
            try {
              if (cartItems[items][item] > 0 && itemInfo) {
                totalAmount += itemInfo.price * cartItems[items][item];
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
          const response = await makeApiRequest('/api/product/list');

          if (response.data.success) {
            setProducts(response.data.products);
          }
          else{
            toast.error(response.data.message)
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
    };

    // Updated to use the token parameter or the current token state
    const getUserCart = async (userToken = null) => {
        try {
            const tokenToUse = userToken || token;
            if (!tokenToUse) return;
            
            const response = await makeApiRequest("/api/cart/get", "post", {}, { token: tokenToUse });

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            // Only show error if it's not an auth error (which is handled elsewhere)
            if (error.response?.status !== 401) {
                toast.error(error.message);
            }
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token;
    };

    // Redirect to login if not authenticated
    const requireAuth = (redirectTo = "/login") => {
        if (!isAuthenticated()) {
            toast.error("Please login to continue");
            navigate(redirectTo);
            return false;
        }
        return true;
    };

    // Verify token validity on initial load and after token changes
    useEffect(() => {
        const verifyAuth = async () => {
            if (token) {
                try {
                    // Make a lightweight request to verify token is valid
                    await makeApiRequest("/api/user/verify", "get");
                    // If successful, get user's cart
                    getUserCart();
                } catch (error) {
                    // Token invalid, clear it
                    console.log("Token verification failed:", error);
                    if (error.response?.status === 401) {
                        localStorage.removeItem("token");
                        setToken("");
                    }
                }
            }
            setAuthChecked(true);
        };

        verifyAuth();
    }, [token]);

    useEffect(() => {
        getProductsData();
    }, []);

    return (
        <ShopContext.Provider value={{
            backendUrl,
            currency,
            products,
            setProducts,
            search,
            setSearch,
            showSearch,
            setShowSearch,
            addToCart,
            cartItems,
            setCartItems,
            updateQuantity,
            getCartCount,
            getCartAmount,
            token,
            setToken: saveToken, // Use the wrapped function that also updates localStorage
            navigate,
            delivery_fee,
            makeApiRequest,
            getImageUrl,
            isAuthenticated,
            requireAuth,
            logout, // Export the logout function
            authChecked, // Let components know if auth check is complete
        }}>
            {children}
        </ShopContext.Provider>
    );
};

// Export the provider as a named export for better HMR compatibility
export { ShopContextProvider };

// Also keep the default export for backward compatibility
export default ShopContextProvider;