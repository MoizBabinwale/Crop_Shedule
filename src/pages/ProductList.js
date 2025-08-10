import React, { useState, useEffect } from "react";
import { getProductList, addProduct, updateProductById, deleteProductById } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { FaEdit, FaTrash } from "react-icons/fa";
import banner from "../assets/Sell-file-3.jpg";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [pricePerAcre, setPricePerAcre] = useState("");
  const [productPrice, setProductPrice] = useState("");
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
    e.preventDefault();
    const trimmedName = productName.trim().toLowerCase();

    if (!trimmedName) {
      toast.error("Please enter a product name!");
      return;
    }
    if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
      toast.error("Please enter a valid per-acre price!");
      return;
    }

    const isDuplicate = products.some((product) => product.name.toLowerCase() === trimmedName && product._id !== editingId);
    if (isDuplicate) {
      toast.error("Product name already exists!");
      return;
    }

    try {
      if (editingId) {
        await updateProductById(editingId, {
          name: productName.trim(),
          pricePerAcre: Number(productPrice),
        });
        toast.success("Product updated successfully");
      } else {
        await addProduct({
          name: productName.trim(),
          pricePerAcre: Number(productPrice),
        });
        toast.success("Product added successfully");
      }

      setProductName("");
      setProductPrice("");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting product:", error);
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleEdit = (product) => {
    setEditingId(product._id);
    setProductName(product.name);
    setProductPrice(product.pricePerAcre); // <-- set price in the state for editing
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
    <div className="flex flex-col lg:flex-row gap-6 max-w-8xl mx-auto px-4 py-8">
      {/* Left Side - Product List */}
      <div className="lg:w-2/3">
        <div className="bg-green-50 border border-green-300 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">🌱 उत्पादन यादी (Product List)</h2>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="उत्पादनाचे नाव टाका"
              className="flex-1 border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="किंमत (१ एकरासाठी)"
              className="w-40 border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
              min="0"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold">
              {editingId ? "अपडेट करा" : "जोडा"}
            </button>
          </form>

          <input
            type="text"
            placeholder="उत्पादन शोधा..."
            className="mb-4 border border-green-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                      <div>
                        <span className="text-green-900 font-medium">{product.name}</span>
                        <p className="text-sm text-gray-500">₹{product.pricePerAcre} / एकर</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)} className="bg-green-100 text-green-800 hover:bg-green-200 p-2 rounded-full shadow" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-full shadow" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">कोणतेही उत्पादन सापडले नाही.</p>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Right Side - Krishi Seva Kendra Banner */}
      <div className="lg:w-1/3 flex justify-center items-center">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-md border border-green-200">
          <img
            src={banner} // 🟢 Replace with your actual image path
            alt="Krishi Seva Kendra Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
