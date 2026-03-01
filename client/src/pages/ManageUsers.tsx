import React, { useState, useEffect } from 'react';
import { usersService, chargesService } from '../services';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await usersService.getAllUsers();
      
      // Get balances for each user
      const usersWithBalance = await Promise.all(
        usersData.map(async (user: any) => {
          try {
            const charges = await chargesService.getCharges();
            const userCharges = charges.filter((c: any) => c.userId === user.id);
            const balance = userCharges
              .filter((c: any) => !c.isPaid)
              .reduce((sum: number, c: any) => sum + c.amount, 0);
            return { ...user, balance };
          } catch {
            return { ...user, balance: 0 };
          }
        })
      );
      
      setUsers(usersWithBalance);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHold = async (userId: number, currentHold: boolean) => {
    try {
      await usersService.updateHold(userId, !currentHold);
      loadUsers();
    } catch (error) {
      alert('Failed to update hold status');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 className="mb-4">Manage Students</h1>

      <div className="card">
        <h2 className="card-header">All Students</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Hold Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.studentId}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td style={{ fontWeight: 'bold', color: user.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  ${user.balance.toFixed(2)}
                </td>
                <td>
                  <span className={`badge badge-${user.hasHold ? 'danger' : 'success'}`}>
                    {user.hasHold ? 'Hold Active' : 'No Hold'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleHold(user.id, user.hasHold)}
                    className={`btn ${user.hasHold ? 'btn-primary' : 'btn-danger'}`}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                  >
                    {user.hasHold ? 'Remove Hold' : 'Add Hold'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
