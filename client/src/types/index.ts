export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  studentId?: string;
  hasHold: boolean;
}

export interface Charge {
  id: number;
  userId: number;
  amount: number;
  description: string;
  category: string;
  semester: string;
  dueDate: string;
  isPaid: boolean;
  createdAt: string;
}

export interface Payment {
  id: number;
  userId: number;
  chargeId?: number;
  amount: number;
  stripePaymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
