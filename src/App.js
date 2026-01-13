import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MedicalShops from './components/pages/MedicalShops';
import Hospitals from './components/pages/Hospitals';
import Dashboard from './components/pages/Dashboard';
import OwnerDashboard from './components/pages/OwnerDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/medical-shops"
              element={
                <PrivateRoute>
                  <MedicalShops />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospitals"
              element={
                <PrivateRoute>
                  <Hospitals />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/owner-dashboard"
              element={
                <PrivateRoute>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

