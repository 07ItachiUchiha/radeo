import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductList = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      toast.error(`Error loading products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const confirmDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/${id}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link 
          to="/add" 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded">
          No products available. Add some products to get started!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Image</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <img 
                      src={product.images && product.images.length > 0 
                        ? `${backendUrl}${product.images[0]}`
                        : (product.image ? `${backendUrl}${product.image}` : '')}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">
                    {product.category}
                    {product.subCategory && ` / ${product.subCategory}`}
                  </td>
                  <td className="py-2 px-4 border-b">{product.price} {currency}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <Link 
                        to={`/edit/${product._id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {/* Confirmation Modal */}
                    {confirmDelete === product._id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                          <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                          <p>Are you sure you want to delete "{product.name}"?</p>
                          <p className="text-red-500 text-sm mt-2">This action cannot be undone.</p>
                          <div className="flex justify-end gap-3 mt-6">
                            <button
                              onClick={cancelDelete}
                              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => confirmDeleteProduct(product._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
