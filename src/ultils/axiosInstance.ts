import axios from 'axios';
// import { DataResponse } from '../payloads/response/dataResponse';
const backendURL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: backendURL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // const data: DataResponse = {
    //   respCode: response.data.respCode,
    //   respDesc: response.data.respDesc,
    //   data: response.data.data,
    // };
    return response;
  },
  (error) => {
    return Promise.reject(error); 
  }
);


export default axiosInstance;
