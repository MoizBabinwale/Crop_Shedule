import React, { useEffect, useState } from "react";
import { getAllQuotations, deleteQuotation, getQuotationById, updateQuotation, createQuotation } from "../api/api";
import { useNavigate } from "react-router-dom";
import leaf from "../assets/Greenleaf.png";

function QuotationMaster() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const res = await getAllQuotations();
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
    await deleteQuotation(id);
    fetchQuotations();
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
      {/* <button onClick={() => navigate("/quotation/add")} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        ➕ Add Quotation
      </button> */}

      {loading ? (
        <p>Loading quotations...</p>
      ) : (
        <table className="w-full border border-green-700 rounded-lg shadow-md overflow-hidden text-sm">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="border border-green-700 px-4 py-2">#</th>
              <th className="border border-green-700 px-4 py-2">Crop Name</th>
              <th className="border border-green-700 px-4 py-2">Acres</th>
              <th className="border border-green-700 px-4 py-2">Created At</th>
              <th className="border border-green-700 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {quotations.length > 0 &&
              quotations.map((q, index) => (
                <tr key={q._id} className="hover:bg-green-50 transition">
                  <td className="border border-green-700 px-4 py-2 text-center font-medium text-green-800">{index + 1}</td>
                  <td className="border border-green-700 px-4 py-2 text-center">{q.cropName}</td>
                  <td className="border border-green-700 px-4 py-2 text-center">{q.acres}</td>
                  <td className="border border-green-700 px-4 py-2 text-center">
                    {new Date(q.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="border border-green-700 px-4 py-2 text-center space-x-2">
                    <button onClick={() => handleView(q._id)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                      📄 View
                    </button>
                    {/* <button onClick={() => handleEdit(q._id)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200">
                      ✏️ Edit
                    </button> */}
                    <button
                      onClick={() => {
                        setSelectedDeleteId(q._id);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white border border-green-600 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-green-100 p-2 rounded-full shadow-md">
              <img src={leaf} alt="Leaf" className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-green-700 text-center mt-6 mb-4">आपण हा कोटेशन खरंच हटवू इच्छिता का?</h2>

            <p className="text-center text-gray-600 mb-6">ही क्रिया कायमची आहे आणि पूर्ववत केली जाऊ शकत नाही.</p>

            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-sm">
                रद्द करा
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedDeleteId);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
              >
                हटवा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationMaster;
