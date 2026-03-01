import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          🎓 Campus Pay
        </Link>
        
        {isAuthenticated && (
          <ul className="navbar-nav">
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            {user?.role === 'admin' && (
              <>
                <li>
                  <Link to="/admin/charges" className="nav-link">
                    Manage Charges
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className="nav-link">
                    Manage Users
                  </Link>
                </li>
              </>
            )}
            <li>
              <span className="nav-link">
                {user?.firstName} {user?.lastName}
                {user?.role === 'admin' && <span className="badge badge-info ml-2">Admin</span>}
              </span>
            </li>
            <li>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
