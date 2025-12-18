import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../../store/hooks';
import { clearError } from '../store/authSlice';
import { AuthService } from '../services/auth.service';
import type { AuthResponse, LoginCredentials } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';



export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['auth', 'login'],
    
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await AuthService.login(credentials);
      return response;
    },
    
    onMutate: () => {
      dispatch(clearError());
    },
    
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      dispatch({
        type: 'auth/loginFulfilled',
        payload: {
          user: data.user,
          token: data.token,
        },
      });
      navigate('/dashboard');
    },
    
    onError: (error: Error) => {
      dispatch({
        type: 'auth/loginRejected',
        payload: error.message,
      });
      
    },
  });
};


export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
    const navigate = useNavigate();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    
    mutationFn: async () => {
      await AuthService.logout();
    },
    
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      dispatch({
        type: 'auth/logoutFulfilled',
      });
      navigate('/login');
      queryClient.clear();
      
    },
  });
};


export const useValidateSessionMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'validateSession'],
    
    mutationFn: async (token: string) => {
      if (!token) throw new Error('No token found');
      const user = await AuthService.validateSession(token);
      return { user, token };
    },
    
    onSuccess: (data: AuthResponse) => {
      dispatch({
        type: 'auth/validateSessionFulfilled',
        payload: {
          user: data.user,
          token: data.token,
        },
      });
      
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    
    onError: (error: Error) => {
      dispatch({
        type: 'auth/validateSessionRejected',
      });
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      console.error('Session validation failed:', error.message);
    },
  });
};
