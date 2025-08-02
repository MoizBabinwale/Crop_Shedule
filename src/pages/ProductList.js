import React, { useState, useEffect } from "react";
import { getProductList, addProduct, updateProductById, deleteProductById } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProductList();
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit handler

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const trimmedName = productName.trim().toLowerCase();

    if (!trimmedName) return;

    // Check for duplicate (case-insensitive)
    const isDuplicate = products.some((product) => product.name.toLowerCase() === trimmedName && product._id !== editingId);

    if (isDuplicate) {
      toast.error("Product name already exists!");
      return;
    }

    try {
      if (editingId) {
        await updateProductById(editingId, { name: productName.trim() });
        toast.success("Product updated successfully");
      } else {
        await addProduct({ name: productName.trim() });
        toast.success("Product added successfully");
      }

      setProductName("");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting product:", error);
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Edit handler
  const handleEdit = (product) => {
    setEditingId(product._id);
    setProductName(product.name);
  };

  // Delete handler
  const handleDeleteProduct = async (id) => {
    const toastId = toast.loading("Deleting product...");

    try {
      await deleteProductById(id);
      fetchProducts();

      toast.update(toastId, {
        render: "Product deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to delete product",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-green-50 border border-green-200 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">🌿 Product List</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter product name"
          className="flex-1 border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search products..."
        className="mb-4 border border-green-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <Loading />
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <li key={product._id} className="flex justify-between items-center bg-white border border-green-200 p-3 rounded-lg shadow-sm">
                  <span className="text-green-900 font-medium">{product.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(product)} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2 rounded-full shadow" title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full shadow" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">No products found.</p>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default ProductList;
