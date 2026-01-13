import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const id = 'messenger-widget-b';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://cdn.jotfor.ms/agent/embedjs/019ba708cc0c7599af4d1256b863079b8729/embed.js';
      s.defer = true;
      s.textContent = '695ce7bfbdb6af04d6672deb,695ce76e46eb2ec3d0a95f46';
      document.body.appendChild(s);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.3"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="9" r="2" fill="currentColor"/>
          </svg>
          <span className="brand-text">WellnessWay</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              {(user?.role === 'medical_shop_owner' || user?.role === 'hospital_owner') && (
                <Link to="/owner-dashboard" className="navbar-link">Owner Panel</Link>
              )}
              <Link to="/medical-shops" className="navbar-link">Medical Shops</Link>
              <Link to="/hospitals" className="navbar-link">Hospitals</Link>
              <div className="navbar-user">
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;