import React, { useState, useEffect } from "react";
import { medicalShopsAPI } from "../../utils/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./MedicalShops.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MedicalShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyShops();
    } else {
      fetchAllShops();
    }
  }, [location, maxDistance]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          fetchAllShops();
        }
      );
    } else {
      fetchAllShops();
    }
  };

  const fetchNearbyShops = async () => {
    try {
      setLoading(true);
      const response = await medicalShopsAPI.getNearby(
        location.latitude,
        location.longitude,
        maxDistance * 1000
      );
      setShops(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch nearby shops");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllShops = async () => {
    try {
      setLoading(true);
      const response = await medicalShopsAPI.getAll();
      setShops(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch shops");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-shops">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Medical Shops</h1>
          <p className="page-subtitle">
            Find nearby pharmacies and medical stores with available medicines
            and supplies
          </p>
        </div>
        <div className="shops-controls">
          <div className="controls-left">
            {location && (
              <div className="control-group">
                <label className="control-label">
                  <svg
                    className="label-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Search Radius
                </label>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="distance-select"
                >
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={20}>Within 20 km</option>
                  <option value={50}>Within 50 km</option>
                </select>
              </div>
            )}
          </div>
          <button onClick={getCurrentLocation} className="btn-refresh">
            <svg
              className="refresh-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Location
          </button>
        </div>
        <div className="shops-layout">
          <div className="shops-list-container">
            <div className="list-header">
              <h2 className="list-title">Medical Shops</h2>
              <span className="results-count">{shops.length} shops found</span>
            </div>

            <div className="shops-list">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">
                    Finding nearby medical shops...
                  </p>
                </div>
              ) : shops.length === 0 ? (
                <div className="empty-state">
                  <svg
                    className="empty-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3>No Medical Shops Found</h3>
                  <p>
                    Try adjusting your search radius or refresh your location
                  </p>
                </div>
              ) : (
                shops.map((shop) => (
                  <div
                    key={shop._id}
                    className={`shop-card ${
                      selectedShop?._id === shop._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedShop(shop)}
                  >
                    <div className="card-header">
                      <h3 className="shop-name">{shop.name}</h3>
                      {shop.averageRating > 0 && (
                        <div className="rating-badge">
                          <svg
                            className="badge-icon"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {shop.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="shop-address">
                      <svg
                        className="info-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {shop.address}
                    </div>

                    {shop.phone && (
                      <div className="shop-phone">
                        <svg
                          className="info-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {shop.phone}
                      </div>
                    )}

                    {shop.medicines && shop.medicines.length > 0 && (
                      <div className="card-footer">
                        <div className="info-badge">
                          <svg
                            className="badge-icon-small"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          {shop.medicines.length} Medicines
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="shop-details">
            {selectedShop ? (
              <div className="details-card">
                <div className="details-header">
                  <h2 className="details-title">{selectedShop.name}</h2>
                  {selectedShop.averageRating > 0 && (
                    <div className="rating-badge-large">
                      <svg
                        className="badge-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {selectedShop.averageRating.toFixed(1)} Rating
                    </div>
                  )}
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Address</div>
                    <div className="detail-value">{selectedShop.address}</div>
                  </div>

                  {selectedShop.phone && (
                    <div className="detail-item">
                      <div className="detail-label">Phone Number</div>
                      <div className="detail-value">
                        <a
                          href={`tel:${selectedShop.phone}`}
                          className="phone-link"
                        >
                          {selectedShop.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedShop.email && (
                    <div className="detail-item">
                      <div className="detail-label">Email</div>
                      <div className="detail-value">
                        <a
                          href={`mailto:${selectedShop.email}`}
                          className="email-link"
                        >
                          {selectedShop.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedShop.openingHours && (
                    <div className="detail-item">
                      <div className="detail-label">Opening Hours</div>
                      <div className="detail-value">
                        {selectedShop.openingHours}
                      </div>
                    </div>
                  )}
                </div>

                {selectedShop.medicines &&
                  selectedShop.medicines.length > 0 && (
                    <div className="section-container">
                      <h3 className="section-title">
                        <svg
                          className="section-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        Available Medicines
                      </h3>
                      <div className="items-grid">
                        {selectedShop.medicines.map((medicine, index) => (
                          <div key={index} className="medicine-card">
                            <div className="medicine-header">
                              <h4 className="medicine-name">{medicine.name}</h4>
                              <span
                                className={`stock-badge ${
                                  medicine.stock > 0
                                    ? "in-stock"
                                    : "out-of-stock"
                                }`}
                              >
                                {medicine.stock > 0
                                  ? `${medicine.stock} Available`
                                  : "Out of Stock"}
                              </span>
                            </div>
                            {medicine.description && (
                              <p className="medicine-description">
                                {medicine.description}
                              </p>
                            )}
                            <div className="medicine-footer">
                              <div className="medicine-price">
                                ₹{medicine.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedShop.reviews && selectedShop.reviews.length > 0 && (
                  <div className="section-container">
                    <h3 className="section-title">
                      <svg
                        className="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Customer Reviews
                    </h3>
                    <div className="items-grid">
                      {selectedShop.reviews.map((review, index) => (
                        <div key={index} className="review-card">
                          <div className="review-rating">
                            <svg
                              className="rating-icon"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {review.rating}/5
                          </div>
                          {review.comment && (
                            <p className="review-comment">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="details-placeholder">
                <svg
                  className="placeholder-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="placeholder-title">No Shop Selected</h3>
                <p className="placeholder-text">
                  Select a medical shop from the list to view detailed
                  information including available medicines and reviews
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg
              className="alert-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {shops.length > 0 && (
          <div className="map-section">
            <div className="map-header">
              <h2 className="map-title">
                <svg
                  className="map-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Interactive Map
              </h2>
              <p className="map-description">
                Click on any marker to view shop details and get directions
              </p>
            </div>
            <div className="map-container">
              <MapContainer
                center={
                  location
                    ? [location.latitude, location.longitude]
                    : [
                        shops[0].location.coordinates[1],
                        shops[0].location.coordinates[0],
                      ]
                }
                zoom={location ? 13 : 10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {shops.map((shop) => {
                  const coords = shop.location?.coordinates || [];
                  const position = [coords[1], coords[0]];
                  return (
                    <Marker
                      key={shop._id}
                      position={position}
                      eventHandlers={{
                        click: () => {
                          setSelectedShop(shop);
                        },
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: "150px" }}>
                          <strong>{shop.name}</strong>
                          <div style={{ fontSize: "0.9rem" }}>
                            {shop.address}
                          </div>
                          <div style={{ marginTop: "8px" }}>
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

export default MedicalShops;
