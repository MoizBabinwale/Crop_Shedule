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

    if (res.status === 201 || res.status === 200) {
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
    return res;
  } catch (error) {
    console.error("Error ", error);
    return error;
  }
};

// QUOTATION APIS
export const createQuotation = async (quotationData) => {
  try {
    console.log("quotationData ", quotationData);

    const response = await axios.post(`${BASE_URL}/quotations`, quotationData);
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

export const getAllQuotations = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/quotations`);

    return res.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

export const getQuotationById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/quotations/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

export const updateQuotation = async (id, data) => {
  const res = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quotation");
  return res.json();
};

export const deleteQuotation = async (id) => {
  const res = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};
export const getScheduleBillByScheduleId = async (scheduleId) => {
  try {
    const res = await axios.get(`${BASE_URL}/schedulebill/${scheduleId}`);
    console.log("bills ", res);

    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) return null;
    console.error("Error fetching schedule bill:", error);
    throw error;
  }
};

export const createScheduleBill = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}/schedulebill`, payload);
    return res;
  } catch (error) {
    console.error("Error creating schedule bill:", error);
    throw error;
  }
};
export const createQuotationBill = async (quotationId, totalAcres) => {
  try {
    // Step 1: Fetch Quotation (you might already have it in frontend, or fetch if needed)
    const quotationBillRes = await axios.post(`${BASE_URL}/quotationbills/${quotationId}/${totalAcres}`);
    console.log("quotationbills ", quotationBillRes.data);
    return quotationBillRes.data;
  } catch (error) {
    console.error("Error generating quotation bill:", error);
    throw error;
  }
};

export const getQuotationBillById = async (billId) => {
  try {
    const res = await axios.get(`${BASE_URL}/quotationbills/${billId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting bill:", error);
    throw error;
  }
};
export const getScheduleById = async (scheduleId) => {
  try {
    const res = await axios.get(`${BASE_URL}/schedule/${scheduleId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting schedule:", error);
    throw error;
  }
};
