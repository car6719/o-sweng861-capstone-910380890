import React, { useState, useEffect } from 'react';
import { chargesService, usersService } from '../services';

const ManageCharges: React.FC = () => {
  const [charges, setCharges] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    description: '',
    category: 'Tuition',
    semester: 'Spring 2026',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [chargesData, usersData] = await Promise.all([
        chargesService.getCharges(),
        usersService.getAllUsers()
      ]);
      setCharges(chargesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await chargesService.createCharge({
        userId: parseInt(formData.userId),
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        semester: formData.semester,
        dueDate: formData.dueDate
      });
      
      setShowForm(false);
      setFormData({
        userId: '',
        amount: '',
        description: '',
        category: 'Tuition',
        semester: 'Spring 2026',
        dueDate: ''
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create charge');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this charge?')) {
      return;
    }

    try {
      await chargesService.deleteCharge(id);
      loadData();
    } catch (error) {
      alert('Failed to delete charge');
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
      <div className="flex-between mb-4">
        <h1>Manage Charges</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Add New Charge'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <h2 className="card-header">Create New Charge</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student</label>
              <select
                className="form-select"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
              >
                <option value="">Select a student</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.studentId})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Tuition">Tuition</option>
                <option value="Dining">Dining</option>
                <option value="Lab Fees">Lab Fees</option>
                <option value="Housing">Housing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Semester</label>
              <input
                type="text"
                className="form-control"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Charge
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-header">All Charges</h2>
        {charges.length === 0 ? (
          <p className="text-secondary">No charges found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Semester</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {charges.map(charge => {
                const student = users.find(u => u.id === charge.userId);
                return (
                  <tr key={charge.id}>
                    <td>{student?.studentId || 'N/A'}</td>
                    <td>{charge.description}</td>
                    <td>{charge.category}</td>
                    <td>{charge.semester}</td>
                    <td>${charge.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${charge.isPaid ? 'success' : 'warning'}`}>
                        {charge.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      {!charge.isPaid && (
                        <button
                          onClick={() => handleDelete(charge.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCharges;
