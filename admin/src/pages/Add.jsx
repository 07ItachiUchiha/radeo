import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import AdminProductFormFields from "../components/AdminProductFormFields";

const Add = ({ token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  
  // Multiple images upload with previews
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("description", description);
    formData.append("bestseller", bestseller);
    formData.append("sizes", JSON.stringify(sizes));
    
    // Add multiple images
    imageFiles.forEach(file => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Product added successfully");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubcategory("Topwear");
        setBestseller(false);
        setSizes([]);
        setImageFiles([]);
        setImagePreviews([]);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      toast.error("Error uploading product: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  return (
    <main>
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full items-start gap-3"
      >
        {/* Product Image Upload */}
        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Images (Upload up to 5)</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="border p-2 w-full max-w-[500px]"
          />
          
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-40 w-40 object-cover rounded"
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reusable form fields */}
        <AdminProductFormFields
          name={name} setName={setName}
          description={description} setDescription={setDescription}
          price={price} setPrice={setPrice}
          category={category} setCategory={setCategory}
          subCategory={subCategory} setSubcategory={setSubcategory}
          bestseller={bestseller} setBestseller={setBestseller}
          sizes={sizes} setSizes={setSizes}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="uppercase bg-black text-white px-6 py-3 rounded mt-4"
        >
          Add Product
        </button>
      </form>
    </main>
  );
};

export default Add;
