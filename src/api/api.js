import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com"; // Replace with your API base URL

export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
