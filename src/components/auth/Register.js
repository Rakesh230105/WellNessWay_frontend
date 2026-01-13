import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'user',
    location: null
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [locStatus, setLocStatus] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setErrors({});
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // store as [lng, lat] for GeoJSON
        setFormData(prev => ({ ...prev, location: { coordinates: [longitude, latitude] } }));
        setLocStatus('Location captured');
      },
      (err) => {
        setLocStatus('Unable to retrieve location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setError(result.message || 'Registration failed');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join WellnessWay to access healthcare resources</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
            {Array.isArray(errors) && errors.find(e => e.param === 'name') && (
              <div className="form-error">{errors.find(e => e.param === 'name').msg}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            {Array.isArray(errors) && errors.find(e => e.param === 'email') && (
              <div className="form-error">{errors.find(e => e.param === 'email').msg}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password (min 6 characters)"
              minLength="6"
            />
            {Array.isArray(errors) && errors.find(e => e.param === 'password') && (
              <div className="form-error">{errors.find(e => e.param === 'password').msg}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Use my location</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" className="btn" onClick={handleUseLocation}>
                Capture My Location
              </button>
              <small style={{ color: '#666' }}>{locStatus || (formData.location ? 'Location set' : 'Not set')}</small>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Account Type *</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Regular User</option>
              <option value="medical_shop_owner">Medical Shop Owner</option>
              <option value="hospital_owner">Hospital Owner</option>
            </select>
            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
              {formData.role === 'medical_shop_owner' && 'You will be able to create and manage your medical shop'}
              {formData.role === 'hospital_owner' && 'You will be able to create and manage your hospital'}
              {formData.role === 'user' && 'Standard user account for browsing services'}
            </small>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

