import React, { useEffect, useState } from "react";
import { getAllQuotations, deleteQuotation, getQuotationById, updateQuotation, createQuotation } from "../api/api";
import { useNavigate } from "react-router-dom";

function QuotationMaster() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const res = await getAllQuotations();
      console.log("res ", res);
      if (res.length > 0) {
        setQuotations(res);
      }
    } catch (err) {
      console.error("Failed to fetch quotations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      await deleteQuotation(id);
      fetchQuotations();
    }
  };

  const handleEdit = (id) => {
    navigate(`/quotation/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/schedule/quotation/${id}`);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Quotation Master</h2>
      <button onClick={() => navigate("/quotation/add")} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        ➕ Add Quotation
      </button>

      {loading ? (
        <p>Loading quotations...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Crop Name</th>
              <th className="border p-2">Acres</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.length > 0 &&
              quotations.map((q, index) => (
                <tr key={q._id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{q.cropName}</td>
                  <td className="border p-2 text-center">{q.acres}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button onClick={() => handleView(q._id)} className="text-blue-600 hover:underline">
                      📄 View
                    </button>
                    <button onClick={() => handleEdit(q._id)} className="text-yellow-600 hover:underline">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:underline">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuotationMaster;
