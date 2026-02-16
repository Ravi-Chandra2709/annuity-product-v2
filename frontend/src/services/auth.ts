import api from './api';

export interface LoginCredentials {
  username: string;  // email for OAuth2 form
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
  company_name?: string;
  role?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const { data } = await api.post<TokenResponse>('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  },

  register: async (registerData: RegisterData) => {
    const { data } = await api.post('/api/auth/register', registerData);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/api/auth/me');
    return data;
  },
};
