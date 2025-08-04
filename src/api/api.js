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
    return error;
  }
};

// QUOTATION APIS
export const createQuotation = async (quotationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/crop/quotations`, quotationData);
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

export const getAllQuotations = async () => {
  const res = await fetch(`${BASE_URL}/crop/quotations`);
  if (!res.ok) throw new Error("Failed to fetch quotations");
  return res.json();
};

export const getQuotationById = async (id) => {
  const res = await fetch(`${BASE_URL}/quotations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quotation");
  return res.json();
};

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
    const quotationRes = await axios.get(`${BASE_URL}/quotations/${quotationId}`);
    const quotation = quotationRes.data;

    // Step 2: Get 1-acre schedule
    const scheduleData = await getSchedulesByCropId(quotation.cropId);
    console.log("scheduleData ", scheduleData);

    // Step 3: Multiply schedule data for total acres
    const generateBillData = (scheduleData, acres) => {
      return scheduleData.map((item) => {
        const totalML = Number(item.totalML || 0) * acres;
        const totalCost = Number(item.totalCost || 0) * acres;
        return {
          productName: item.productName,
          times: item.times,
          totalML,
          ratePerML: item.ratePerML,
          totalCost,
        };
      });
    };

    const multipliedSchedule = generateBillData(scheduleData, totalAcres);

    // Step 4: Calculate total cost
    const totalCost = multipliedSchedule.reduce((acc, cur) => acc + cur.totalCost, 0);

    // Step 5: Prepare bill object
    const billPayload = {
      quotationId,
      cropId: quotation.cropId,
      totalAcres,
      totalPlants: quotation.totalPlants || 1000,
      farmerInfo: quotation.farmerInfo,
      schedule: multipliedSchedule,
      totalCost,
    };

    // Step 6: Save to MongoDB
    const saveRes = await axios.post(`${BASE_URL}/quotationbills/create`, billPayload);
    return saveRes.data._id;
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
