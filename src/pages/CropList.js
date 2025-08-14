import React, { useEffect, useState } from "react";
import { addCropData, createQuotation, deleteCropById, editCropData, getCropById, getCropData, getSchedulesByCropId } from "../api/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "../components/Loading";
import { FaFileInvoice, FaEdit, FaTrash } from "react-icons/fa";
import bannerImg from "../assets/banner.jpg";
import leaf from "../assets/Greenleaf.png";
import { useRef } from "react";
import { motion } from "framer-motion";

function CropList() {
  const [cropList, setCropList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: "", description: "", weeks: "" });
  const [editCropId, setEditCropId] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [acreValue, setAcreValue] = useState(0);
  const [acreValues, setAcreValues] = useState({});

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState("");
  const [farmerInfo, setFarmerInfo] = useState({
    name: "",
    place: "",
    tahsil: "",
    district: "",
    state: "",
  });

  const modalRef = useRef(null);

  // Fetch crops
  useEffect(() => {
    setLoading(true);
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const res = await getCropData();
    if (res.data) {
      const cropsWithBillStatus = await Promise.all(
        res.data.map(async (crop) => {
          try {
            const schedule = await getSchedulesByCropId(crop._id); // Assuming one schedule per crop
            if (schedule && schedule.scheduleBillId) {
              return { ...crop, scheduleId: schedule._id, hasBill: true };
            }
          } catch (err) {
            console.error("Error fetching schedule for crop", crop._id, err);
          }
          return { ...crop, hasBill: false };
        })
      );
      console.log("cropsWithBillStatus ", cropsWithBillStatus);

      setCropList(cropsWithBillStatus);
      setLoading(false);
    } else {
      toast.warning("Unable to fetch Data!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
        // transition: Bounce,
      });
      setLoading(false);
      setCropList([]);
    }
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCrop.weeks <= 0) {
      toast.warning("आठवड्यांची संख्या 0 किंवा त्यापेक्षा कमी असू शकत नाही!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
        // transition: Bounce,
      });
      return;
    }

    if (editCropId) {
      const res = await editCropData(editCropId, newCrop);
    } else {
      const res = await addCropData(newCrop);
    }
    fetchCrops();
    setIsDialogOpen(false);
    setNewCrop({ name: "", weeks: "", description: "" });
    setEditCropId(null);
  };

  // Handle edit
  const handleEdit = (crop) => {
    setNewCrop({ name: crop.name, weeks: crop.weeks, description: crop.description });
    setEditCropId(crop._id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "आपणास हा पिक खरोखर हटवायचा आहे का? / Do you really want to delete this crop?",

      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const toastId = toast.loading("Deleting crop...");

            try {
              await deleteCropById(id);
              fetchCrops();

              toast.update(toastId, {
                render: "Crop deleted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                position: "top-center",
              });
            } catch (error) {
              toast.error(toastId, {
                render: "Failed to delete crop",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                position: "top-center",
              });
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing
          },
        },
      ],
    });
  };

  const handleGenerateQuotation = async (cropId, farmerData) => {
    setLoading(true);
    try {
      const crop = await getCropById(cropId);
      const schedule = await getSchedulesByCropId(cropId);

      const acreValue = acreValues[cropId]; // not acreValues.cropId
      const acres = Number(acreValue);

      const allProducts = (schedule.weeks || []).flatMap((week) => week.products || []);

      const updatedWeeks = schedule.weeks.map((week) => ({
        ...week,
        totalWater: String(acres * Number(week.waterPerAcre || 0)),
        totalAcres: String(acres),
        productAmountMg: String(acres * Number(week.productAmountMg || 0)),
        productAmountLtr: String(acres * Number(week.productAmountLtr || 0)),
        products: (week.products || []).map((prod) => {
          const [mlPart, lPart] = (prod.quantity || "").split("&").map((q) => q.trim());

          const ml = parseFloat(mlPart?.split(" ")[0]) || 0;
          const mlUnit = mlPart?.split(" ")[1] || "ml/g";

          const l = parseFloat(lPart?.split(" ")[0]) || 0;
          const lUnit = lPart?.split(" ")[1] || "l/kg";
          const repeatCount = allProducts.filter((p) => p.name === prod.name).length;
          return {
            name: prod.name,
            quantity: `${(ml * acres).toFixed(2)} ${mlUnit} & ${(l * acres).toFixed(3)} ${lUnit}`,
            perLitreMix: prod.perLitreMix,
            price: Number(prod.pricePerAcre * acres * repeatCount).toFixed(2), // 💰 price calculation
            instruction: prod.instruction,
            category: prod.category,
            rate: prod.rate,
          };
        }),
      }));

      const quotationPayload = {
        cropId,
        cropName: crop.name,
        acres,
        weeks: updatedWeeks,
        farmerInfo: farmerData, // 👈 save farmer info here
        scheduleId: selectedScheduleId,
      };
      console.log("quotationPayload ", quotationPayload);

      // const res = 1;
      const res = await createQuotation(quotationPayload);
      toast.success("Quotation created successfully");
      setLoading(false);
      setAcreValues({});
      setFarmerInfo({
        name: "",
        place: "",
        tahsil: "",
        district: "",
        state: "",
      });
      const quotationId = res._id;

      navigate(`/schedule/quotation/${quotationId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate quotation");
    } finally {
      setLoading(false);
    }
  };

  const promptFarmerDetails = () => {
    return new Promise((resolve) => {
      const name = prompt("Enter Farmer Name:");
      if (!name) return resolve(null);

      const place = prompt("Enter Place:");
      const tahsil = prompt("Enter Tahsil:");
      const district = prompt("Enter District:");
      const state = prompt("Enter State:");

      resolve({ name, place, tahsil, district, state });
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="p-6 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-green-800">Crop List</h1>
            <button
              onClick={() => {
                setIsDialogOpen(true);
                setEditCropId(null);
                setNewCrop({ name: "", weeks: "", description: "" });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              + Add Crop
            </button>
          </div>

          {/* Crop List */}
          <div className="space-y-4">
            {cropList.map((crop, index) => (
              <motion.div
                key={crop._id}
                className="bg-white border border-green-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Crop Info */}
                <div className="flex-1">
                  <Link to={`/form1?name=${encodeURIComponent(crop.name)}&weeks=${crop.weeks}&id=${crop._id}`} className="text-lg font-semibold text-green-900 hover:underline">
                    {crop.name} – {crop.weeks} weeks
                  </Link>
                  {crop.description && <p className="text-sm text-gray-600 mt-1">{crop.description}</p>}
                </div>

                {/* Acres Input */}
                <input
                  type="number"
                  placeholder="Acres"
                  className="border border-green-300 p-2 rounded-lg w-24 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={acreValues[crop._id] || ""}
                  onChange={(e) =>
                    setAcreValues((prev) => ({
                      ...prev,
                      [crop._id]: e.target.value,
                    }))
                  }
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const acres = parseFloat(acreValues[crop._id]);
                      if (!acres || acres <= 1) {
                        toast.warning("कृपया 1 पेक्षा जास्त एकर प्रविष्ट करा!", {
                          position: "top-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                          theme: "light",
                        });
                        return;
                      }
                      setShowModal(true);
                      setSelectedCropId(crop._id);
                      setSelectedScheduleId(crop.scheduleId);
                    }}
                    className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full shadow"
                    title="Generate Quotation"
                  >
                    <FaFileInvoice />
                  </button>

                  {crop.hasBill && crop.scheduleId && (
                    <button
                      onClick={() => navigate(`/schedulebill/view/${crop.scheduleId}`)}
                      className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full shadow"
                      title="View Schedule Bill"
                    >
                      🧾
                    </button>
                  )}

                  <button onClick={() => handleEdit(crop)} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2 rounded-full shadow" title="Edit Crop">
                    <FaEdit />
                  </button>

                  <button onClick={() => handleDelete(crop._id)} className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full shadow" title="Delete Crop">
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add/Edit Crop Modal */}
          {isDialogOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
              onClick={(e) => {
                if (modalRef.current && !modalRef.current.contains(e.target)) {
                  setIsDialogOpen(false);
                }
              }}
            >
              <div ref={modalRef} className="bg-white border border-green-600 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative" onClick={(e) => e.stopPropagation()}>
                {/* Decorative Icon */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-green-100 p-2 rounded-full shadow-md">
                  <img src={leaf} alt="Leaf" className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-green-700 text-center mt-6 mb-4">{editCropId ? "पिक माहिती अपडेट करा" : "नवीन पीक जोडा"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="पिकाचे नाव (Crop Name)"
                    className="w-full border border-green-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="पिकाचे वर्णन (Crop Description)"
                    className="w-full border border-green-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newCrop.description}
                    onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="आठवड्यांची संख्या (Weeks)"
                    className="w-full border border-green-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newCrop.weeks}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewCrop({
                        ...newCrop,
                        weeks: val === "" ? "" : Number(val),
                      });
                    }}
                    required
                  />

                  <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-sm">
                      रद्द करा
                    </button>
                    <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md">
                      {editCropId ? "अपडेट करा" : "जोडा"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Farmer Info Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-3">
                <h2 className="text-lg font-semibold text-green-700">Enter Farmer Details</h2>

                {["name", "place", "tahsil", "district", "state"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={`Enter ${field}`}
                    value={farmerInfo[field]}
                    onChange={(e) => setFarmerInfo({ ...farmerInfo, [field]: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                ))}

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="px-4 py-1.5 bg-gray-300 rounded hover:bg-gray-400 text-sm">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleGenerateQuotation(selectedCropId, farmerInfo);
                      setShowModal(false);
                    }}
                    className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CropList;
