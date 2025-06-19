import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { AnimatePresence, motion } from "framer-motion"; // eslint-disable-line
import FadeIn from "../components/animations/FadeIn";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCaterogy] = useState([]);
  const [subCategory, setSubCaterogy] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCaterogy((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCaterogy((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCaterogy((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCaterogy((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  }, [products, showSearch, search, category, subCategory]);

  const sortProduct = useCallback(() => {
    let filterProductsCopy = products.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductsCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(filterProductsCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  }, [products, sortType, applyFilter]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, applyFilter]);

  useEffect(() => {
    sortProduct();
  }, [sortType, sortProduct]);

  // Animation variants for filter sidebar
  const filterVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  // Animation variants for product items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <main className="border-t pt-8 min-h-[90vh]">
      <FadeIn>
        <Title text1={"OUR"} text2={"COLLECTIONS"} />
      </FadeIn>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10">
        {/* ------------filter options----------- */}
        <div className="min-w-60">
          <motion.p
            onClick={() => setShowFilters(!showFilters)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.97 }}
          >
            FILTERS{" "}
            <motion.img
              className={`h-3 sm:hidden`}
              src={assets.dropdown_icon}
              alt="dropdown icon"
              animate={{ rotate: showFilters ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.p>

          {/* -------category filter ------- */}
          <AnimatePresence>
            <motion.div
              className={`border border-gray-300 pl-5 py-3 mt-6 ${
                showFilters ? "" : "hidden sm:block"
              }`}
              initial={false}
              animate={showFilters || window.innerWidth >= 640 ? "visible" : "hidden"}
              exit="hidden"
              variants={filterVariants}
            >
              <p className="mb-3 text-sm font-medium">CATEGORIES</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <motion.p className="flex gap-2" whileHover={{ x: 3 }}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Men"}
                    onChange={toggleCategory}
                  />{" "}
                  Men
                </motion.p>
                <motion.p className="flex gap-2" whileHover={{ x: 3 }}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Women"}
                    onChange={toggleCategory}
                  />{" "}
                  Women
                </motion.p>
                <motion.p className="flex gap-2" whileHover={{ x: 3 }}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Kids"}
                    onChange={toggleCategory}
                  />{" "}
                  Kids
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* -------subCategory----------- */}
          <AnimatePresence>
            <motion.div
              className={`border border-gray-300 pl-5 py-3 mt-6 ${
                showFilters ? "" : "hidden sm:block"
              }`}
              initial={false}
              animate={showFilters || window.innerWidth >= 640 ? "visible" : "hidden"}
              exit="hidden"
              variants={filterVariants}
            >
              <p className="mb-3 text-sm font-medium">TYPE</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <motion.p className="flex gap-2" whileHover={{ x: 3 }}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Topwear"}
                    onChange={toggleSubCategory}
                  />{" "}
                  Topwear
                </motion.p>
                <motion.p className="flex gap-2" whileHover={{ x: 3 }}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Bottomwear"}
                    onChange={toggleSubCategory}
                  />{" "}
                  Bottomwear
                </motion.p>
                <motion.p className="flex gap-2" whileHover={{ x: 3 }}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Winterwear"}
                    onChange={toggleSubCategory}
                  />{" "}
                  Winterwear
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ------------filter products----------- */}
        {/* Right Side */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <FadeIn delay={0.1}>
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
            </FadeIn>

            {/* -----product sort------- */}
            <motion.select
              onChange={(e) => setSortType(e.target.value)}
              className="border border-gray-300 text-sm px-2"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low-High</option>
              <option value="high-low">Sort by: High-Low</option>
            </motion.select>
          </div>

          {/* ---------Map products=---------- */}
          <motion.section
            className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filterProducts.map((item, index) => (
              <FadeIn key={item._id} delay={index * 0.05} once={false} threshold={0.1}>
                <ProductItem
                  _id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  images={item.images}
                />
              </FadeIn>
            ))}
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default Collection;
