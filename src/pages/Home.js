import React, { useState } from "react";
import { submitData } from "../api/api";

const Home = () => {
  const [formData, setFormData] = useState({
    sheduleId: "",
    date: "",
    perLiter: "",
    waterPerAcre: "",
    totalAcres: "",
    totalWater: "",
    productAmountMg: "",
    productAmountLtr: "",
    useStartDay: "",
    products: [
      { name: "", quantity: "" },
      { name: "", quantity: "" },
      { name: "", quantity: "" },
    ],
    instructions: "",
  });

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null && field !== null) {
      const updatedProducts = [...formData.products];
      updatedProducts[index][field] = value;
      setFormData((prev) => ({ ...prev, products: updatedProducts }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitData(formData); // ✅ Add await here
      console.log(response);
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="flex items-center justify-center bg-slate-300 py-4 px-2">
        <p className="text-center font-semibold text-base sm:text-lg md:text-xl">पापीता का १ एकड का प्लाट और पर्णनेत्र आयुर्वेदीक कृषी प्रणाली का साप्ताहिक शेड्यूल</p>
      </div>

      {/* Main Form Section */}
      <form>
        <div className="flex justify-center items-start min-h-screen py-10 px-4 bg-blue-50">
          <div className="w-full max-w-6xl space-y-10">
            {/* New Schedule Entry Section */}
            <div className="border border-gray-300 rounded-lg p-6 bg-white shadow">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">नई शेड्यूल एंट्री - New Schedule Entry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "sheduleId", label: "Shedule ID", type: "text" },
                  { name: "date", label: "दिनाक", type: "date" },
                  { name: "perLiter", label: "प्रति लीटर पानी मे मिली", type: "text" },
                  { name: "waterPerAcre", label: "पानी / एकड़ (लीटर में)", type: "text" },
                  { name: "totalAcres", label: "कुल एकड़", type: "text" },
                  { name: "totalWater", label: "पानी कुल लीटर", type: "text" },
                  { name: "productAmountMg", label: "उत्पादों की मात्रा (मिली/ग्राम)", type: "text" },
                  { name: "productAmountLtr", label: "उत्पादों की मात्रा (लीटर/किग्रा)", type: "text" },
                  { name: "useStartDay", label: "आरंभ दिन से उपयोग करने का दिन", type: "text" },
                ].map((field, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="w-full md:w-1/2 text-gray-700 font-medium">{field.label}:</label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full md:w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="border border-gray-300 rounded-lg p-6 bg-white shadow">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">उत्पाद विवरण - Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.products.map((prod, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label className="w-full md:w-1/2 text-gray-700 font-medium">उत्पाद {index + 1}:</label>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => handleChange(e, index, "name")}
                        className="w-full md:w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label className="w-full md:w-1/2 text-gray-700 font-medium">मात्रा:</label>
                      <input
                        type="number"
                        value={prod.quantity}
                        onChange={(e) => handleChange(e, index, "quantity")}
                        className="w-full md:w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 bg-white shadow">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">निर्देश - Instructions</h2>
              <div className="flex flex-col md:flex-row md:items-start gap-2">
                <label className="w-full md:w-1/2 text-gray-700 font-medium">मिश्रण और उपयोग के निर्देश:</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="5"
                  placeholder="निर्देश लीखे"
                  className="w-full md:w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 resize-none"
                />
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button onClick={handleSubmit} className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition md:w-auto w-full">
                एंट्री जोड़ें (Add Entry)
              </button>
              <button className="bg-yellow-600 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-700 transition md:w-auto w-full">फ़ील्ड साफ़ करें (Clear Fields)</button>
              <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition md:w-auto w-full">कुल गणना करें (Calculate Total)</button>
              <button className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 transition md:w-auto w-full">नई फसल जोड़ें (Add New Crop)</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Home;
