import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container" style={{ marginTop: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🎓 Campus Pay
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          A Smart Wallet for Student Payments
        </p>
        
        <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h2 className="card-header">Welcome to Campus Pay</h2>
          <p>
            Campus Pay is a unified, secure, and intuitive digital wallet that streamlines payment 
            processing for university students and administrators.
          </p>
          
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Features:</h3>
          <ul style={{ lineHeight: '2' }}>
            <li>📊 View all your charges in one place</li>
            <li>💳 Make secure payments with Stripe</li>
            <li>📜 Track payment history</li>
            <li>🔒 Role-based access for students and administrators</li>
            <li>⚡ Real-time balance updates</li>
            <li>🎯 Automatic hold management</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
            Login
          </Link>
          <Link to="/register" className="btn btn-outline" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
            Register
          </Link>
        </div>

        <div className="alert alert-info" style={{ marginTop: '2rem', textAlign: 'left' }}>
          <strong>Demo Accounts:</strong><br />
          <strong>Student:</strong> student@campus.edu / student123<br />
          <strong>Bursar Admin:</strong> admin@campus.edu / admin123
        </div>
      </div>
    </div>
  );
};

export default Home;
