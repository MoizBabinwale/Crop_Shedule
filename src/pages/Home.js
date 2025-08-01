import React, { useEffect, useState } from "react";
import { addCropData, deleteCropById, editCropData, getCropData } from "../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Home = () => {
  const [cropList, setCropList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: "", weeks: "" });
  const [editCropId, setEditCropId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch crops
  useEffect(() => {
    setLoading(true);
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const res = await getCropData();
    if (res) {
      console.log("getCropData ", res);

      setCropList(res.data);
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
      setCropList([]);
    }
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCropId) {
      const res = await editCropData(editCropId, newCrop);
      console.log("res edit ", res);
    } else {
      const res = await addCropData(newCrop);
      console.log("res add ", res);
    }
    fetchCrops();
    setIsDialogOpen(false);
    setNewCrop({ name: "", weeks: "" });
    setEditCropId(null);
  };

  // Handle edit
  const handleEdit = (crop) => {
    setNewCrop({ name: crop.name, weeks: crop.weeks });
    setEditCropId(crop._id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete this crop?",
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
              toast.update(toastId, {
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

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <div className="p-6 max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Crop List</h1>

          <button
            onClick={() => {
              setIsDialogOpen(true);
              setEditCropId(null);
              setNewCrop({ name: "", weeks: "" });
            }}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            + Add Crop
          </button>

          <ul className="space-y-3">
            {cropList.map((crop) => (
              <li key={crop._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <Link to={`/form1?name=${encodeURIComponent(crop.name)}&weeks=${crop.weeks}&id=${crop._id}`} className="flex-1 text-black no-underline hover:underline">
                  <strong>{crop.name}</strong> – {crop.weeks} weeks
                </Link>
                <button onClick={() => handleEdit(crop)} className="text-blue-500 hover:text-blue-700" title="Edit">
                  ✏️
                </button>
                <button onClick={() => handleDelete(crop._id)} className="text-red-500 hover:text-red-700">
                  🗑️
                </button>
              </li>
            ))}
          </ul>

          {/* Dialog Box */}
          {isDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-xl w-80">
                <h2 className="text-xl font-semibold mb-4">{editCropId ? "Edit Crop" : "Add New Crop"}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" placeholder="Crop Name" className="w-full border p-2 rounded" value={newCrop.name} onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })} required />
                  <input
                    type="number"
                    placeholder="Number of Weeks"
                    className="w-full border p-2 rounded"
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

                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsDialogOpen(false)} className="px-3 py-1 bg-gray-300 rounded">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
                      {editCropId ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
