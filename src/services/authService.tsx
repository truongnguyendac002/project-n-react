
import { LoginRequest } from '../payloads/request/loginRequest';
import { RegisterRequest } from '../payloads/request/registerRequest';
import { DataResponse } from '../payloads/response/dataResponse';
import axiosInstance from '../ultils/axiosInstance';

export const login = async (loginRequest: LoginRequest): Promise<DataResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', loginRequest);
    const data = response.data;
    if (data.respCode === "000") {
      localStorage.setItem('access-token', data.data.accessToken);
      localStorage.setItem('refresh-token', data.data.refreshToken);
    }
    return data;
  } catch (error) {
    throw new Error("Login failed. Please try again." + error);
  }
};

export const register = async (registerRequest: RegisterRequest): Promise<DataResponse> => {
  try {
    const response = await axiosInstance.post('/auth/register', registerRequest);
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error("Register failed. Please try again." + error);
  }
}

export const fetchUserInfo = async (): Promise<DataResponse> => {
  try {
    const response = await axiosInstance.get('/auth/info');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user info' + error);
  }
};

