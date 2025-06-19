import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import AdminProductFormFields from "../components/AdminProductFormFields";

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  
  // Multiple image uploads
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/product/${id}`, {
          headers: { token }
        });
        
        if (response.data.success) {
          const product = response.data.product;
          setName(product.name);
          setDescription(product.description || "");
          setPrice(product.price);
          setCategory(product.category);
          setSubcategory(product.subCategory || "");
          setBestseller(product.bestseller || false);
          setSizes(product.sizes || []);
          
          // Handle both old 'image' and new 'images' fields
          if (product.images && Array.isArray(product.images)) {
            setExistingImages(product.images);
          } else if (product.image) {
            setExistingImages(Array.isArray(product.image) ? product.image : [product.image]);
          }
        } else {
          setError("Failed to fetch product");
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
        toast.error(`Error loading product: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchProduct();
    }
  }, [id, token]);

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setNewImageFiles(prevFiles => [...prevFiles, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeExistingImage = (imagePath) => {
    setImagesToDelete(prev => [...prev, imagePath]);
    toast.info("Image marked for deletion");
  };

  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one image will remain
    if (existingImages.length - imagesToDelete.length === 0 && newImageFiles.length === 0) {
      toast.error("Product must have at least one image");
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
    
    // Add new images
    newImageFiles.forEach(file => {
      formData.append("images", file);
    });
    
    // Add images to delete
    if (imagesToDelete.length > 0) {
      formData.append("deleteImages", JSON.stringify(imagesToDelete));
    }

    try {
      const response = await axios.put(`${backendUrl}/api/product/update/${id}`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/list");
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("Error updating product: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  return (
    <main>
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full items-start gap-3"
      >
        {/* Existing Product Images */}
        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Current Images</p>
          <div className="flex flex-wrap gap-4 mb-4">
            {existingImages
              .filter(img => !imagesToDelete.includes(img))
              .map((img, index) => (
                <div key={index} className="relative">
                  <img 
                    src={`${backendUrl}${img}`} 
                    alt={`Product ${index}`} 
                    className="h-40 w-40 object-cover rounded"
                  />
                  <button 
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Upload New Images</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
            className="border p-2 w-full max-w-[500px]"
          />
          
          {newImagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {newImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`New upload ${index}`}
                    className="h-40 w-40 object-cover rounded"
                  />
                  <button 
                    type="button"
                    onClick={() => removeNewImage(index)}
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

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="uppercase bg-black text-white px-6 py-3 rounded"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="uppercase bg-gray-300 text-black px-6 py-3 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditProduct;
