import bcrypt from 'bcryptjs';
import { User, Charge, Payment } from '../types';

// In-memory database
class InMemoryDatabase {
  private users: Map<number, User> = new Map();
  private charges: Map<number, Charge> = new Map();
  private payments: Map<number, Payment> = new Map();
  private userIdCounter = 1;
  private chargeIdCounter = 1;
  private paymentIdCounter = 1;

  // User operations
  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getUserById(id: number): User | undefined {
    return this.users.get(id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: this.userIdCounter++,
      createdAt: new Date().toISOString()
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  updateUserHold(userId: number, hasHold: boolean): void {
    const user = this.users.get(userId);
    if (user) {
      user.hasHold = hasHold;
      this.users.set(userId, user);
    }
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).filter(u => u.role === 'student');
  }

  // Charge operations
  getChargeById(id: number): Charge | undefined {
    return this.charges.get(id);
  }

  getChargesByUserId(userId: number): Charge[] {
    return Array.from(this.charges.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  getAllCharges(): Charge[] {
    return Array.from(this.charges.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createCharge(charge: Omit<Charge, 'id' | 'createdAt'>): Charge {
    const newCharge: Charge = {
      ...charge,
      id: this.chargeIdCounter++,
      createdAt: new Date().toISOString()
    };
    this.charges.set(newCharge.id, newCharge);
    return newCharge;
  }

  markChargeAsPaid(id: number): void {
    const charge = this.charges.get(id);
    if (charge) {
      charge.isPaid = true;
      this.charges.set(id, charge);
    }
  }

  deleteCharge(id: number): void {
    this.charges.delete(id);
  }

  getBalance(userId: number): number {
    return Array.from(this.charges.values())
      .filter(c => c.userId === userId && !c.isPaid)
      .reduce((sum, c) => sum + c.amount, 0);
  }

  // Payment operations
  getPaymentById(id: number): Payment | undefined {
    return this.payments.get(id);
  }

  getPaymentsByUserId(userId: number): Payment[] {
    return Array.from(this.payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllPayments(): Payment[] {
    return Array.from(this.payments.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Payment {
    const newPayment: Payment = {
      ...payment,
      id: this.paymentIdCounter++,
      createdAt: new Date().toISOString()
    };
    this.payments.set(newPayment.id, newPayment);
    return newPayment;
  }

  updatePaymentStatus(id: number, status: 'pending' | 'completed' | 'failed'): void {
    const payment = this.payments.get(id);
    if (payment) {
      payment.status = status;
      this.payments.set(id, payment);
    }
  }
}

const db = new InMemoryDatabase();

// Initialize database with default users
export const initDatabase = () => {
  // Check if users already exist
  if (db.getAllUsers().length === 0) {
    const hashedStudentPassword = bcrypt.hashSync('student123', 10);
    const hashedAdminPassword = bcrypt.hashSync('admin123', 10);

    db.createUser({
      email: 'student@campus.edu',
      password: hashedStudentPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'student',
      studentId: 'STU001',
      hasHold: false
    });

    db.createUser({
      email: 'admin@campus.edu',
      password: hashedAdminPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'admin',
      hasHold: false
    });

    console.log('✓ Database initialized');
    console.log('  Student: student@campus.edu / student123');
    console.log('  Admin: admin@campus.edu / admin123');
  }
};

export default db;
