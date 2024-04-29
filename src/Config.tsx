import axios from "axios";

// const baseURL = "http://localhost:8000";
const baseURL = "https://clipboard-backend-6x5c.onrender.com";

const getData = async (url: string, customHeaders = {}) => {
  const headers = {
    ...customHeaders,
  };
  const response = await axios.get(`${baseURL}/${url}`, { headers: headers });
  return response.data;
};

const postData = async (url: string, body: any, options:any) => {
  
  const response = await axios.post(`${baseURL}/${url}`, body, options);
  return response.data;
};

export { getData, postData };
