import { api } from "./api";
import { AxiosResponse } from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}



export const login = async (credentials: LoginRequest): Promise<AxiosResponse> => {
  try {
    // No need to fetch CSRF token before login
    const response = await api.post("/login", credentials);
    return response;
  } catch (error) {
    throw error;
  }
};