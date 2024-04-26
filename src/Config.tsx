import axios from "axios";

const baseURL = "http://localhost:8000";

const getData = async (url: string, customHeaders = {}) => {
  const headers = {
    ...customHeaders,
  };
  const response = await axios.get(`${baseURL}/${url}`, { headers: headers });
  return response.data;
};

const postData = async (url: string, body: any) => {
  const response = await axios.post(`${baseURL}/${url}`, body);
  return response.data;
};

export { getData, postData };
