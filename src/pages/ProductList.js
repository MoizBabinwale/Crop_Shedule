import React, { useState, useEffect } from "react";
import { getProductList, addProduct, updateProductById, deleteProductById } from "../api/api";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    const data = await getProductList();
    if (data) {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit handler

  const handleSubmit = async (e) => {
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input type="text" placeholder="Enter product name" className="flex-1 border p-2 rounded" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <input type="text" placeholder="Search products..." className="mb-4 border p-2 rounded w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{product.name}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
                  ✏️
                </button>
                <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700">
                  🗑️
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No products found.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductList;
