import apiClient from '../../../shared/config/apiClient';
import type { LoginCredentials, AuthResponse, User } from '../types/auth.types';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    return response.data['resp'];
  }

  static async logout(): Promise<void> {
    await apiClient.post('/logout');
  }

  static async validateSession(token: string): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.user;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data.user;
  }
}
