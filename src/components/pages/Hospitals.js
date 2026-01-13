import React, { useState, useEffect } from 'react';
import { hospitalsAPI } from '../../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './Hospitals.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10); // km

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyHospitals();
    } else {
      fetchAllHospitals();
    }
  }, [location, maxDistance]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          fetchAllHospitals();
        }
      );
    } else {
      fetchAllHospitals();
    }
  };

  const fetchNearbyHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalsAPI.getNearby(
        location.latitude,
        location.longitude,
        maxDistance * 1000 // convert to meters
      );
      setHospitals(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch nearby hospitals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalsAPI.getAll();
      setHospitals(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hospitals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals;

  return (
    <div className="hospitals">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Hospitals</h1>
          <p className="page-subtitle">Find the best healthcare facilities near you</p>
        </div>
        
        <div className="hospitals-controls">
          <div className="controls-left">
            {location && (
              <div className="control-group">
                <label className="control-label">
                  <span className="label-icon">📍</span>
                  Search within:
                </label>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="distance-select"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>
            )}
          </div>
          
          <button onClick={getCurrentLocation} className="btn-refresh">
            <span className="refresh-icon">🔄</span>
            Refresh Location
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="hospitals-layout">
          <div className="hospitals-list-container">
            <div className="list-header">
              <h2 className="list-title">Available Hospitals</h2>
              <span className="results-count">{filteredHospitals.length} Results</span>
            </div>
            
            <div className="hospitals-list">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">Loading hospitals...</p>
                </div>
              ) : filteredHospitals.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏥</div>
                  <h3>No Hospitals Found</h3>
                  <p>Try adjusting your search filters or refresh your location.</p>
                </div>
              ) : (
                filteredHospitals.map((hospital) => (
                  <div
                    key={hospital._id}
                    className={`hospital-card ${selectedHospital?._id === hospital._id ? 'selected' : ''}`}
                    onClick={() => setSelectedHospital(hospital)}
                  >
                    <div className="card-header">
                      <h3 className="hospital-name">{hospital.name}</h3>
                      {hospital.emergencyServices && (
                        <span className="emergency-badge">
                          <span className="badge-icon">🚨</span>
                          Emergency
                        </span>
                      )}
                    </div>
                    
                    <p className="hospital-type">
                      <span className="info-icon">🏥</span>
                      {hospital.type}
                    </p>
                    
                    <p className="hospital-address">
                      <span className="info-icon">📍</span>
                      {hospital.address}
                    </p>
                    
                    {hospital.phone && (
                      <p className="hospital-phone">
                        <span className="info-icon">📞</span>
                        {hospital.phone}
                      </p>
                    )}
                    
                    <div className="card-footer">
                      {hospital.doctors && hospital.doctors.length > 0 && (
                        <span className="info-badge">
                          <span className="badge-icon-small">👨‍⚕️</span>
                          {hospital.doctors.length} Doctor{hospital.doctors.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {hospital.bedsAvailable > 0 && (
                        <span className="info-badge">
                          <span className="badge-icon-small">🛏️</span>
                          {hospital.bedsAvailable} Beds
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="hospital-details">
            {selectedHospital ? (
              <div className="details-card">
                <div className="details-header">
                  <h2 className="details-title">{selectedHospital.name}</h2>
                  {selectedHospital.emergencyServices && (
                    <span className="emergency-badge-large">
                      <span className="badge-icon">🚨</span>
                      Emergency Services
                    </span>
                  )}
                </div>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{selectedHospital.type}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{selectedHospital.address}</span>
                  </div>
                  
                  {selectedHospital.phone && (
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <a href={`tel:${selectedHospital.phone}`} className="detail-value phone-link">
                        {selectedHospital.phone}
                      </a>
                    </div>
                  )}
                  
                  {selectedHospital.email && (
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <a href={`mailto:${selectedHospital.email}`} className="detail-value email-link">
                        {selectedHospital.email}
                      </a>
                    </div>
                  )}
                  
                  {selectedHospital.openingHours && (
                    <div className="detail-item">
                      <span className="detail-label">Opening Hours</span>
                      <span className="detail-value">{selectedHospital.openingHours}</span>
                    </div>
                  )}
                  
                  {selectedHospital.bedsAvailable > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Beds Available</span>
                      <span className="detail-value beds-available">{selectedHospital.bedsAvailable}</span>
                    </div>
                  )}
                </div>

                {selectedHospital.doctors && selectedHospital.doctors.length > 0 && (
                  <div className="section-container">
                    <h3 className="section-title">
                      <span className="section-icon">👨‍⚕️</span>
                      Doctors
                    </h3>
                    <div className="items-grid">
                      {selectedHospital.doctors.map((doctor, index) => (
                        <div key={index} className="doctor-card">
                          <div className="doctor-header">
                            <div className="doctor-avatar">
                              {doctor.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="doctor-info">
                              <h4 className="doctor-name">{doctor.name}</h4>
                              <p className="doctor-specialization">{doctor.specialization}</p>
                            </div>
                          </div>
                          
                          {doctor.qualification && (
                            <div className="doctor-detail">
                              <span className="detail-icon">🎓</span>
                              {doctor.qualification}
                            </div>
                          )}
                          
                          {doctor.experience && (
                            <div className="doctor-detail">
                              <span className="detail-icon">💼</span>
                              {doctor.experience} years of experience
                            </div>
                          )}
                          
                          {doctor.consultationFee && (
                            <div className="doctor-fee-container">
                              <span className="fee-label">Consultation Fee</span>
                              <span className="fee-value">₹{doctor.consultationFee}</span>
                            </div>
                          )}
                          
                          {doctor.availability && (
                            <div className="doctor-availability">
                              <span className="detail-icon">🕒</span>
                              {doctor.availability}
                            </div>
                          )}
                          
                          <div className={`doctor-status ${doctor.isAvailable ? 'available' : 'unavailable'}`}>
                            <span className="status-dot"></span>
                            {doctor.isAvailable ? 'Available' : 'Unavailable'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHospital.tests && selectedHospital.tests.length > 0 && (
                  <div className="section-container">
                    <h3 className="section-title">
                      <span className="section-icon">🧪</span>
                      Medical Tests
                    </h3>
                    <div className="items-grid">
                      {selectedHospital.tests.map((test, index) => (
                        <div key={index} className="test-card">
                          <h4 className="test-name">{test.name}</h4>
                          {test.description && (
                            <p className="test-description">{test.description}</p>
                          )}
                          <div className="test-footer">
                            <span className="test-price">₹{test.price}</span>
                            {test.duration && (
                              <span className="test-duration">
                                <span className="duration-icon">⏱️</span>
                                {test.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHospital.services && selectedHospital.services.length > 0 && (
                  <div className="section-container">
                    <h3 className="section-title">
                      <span className="section-icon">⚕️</span>
                      Services
                    </h3>
                    <div className="services-grid">
                      {selectedHospital.services.map((service, index) => (
                        <div key={index} className="service-card">
                          <div className="service-icon-container">
                            <span className="service-icon">✓</span>
                          </div>
                          <div className="service-content">
                            <h4 className="service-name">{service.name}</h4>
                            {service.description && (
                              <p className="service-description">{service.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="details-placeholder">
                <div className="placeholder-icon">🏥</div>
                <h3 className="placeholder-title">Select a Hospital</h3>
                <p className="placeholder-text">Click on any hospital from the list to view detailed information</p>
              </div>
            )}
          </div>
        </div>

        {hospitals.length > 0 && (
          <div className="map-section">
            <div className="map-header">
              <h2 className="map-title">
                <span className="map-icon">🗺️</span>
                Map View
              </h2>
              <p className="map-description">Click on any marker to view hospital details</p>
            </div>
            <div className="map-container">
              <MapContainer
                center={
                  location
                    ? [location.latitude, location.longitude]
                    : [hospitals[0].location.coordinates[1], hospitals[0].location.coordinates[0]]
                }
                zoom={location ? 13 : 10}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hospitals.map((hospital) => {
                  const coords = hospital.location?.coordinates || [];
                  const position = [coords[1], coords[0]]; // [lat, lng]
                  return (
                    <Marker
                      key={hospital._id}
                      position={position}
                      eventHandlers={{
                        click: () => {
                          setSelectedHospital(hospital);
                        }
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: '150px' }}>
                          <strong>{hospital.name}</strong>
                          <div style={{ fontSize: '0.9rem' }}>{hospital.address}</div>
                          <div style={{ marginTop: '8px' }}>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}&travelmode=driving`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Navigate with Google Maps
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;