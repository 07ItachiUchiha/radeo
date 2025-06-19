import React from 'react';

const AdminProductFormFields = ({
  name, setName,
  description, setDescription,
  price, setPrice,
  category, setCategory,
  subCategory, setSubcategory,
  bestseller, setBestseller,
  sizes, setSizes
}) => {
  return (
    <>
      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2 font-medium text-sm">Product Name</p>
        <input
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2 font-medium text-sm">Product Description</p>
        <textarea
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border"
          placeholder="Write product description"
          required
        />
      </div>

      {/* Category, Subcategory and Price */}
      <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
        <div>
          <p className="mb-2 font-medium text-sm">Product Category</p>
          <select
            className="w-full px-3 py-2 border"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        
        <div>
          <p className="mb-2 font-medium text-sm">Product SubCategory</p>
          <select
            className="w-full px-3 py-2 border"
            name="subCategory"
            value={subCategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium text-sm">Product Price</p>
          <input
            name="price"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full max-w-[500px] px-3 py-2 border"
            type="number"
            placeholder="₹"
            required
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div>
        <p className="mb-2 font-medium text-sm">Product Sizes</p>
        <div className="flex gap-2.5">
          {["S", "M", "L", "XL", "XXL"].map((sizeOption) => (
            <div
              key={sizeOption}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(sizeOption)
                    ? prev.filter((item) => item !== sizeOption)
                    : [...prev, sizeOption]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(sizeOption) ? "bg-pink-100" : "bg-pink-200"
                } px-3 py-1 cursor-pointer`}
              >
                {sizeOption}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          name="bestseller"
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>
    </>
  );
};

export default AdminProductFormFields;
