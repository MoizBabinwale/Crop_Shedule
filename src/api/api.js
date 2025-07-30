import axios from "axios";

// const BASE_URL = "https://jsonplaceholder.typicode.com"; // Replace with your API base URL
const BASE_URL = "https://crop-shedule-server.vercel.app/api/schedule"; // Replace with your API base URL

export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export const submitData = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/create`, data);

    alert("Schedule entry submitted successfully!");

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
