import React, { useState, useEffect } from "react";
import { getProductList, addProduct, updateProductById, deleteProductById } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { FaEdit, FaTrash } from "react-icons/fa";
import medicine from "../assets/medicine.jpeg";
import medicine2 from "../assets/medicine 2.jpeg";
import medicine3 from "../assets/medicine 3.jpeg";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [pricePerAcre, setPricePerAcre] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productRate, setProductRate] = useState(0);
  const [productInstructions, setProductInstructions] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [productCategory, setProductCategory] = useState("पर्णनेत्र आयुर्वेदिक एग्रो इनपुट्स");

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
    if (!productCategory) {
      toast.error("Please enter Some Instructions!");
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
          category: productCategory,
          rate: productRate,
        });
        toast.success("Product updated successfully");
      } else {
        await addProduct({
          name: productName.trim(),
          pricePerAcre: Number(productPrice),
          category: productCategory,
          rate: productRate,
        });
        toast.success("Product added successfully");
      }

      setProductName("");
      setProductPrice("");
      setProductInstructions("");
      setProductCategory("");
      setProductRate(0);
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
    setProductCategory(product.category); // <-- set price in the state for editing
    setProductRate(product.rate);
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
      {/* Left Side - Product Management */}
      <div className="lg:w-2/3">
        <div className="bg-green-50 border border-green-300 rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center flex items-center justify-center gap-2">🌱 उत्पादन यादी (Product List)</h2>

          {/* Add/Edit Product Form */}
          <form onSubmit={handleSubmit} className="flex  gap-4 mb-6">
            {/* उत्पादनाचे नाव */}
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="mb-1 text-green-800 font-medium text-sm">उत्पादनाचे नाव</label>
              <input
                type="text"
                placeholder="उत्पादनाचे नाव टाका"
                className="border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            {/* किंमत (१ एकरासाठी) */}
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="mb-1 text-green-800 font-medium text-sm">किंमत (१ एकरासाठी)</label>
              <input
                type="number"
                placeholder="किंमत (१ एकरासाठी)"
                className="border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
                min="0"
              />
            </div>

            {/* दर (१ एकरासाठी) */}
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="mb-1 text-green-800 font-medium text-sm">दर (१ एकरासाठी)</label>
              <input
                type="number"
                placeholder="उदा. 4.5"
                className="border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={productRate}
                onChange={(e) => setProductRate(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* उत्पादन श्रेणी */}
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="mb-1 text-green-800 font-medium text-sm">उत्पादनाची श्रेणी</label>
              <select
                className="border border-green-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                required
              >
                <option value="">श्रेणी निवडा</option>
                <option value="पर्णनेत्र आयुर्वेदिक एग्रो इनपुट्स">पर्णनेत्र आयुर्वेदिक एग्रो इनपुट्स</option>
                <option value="जैव नियंत्रण उत्पाद">जैव नियंत्रण उत्पाद</option>
                <option value="खेत पर इनपुट">खेत पर इनपुट</option>
                <option value="खेत पर पत्तों से धुवा">खेत पर पत्तों से धुवा</option>
              </select>
            </div>

            {/* बटण */}
            <div className="flex w-full justify-end">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow font-semibold transition">
                {editingId ? "अपडेट करा" : "जोडा"}
              </button>
            </div>
          </form>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="उत्पादन शोधा..."
            className="mb-6 border border-green-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Product Gallery */}
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white border border-green-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="text-lg font-bold text-green-900">{product.name}</h3>
                      <spam>{product.category}</spam>
                      <p className="text-sm text-gray-700">Rate - {product.rate}</p>
                      <p className="mt-2 text-green-700 font-semibold">₹{product.pricePerAcre} / एकर</p>
                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleEdit(product)} className="bg-green-100 text-green-800 hover:bg-green-200 p-2 rounded-full shadow" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-full shadow" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-full text-center">कोणतेही उत्पादन सापडले नाही.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Krishi Seva Kendra Banner */}
      <div className="lg:w-1/3 flex flex-col justify-center items-center">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-md border border-green-200">
          <img src={medicine} alt="Krishi Seva Kendra Banner" className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-md border border-green-200">
          <img src={medicine2} alt="Krishi Seva Kendra Banner" className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-md border border-green-200">
          <img src={medicine3} alt="Krishi Seva Kendra Banner" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
