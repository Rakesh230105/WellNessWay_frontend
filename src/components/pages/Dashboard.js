import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(coords);
        },
        (error) => {
          setLocationError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">Welcome back, {user?.name}!</p>

        {locationError && (
          <div className="alert alert-info">
            {locationError}
            <button onClick={getCurrentLocation} className="btn btn-outline" style={{ marginLeft: '10px' }}>
              Try Again
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <Link to="/medical-shops" className="dashboard-card">
            <div className="card-icon">💊</div>
            <h3>Medical Shops</h3>
            <p>Find nearby medical shops and check medicine availability</p>
            {location && (
              <span className="location-badge">📍 Location enabled</span>
            )}
          </Link>

          <Link to="/hospitals" className="dashboard-card">
            <div className="card-icon">🏥</div>
            <h3>Hospitals</h3>
            <p>Browse hospitals, doctors, and available services</p>
            {location && (
              <span className="location-badge">📍 Location enabled</span>
            )}
          </Link>

          
        </div>

        {(user?.role === 'medical_shop_owner' || user?.role === 'hospital_owner') && (
          <div className="dashboard-card" style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link to="/owner-dashboard" className="btn btn-primary btn-large">
              Manage My {user?.role === 'medical_shop_owner' ? 'Medical Shop' : 'Hospital'}
            </Link>
          </div>
        )}

        <div className="dashboard-info">
          <div className="info-card">
            <h3>Your Information</h3>
            <div className="info-item">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="info-item">
              <strong>Role:</strong> {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            {user?.phone && (
              <div className="info-item">
                <strong>Phone:</strong> {user.phone}
              </div>
            )}
            {user?.address && (
              <div className="info-item">
                <strong>Address:</strong> {user.address}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

