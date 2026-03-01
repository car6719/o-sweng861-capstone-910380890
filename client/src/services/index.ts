import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'admin';
    studentId?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const chargesService = {
  getCharges: async () => {
    const response = await api.get('/charges');
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get('/charges/balance');
    return response.data;
  },

  createCharge: async (data: any) => {
    const response = await api.post('/charges', data);
    return response.data;
  },

  deleteCharge: async (id: number) => {
    const response = await api.delete(`/charges/${id}`);
    return response.data;
  }
};

export const paymentsService = {
  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  createPaymentIntent: async (amount: number, chargeIds?: number[]) => {
    const response = await api.post('/payments/create-intent', { amount, chargeIds });
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string, chargeIds?: number[]) => {
    const response = await api.post('/payments/confirm', { paymentIntentId, chargeIds });
    return response.data;
  }
};

export const usersService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  updateHold: async (userId: number, hasHold: boolean) => {
    const response = await api.put(`/users/holds/${userId}`, { hasHold });
    return response.data;
  }
};
