
import { IUserProfile } from '../models/User';
import { LoginRequest } from '../payloads/request/loginRequest';
import { RegisterRequest } from '../payloads/request/registerRequest';
import { DataResponse } from '../payloads/response/dataResponse';
import axiosInstance from '../ultils/axiosInstance';

export const login = async (loginRequest: LoginRequest): Promise<DataResponse<string>> => {
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

export const googleLogin = async (googleToken: string): Promise<DataResponse<string>> => {
  try {
    const response = await axiosInstance.post('/auth/google/login', { googleToken: googleToken });
    const data = response.data;
    if (data.respCode === "000") {
      localStorage.setItem('access-token', data.data.accessToken);
      localStorage.setItem('refresh-token', data.data.refreshToken);
    }
    return data;
  } catch (error) {
    throw new Error("Google login failed. Please try again." + error);
  }
};

export const googleRegister = async (googleToken: string): Promise<DataResponse<string>> => {
  try {
    const response = await axiosInstance.post('/auth/google/register', { googleToken: googleToken });
    return response.data;
  } catch (error) {
    throw new Error("Google login failed. Please try again." + error);
  }
};

export const register = async (registerRequest: RegisterRequest): Promise<DataResponse<IUserProfile>> => {
  try {
    const response = await axiosInstance.post('/auth/register', registerRequest);
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error("Register failed. Please try again." + error);
  }
}

export const fetchUserInfo = async (): Promise<DataResponse<IUserProfile>> => {
  try {
    const response = await axiosInstance.get('/auth/info');
    console.log("user fet:",response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user info' + error);
  }
};

