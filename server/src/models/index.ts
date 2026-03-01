import db from '../database/db';
import { User, Charge, Payment } from '../types';

export class UserModel {
  static findByEmail(email: string): User | undefined {
    return db.getUserByEmail(email);
  }

  static findById(id: number): User | undefined {
    return db.getUserById(id);
  }

  static create(user: Omit<User, 'id' | 'createdAt'>): User {
    return db.createUser(user);
  }

  static updateHold(userId: number, hasHold: boolean): void {
    db.updateUserHold(userId, hasHold);
  }

  static getAll(): User[] {
    return db.getAllUsers();
  }
}

export class ChargeModel {
  static findById(id: number): Charge | undefined {
    return db.getChargeById(id);
  }

  static findByUserId(userId: number): Charge[] {
    return db.getChargesByUserId(userId);
  }

  static findAll(): Charge[] {
    return db.getAllCharges();
  }

  static create(charge: Omit<Charge, 'id' | 'createdAt'>): Charge {
    return db.createCharge(charge);
  }

  static markAsPaid(id: number): void {
    db.markChargeAsPaid(id);
  }

  static delete(id: number): void {
    db.deleteCharge(id);
  }

  static getBalance(userId: number): number {
    return db.getBalance(userId);
  }
}

export class PaymentModel {
  static findById(id: number): Payment | undefined {
    return db.getPaymentById(id);
  }

  static findByUserId(userId: number): Payment[] {
    return db.getPaymentsByUserId(userId);
  }

  static findAll(): Payment[] {
    return db.getAllPayments();
  }

  static create(payment: Omit<Payment, 'id' | 'createdAt'>): Payment {
    return db.createPayment(payment);
  }

  static updateStatus(id: number, status: 'pending' | 'completed' | 'failed'): void {
    db.updatePaymentStatus(id, status);
  }
}
