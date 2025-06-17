import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const getBlogListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "blog/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addBlogServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "blog/create",
      formData,
      getConfig()
    );
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteBlogServ = async (id) => {
  try {
    const response = await axios.delete(
      BASE_URL + "blog/delete/" + id,
      getConfig()
    );
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateBlogServ = async (formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "blog/update",
      formData,
      getConfig()
    );
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getBlogDetailsServ = async (id) => {
  try {
    const response = await axios.get(
      BASE_URL + "blog/details/"+ id,
      
    );
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
