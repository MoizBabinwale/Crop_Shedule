import React, { useEffect, useState } from "react";
import { getAllQuotations, deleteQuotation, getQuotationById, updateQuotation, createQuotation } from "../api/api";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images.jpg";

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

  const [currentPage, setCurrentPage] = useState(1);
  const quotationsPerPage = 50;

  // 📄 Pagination logic
  const indexOfLastQuotation = currentPage * quotationsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;
  const currentQuotations = quotations.slice(indexOfFirstQuotation, indexOfLastQuotation);
  const totalPages = Math.ceil(quotations.length / quotationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl shadow bg-white mb-6">
        <img src={banner} alt="Quotation Banner" className="w-fit h-40 object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/70 to-green-500/60"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">Quotation Master</h1>
          <p className="text-white/90 mt-1 text-sm md:text-base">Manage, view, and organize all crop quotations.</p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-green-600 pl-3 mb-4">All Quotations</h2>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Crop Name</th>
                <th className="p-3 text-left">Farmer Name/Place</th>
                <th className="p-3 text-left">Acres</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {quotations && quotations.length > 0 ? (
                quotations.map((q, index) => (
                  <tr key={q._id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{q.cropName}</td>
                    <td className="p-3 font-medium">
                      {q.farmerInfo.name} / {q.farmerInfo.place}
                    </td>
                    <td className="p-3">{q.acres}</td>
                    <td className="p-3">{new Date(q.createdAt).toLocaleDateString()}</td>

                    <td className="p-3 flex gap-3">
                      <button onClick={() => handleView(q._id)} className="text-blue-600 hover:underline">
                        View
                      </button>

                      <button onClick={() => handleEdit(q._id)} className="text-green-600 hover:underline">
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          handleDelete(q._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No quotations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QuotationMaster;
