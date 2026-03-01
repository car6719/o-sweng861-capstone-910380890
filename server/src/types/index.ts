export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  studentId?: string;
  hasHold: boolean;
  createdAt: string;
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

export interface AuthRequest extends Express.Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}
