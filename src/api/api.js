import axios from "axios";

// const BASE_URL = "http://localhost:5000/api"; // Replace with your API base URL
const BASE_URL = "https://crop-shedule-server.vercel.app/api"; // Replace with your API base URL

export const getCropData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/crop`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
// Function to get crop by ID
export const getCropById = async (cropId) => {
  try {
    const res = await axios.get(`${BASE_URL}/crop/${cropId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching crop by ID:", err);
    throw err;
  }
};

export const submitData = async (cropId, shedule) => {
  try {
    const res = await axios.post(`${BASE_URL}/schedule/create/${cropId}`, shedule);
    console.log("res ", res);

    if (res.status === 201) {
      return res.data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return error;
  }
};
export const editCropData = async (editCropId, newCrop) => {
  try {
    const res = await axios.put(`${BASE_URL}/crop/${editCropId}`, newCrop);

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export const addCropData = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/crop/add`, data);

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export const deleteCropById = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/crop/${id}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getProductList = async () => {
  const res = await axios.get(`${BASE_URL}/products`);
  if (res) {
    return res.data;
  }
};

export const addProduct = async (data) => {
  const res = await axios.post(`${BASE_URL}/products`, data);
  return res.data;
};

export const updateProductById = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/products/${id}`, data);
  return res.data;
};

export const deleteProductById = async (id) => {
  const res = await axios.delete(`${BASE_URL}/products/${id}`);
  return res.data;
};

export const getSchedulesByCropId = async (cropId) => {
  try {
    const res = await axios.get(`${BASE_URL}/schedule/get/${cropId}`);
    if (res) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

export const createQuotation = async (quotationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/crop/quotations`, quotationData);
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

// const BASE_URL = "http://localhost:5000"; // Change if your server runs on a different port

export const getAllQuotations = async () => {
  const res = await fetch(`${BASE_URL}/crop/quotations`);
  if (!res.ok) throw new Error("Failed to fetch quotations");
  return res.json();
};

export const getQuotationById = async (id) => {
  const res = await fetch(`${BASE_URL}/crop/quotations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quotation");
  return res.json();
};

// export const createQuotation = async (data) => {
//   const res = await fetch(`${BASE_URL}/crop/quotations`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error("Failed to create quotation");
//   return res.json();
// };

export const updateQuotation = async (id, data) => {
  const res = await fetch(`${BASE_URL}/crop/quotations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quotation");
  return res.json();
};

export const deleteQuotation = async (id) => {
  const res = await fetch(`${BASE_URL}/crop/quotations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};
