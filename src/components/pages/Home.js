import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to WellnessWay</h1>
          <p className="hero-subtitle">Your comprehensive healthcare assistance platform</p>
          <p className="hero-description">
            Find nearby medical shops and hospitals, check medicine availability, and access healthcare resources all in one place.
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-primary btn-large">
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Geolocation Services</h3>
              <p>Find nearby medical shops and hospitals based on your location with interactive maps.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Medical Shop Listings</h3>
              <p>Browse available medicines, check prices, stock availability, and read user reviews.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Hospital Information</h3>
              <p>Access detailed information about doctors, medical tests, and services offered by hospitals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Chatbot</h3>
              <p>
                Intelligent chatbot that analyzes your symptoms using machine learning algorithms, 
                offers insights into possible health conditions, and suggests remedies and precautions. 
                <strong> Note: Not a substitute for professional medical advice.</strong>
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your health data is protected with industry-standard security measures and encryption.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Access WellnessWay from any device - desktop, tablet, or mobile - with a seamless experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>Sign up in seconds and create your personalized healthcare profile to get started.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Search & Discover</h3>
                <p>Use our powerful search tools to find nearby medical shops, hospitals, and medicines.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get AI Assistance</h3>
                <p>Consult our AI chatbot for preliminary health insights and recommendations.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Access Healthcare</h3>
                <p>Connect with healthcare providers and access the services you need, all in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-overview">
        <div className="container">
          <div className="services-content">
            <div className="services-text">
              <h2 className="services-title">Comprehensive Healthcare at Your Fingertips</h2>
              <p className="services-description">
                WellnessWay brings together all your healthcare needs in one convenient platform. 
                From finding the nearest pharmacy to locating specialized hospitals, we make 
                healthcare accessible and efficient.
              </p>
              <ul className="services-list">
                <li>
                  <span className="check-icon">✓</span>
                  Real-time medicine availability tracking
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Verified hospital and doctor information
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Price comparison across multiple shops
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  24/7 AI-powered health assistance
                </li>
              </ul>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-primary btn-large">
                  Start Your Journey
                </Link>
              )}
            </div>
            <div className="services-image">
              <div className="image-placeholder">
                <div className="placeholder-icon">🏥</div>
                <p>Healthcare Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Healthcare Experience?</h2>
            <p className="cta-description">
              Join thousands of users who trust WellnessWay for their healthcare needs
            </p>
            {!isAuthenticated && (
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-primary btn-large">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="disclaimer">
        <div className="container">
          <div className="disclaimer-content">
            <h3>⚠️ Important Disclaimer</h3>
            <p>
              WellnessWay provides preliminary health information and should not be used as a substitute 
              for professional medical advice, diagnosis, or treatment. Always seek the advice of your 
              physician or other qualified health provider with any questions you may have regarding a 
              medical condition. Never disregard professional medical advice or delay in seeking it because 
              of something you have read on this platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;