import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { medicalShopsAPI, hospitalsAPI } from '../../utils/api';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async (createdResource) => {
    try {
      setLoading(true);
      // If a resource was just created, use it directly to avoid an extra fetch
      if (createdResource) {
        if (user?.role === 'medical_shop_owner') {
          setShop(createdResource);
        } else if (user?.role === 'hospital_owner') {
          setHospital(createdResource);
        }
        setError('');
        // ensure loading flag is cleared when using created resource
        setLoading(false);
        setActiveTab('overview');
        return;
      }

      if (user?.role === 'medical_shop_owner') {
        const response = await medicalShopsAPI.getMyShop();
        setShop(response.data.data);
      } else if (user?.role === 'hospital_owner') {
        const response = await hospitalsAPI.getMyHospital();
        setHospital(response.data.data);
      }
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('You have not created your ' + (user?.role === 'medical_shop_owner' ? 'medical shop' : 'hospital') + ' yet.');
      } else {
        setError('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !shop && !hospital) {
    return (
      <div className="owner-dashboard">
        <div className="container">
          <h1 className="page-title">Owner Dashboard</h1>
          <div className="alert alert-info">
            {error}
            <div style={{ marginTop: '20px' }}>
              {user?.role === 'medical_shop_owner' && (
                <CreateShopForm onSuccess={loadOwnerData} />
              )}
              {user?.role === 'hospital_owner' && (
                <CreateHospitalForm onSuccess={loadOwnerData} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="container">
        <h1 className="page-title">Owner Dashboard</h1>
        
        <div className="owner-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {user?.role === 'medical_shop_owner' && (
            <>
              <button
                className={`tab-btn ${activeTab === 'medicines' ? 'active' : ''}`}
                onClick={() => setActiveTab('medicines')}
              >
                Manage Medicines
              </button>
            </>
          )}
          {user?.role === 'hospital_owner' && (
            <>
              <button
                className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                onClick={() => setActiveTab('doctors')}
              >
                Manage Doctors
              </button>
              <button
                className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
                onClick={() => setActiveTab('tests')}
              >
                Manage Tests
              </button>
              <button
                className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                Manage Services
              </button>
            </>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className="owner-content">
            {user?.role === 'medical_shop_owner' && shop && (
              <ShopOverview shop={shop} onUpdate={loadOwnerData} />
            )}
            {user?.role === 'hospital_owner' && hospital && (
              <HospitalOverview hospital={hospital} onUpdate={loadOwnerData} />
            )}
          </div>
        )}

        {activeTab === 'medicines' && shop && (
          <MedicineManagement shop={shop} onUpdate={loadOwnerData} />
        )}

        {activeTab === 'doctors' && hospital && (
          <DoctorManagement hospital={hospital} onUpdate={loadOwnerData} />
        )}

        {activeTab === 'tests' && hospital && (
          <TestManagement hospital={hospital} onUpdate={loadOwnerData} />
        )}

        {activeTab === 'services' && hospital && (
          <ServiceManagement hospital={hospital} onUpdate={loadOwnerData} />
        )}
      </div>
    </div>
  );
};

// Shop Overview Component
const ShopOverview = ({ shop, onUpdate }) => {
  return (
    <div className="overview-card">
      <h2>{shop.name}</h2>
      <div className="info-grid">
        <div className="info-item">
          <strong>Address:</strong> {shop.address}
        </div>
        <div className="info-item">
          <strong>Phone:</strong> {shop.phone}
        </div>
        {shop.email && (
          <div className="info-item">
            <strong>Email:</strong> {shop.email}
          </div>
        )}
        {shop.openingHours && (
          <div className="info-item">
            <strong>Opening Hours:</strong> {shop.openingHours}
          </div>
        )}
        <div className="info-item">
          <strong>Medicines Available:</strong> {shop.medicines?.length || 0}
        </div>
        <div className="info-item">
          <strong>Average Rating:</strong> {shop.averageRating || 'N/A'}
        </div>
      </div>
    </div>
  );
};

// Hospital Overview Component
const HospitalOverview = ({ hospital, onUpdate }) => {
  return (
    <div className="overview-card">
      <h2>{hospital.name}</h2>
      <div className="info-grid">
        <div className="info-item">
          <strong>Type:</strong> {hospital.type}
        </div>
        <div className="info-item">
          <strong>Address:</strong> {hospital.address}
        </div>
        {hospital.specializations && hospital.specializations.length > 0 && (
          <div className="info-item">
            <strong>Specializations:</strong> {hospital.specializations.join(', ')}
          </div>
        )}
        <div className="info-item">
          <strong>Phone:</strong> {hospital.phone}
        </div>
        {hospital.email && (
          <div className="info-item">
            <strong>Email:</strong> {hospital.email}
          </div>
        )}
        <div className="info-item">
          <strong>Doctors:</strong> {hospital.doctors?.length || 0}
        </div>
        <div className="info-item">
          <strong>Tests Available:</strong> {hospital.tests?.length || 0}
        </div>
        <div className="info-item">
          <strong>Services:</strong> {hospital.services?.length || 0}
        </div>
        {hospital.emergencyServices && (
          <div className="info-item">
            <strong>Emergency Services:</strong> Available
          </div>
        )}
      </div>
    </div>
  );
};

// Medicine Management Component
const MedicineManagement = ({ shop, onUpdate }) => {
  const [medicines, setMedicines] = useState(shop.medicines || []);
  const [loading, setLoading] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    manufacturer: ''
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedMedicine, setEditedMedicine] = useState(null);

  const handleAdd = async () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.stock) {
      alert('Please fill in required fields (name, price, stock)');
      return;
    }

    const medicine = {
      ...newMedicine,
      price: parseFloat(newMedicine.price),
      stock: parseInt(newMedicine.stock)
    };

    const updatedMedicines = [...medicines, medicine];
    
    try {
      setLoading(true);
      await medicalShopsAPI.updateMedicines(shop._id, updatedMedicines);
      setMedicines(updatedMedicines);
      setNewMedicine({ name: '', description: '', price: '', stock: '', manufacturer: '' });
      onUpdate();
    } catch (err) {
      alert('Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    
    try {
      setLoading(true);
      await medicalShopsAPI.updateMedicines(shop._id, updatedMedicines);
      setMedicines(updatedMedicines);
      onUpdate();
    } catch (err) {
      alert('Failed to delete medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedMedicine({ ...medicines[index] });
  };

  const handleEditChange = (field, value) => {
    setEditedMedicine(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditedMedicine(null);
  };

  const handleSaveEdit = async (index) => {
    if (!editedMedicine.name || !editedMedicine.price || !editedMedicine.stock) {
      alert('Please fill in required fields (name, price, stock)');
      return;
    }

    const updatedMedicines = [...medicines];
    updatedMedicines[index] = {
      ...editedMedicine,
      price: parseFloat(editedMedicine.price),
      stock: parseInt(editedMedicine.stock)
    };

    try {
      setLoading(true);
      await medicalShopsAPI.updateMedicines(shop._id, updatedMedicines);
      setMedicines(updatedMedicines);
      setEditingIndex(-1);
      setEditedMedicine(null);
      onUpdate();
    } catch (err) {
      alert('Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (index, newStock) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].stock = parseInt(newStock);
    
    try {
      setLoading(true);
      await medicalShopsAPI.updateMedicines(shop._id, updatedMedicines);
      setMedicines(updatedMedicines);
      onUpdate();
    } catch (err) {
      alert('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-section">
      <h2>Manage Medicines</h2>
      
      <div className="add-item-form">
        <h3>Add New Medicine</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Medicine Name *"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={newMedicine.description}
            onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            placeholder="Price *"
            value={newMedicine.price}
            onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Stock *"
            value={newMedicine.stock}
            onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Manufacturer"
            value={newMedicine.manufacturer}
            onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
            className="form-input"
          />
        </div>
        <button onClick={handleAdd} className="btn btn-primary" disabled={loading}>
          Add Medicine
        </button>
      </div>

      <div className="items-list">
        <h3>Current Medicines ({medicines.length})</h3>
        {medicines.map((medicine, index) => (
          <div key={index} className="item-card">
            <div className="item-header">
              <h4>{medicine.name}</h4>
              {editingIndex === index ? (
                <div className="edit-actions">
                  <button onClick={() => handleSaveEdit(index)} className="btn btn-primary" disabled={loading}>Save</button>
                  <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                </div>
              ) : (
                <div className="actions">
                  <button onClick={() => handleEditClick(index)} className="btn btn-primary" disabled={loading}>Edit</button>
                  <button onClick={() => handleDelete(index)} className="btn-delete">Delete</button>
                </div>
              )}
            </div>

            {editingIndex === index ? (
              <div className="edit-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Medicine Name *"
                    value={editedMedicine?.name || ''}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={editedMedicine?.description || ''}
                    onChange={(e) => handleEditChange('description', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Price *"
                    value={editedMedicine?.price || ''}
                    onChange={(e) => handleEditChange('price', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Stock *"
                    value={editedMedicine?.stock || ''}
                    onChange={(e) => handleEditChange('stock', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Manufacturer"
                    value={editedMedicine?.manufacturer || ''}
                    onChange={(e) => handleEditChange('manufacturer', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            ) : (
              <>
                {medicine.description && <p>{medicine.description}</p>}
                <div className="item-details">
                  <span>Price: ₹{medicine.price}</span>
                  <span>Stock: 
                    <input
                      type="number"
                      value={medicine.stock}
                      onChange={(e) => handleUpdateStock(index, e.target.value)}
                      className="stock-input"
                      min="0"
                    />
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Doctor Management Component
const DoctorManagement = ({ hospital, onUpdate }) => {
  const [doctors, setDoctors] = useState(hospital.doctors || []);
  const [loading, setLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    availability: '',
    isAvailable: true
  });

  const handleAdd = async () => {
    if (!newDoctor.name || !newDoctor.specialization) {
      alert('Please fill in required fields (name, specialization)');
      return;
    }

    const doctor = {
      ...newDoctor,
      experience: newDoctor.experience ? parseInt(newDoctor.experience) : undefined,
      consultationFee: newDoctor.consultationFee ? parseFloat(newDoctor.consultationFee) : undefined
    };

    const updatedDoctors = [...doctors, doctor];
    
    try {
      setLoading(true);
      await hospitalsAPI.updateDoctors(hospital._id, updatedDoctors);
      setDoctors(updatedDoctors);
      setNewDoctor({ name: '', specialization: '', qualification: '', experience: '', consultationFee: '', availability: '', isAvailable: true });
      onUpdate();
    } catch (err) {
      alert('Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    const updatedDoctors = doctors.filter((_, i) => i !== index);
    
    try {
      setLoading(true);
      await hospitalsAPI.updateDoctors(hospital._id, updatedDoctors);
      setDoctors(updatedDoctors);
      onUpdate();
    } catch (err) {
      alert('Failed to delete doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-section">
      <h2>Manage Doctors</h2>
      
      <div className="add-item-form">
        <h3>Add New Doctor</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Doctor Name *"
            value={newDoctor.name}
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Specialization *"
            value={newDoctor.specialization}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Qualification"
            value={newDoctor.qualification}
            onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Experience (years)"
            value={newDoctor.experience}
            onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            placeholder="Consultation Fee"
            value={newDoctor.consultationFee}
            onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Availability"
            value={newDoctor.availability}
            onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
            className="form-input"
          />
        </div>
        <button onClick={handleAdd} className="btn btn-primary" disabled={loading}>
          Add Doctor
        </button>
      </div>

      <div className="items-list">
        <h3>Current Doctors ({doctors.length})</h3>
        {doctors.map((doctor, index) => (
          <div key={index} className="item-card">
            <div className="item-header">
              <h4>{doctor.name} - {doctor.specialization}</h4>
              <button onClick={() => handleDelete(index)} className="btn-delete">Delete</button>
            </div>
            {doctor.qualification && <p>Qualification: {doctor.qualification}</p>}
            <div className="item-details">
              {doctor.experience && <span>Experience: {doctor.experience} years</span>}
              {doctor.consultationFee && <span>Fee: ₹{doctor.consultationFee}</span>}
              {doctor.availability && <span>Availability: {doctor.availability}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Test Management Component
const TestManagement = ({ hospital, onUpdate }) => {
  const [tests, setTests] = useState(hospital.tests || []);
  const [loading, setLoading] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  });

  const handleAdd = async () => {
    if (!newTest.name || !newTest.price) {
      alert('Please fill in required fields (name, price)');
      return;
    }

    const test = {
      ...newTest,
      price: parseFloat(newTest.price)
    };

    const updatedTests = [...tests, test];
    
    try {
      setLoading(true);
      await hospitalsAPI.updateTests(hospital._id, updatedTests);
      setTests(updatedTests);
      setNewTest({ name: '', description: '', price: '', duration: '', category: '' });
      onUpdate();
    } catch (err) {
      alert('Failed to add test');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    
    const updatedTests = tests.filter((_, i) => i !== index);
    
    try {
      setLoading(true);
      await hospitalsAPI.updateTests(hospital._id, updatedTests);
      setTests(updatedTests);
      onUpdate();
    } catch (err) {
      alert('Failed to delete test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-section">
      <h2>Manage Medical Tests</h2>
      
      <div className="add-item-form">
        <h3>Add New Test</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Test Name *"
            value={newTest.name}
            onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Price *"
            value={newTest.price}
            onChange={(e) => setNewTest({ ...newTest, price: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Description"
            value={newTest.description}
            onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Duration"
            value={newTest.duration}
            onChange={(e) => setNewTest({ ...newTest, duration: e.target.value })}
            className="form-input"
          />
        </div>
        <input
          type="text"
          placeholder="Category"
          value={newTest.category}
          onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
          className="form-input"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button onClick={handleAdd} className="btn btn-primary" disabled={loading}>
          Add Test
        </button>
      </div>

      <div className="items-list">
        <h3>Current Tests ({tests.length})</h3>
        {tests.map((test, index) => (
          <div key={index} className="item-card">
            <div className="item-header">
              <h4>{test.name}</h4>
              <button onClick={() => handleDelete(index)} className="btn-delete">Delete</button>
            </div>
            {test.description && <p>{test.description}</p>}
            <div className="item-details">
              <span>Price: ₹{test.price}</span>
              {test.duration && <span>Duration: {test.duration}</span>}
              {test.category && <span>Category: {test.category}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Service Management Component
const ServiceManagement = ({ hospital, onUpdate }) => {
  const [services, setServices] = useState(hospital.services || []);
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: ''
  });

  const handleAdd = async () => {
    if (!newService.name) {
      alert('Please fill in service name');
      return;
    }

    const updatedServices = [...services, newService];
    
    try {
      setLoading(true);
      await hospitalsAPI.updateServices(hospital._id, updatedServices);
      setServices(updatedServices);
      setNewService({ name: '', description: '', category: '' });
      onUpdate();
    } catch (err) {
      alert('Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    const updatedServices = services.filter((_, i) => i !== index);
    
    try {
      setLoading(true);
      await hospitalsAPI.updateServices(hospital._id, updatedServices);
      setServices(updatedServices);
      onUpdate();
    } catch (err) {
      alert('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-section">
      <h2>Manage Services</h2>
      
      <div className="add-item-form">
        <h3>Add New Service</h3>
        <input
          type="text"
          placeholder="Service Name *"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="form-input"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          className="form-input"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={newService.category}
          onChange={(e) => setNewService({ ...newService, category: e.target.value })}
          className="form-input"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button onClick={handleAdd} className="btn btn-primary" disabled={loading}>
          Add Service
        </button>
      </div>

      <div className="items-list">
        <h3>Current Services ({services.length})</h3>
        {services.map((service, index) => (
          <div key={index} className="item-card">
            <div className="item-header">
              <h4>{service.name}</h4>
              <button onClick={() => handleDelete(index)} className="btn-delete">Delete</button>
            </div>
            {service.description && <p>{service.description}</p>}
            {service.category && <div className="item-details"><span>Category: {service.category}</span></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Create Shop Form Component
const CreateShopForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    openingHours: '',
    coordinates: [0, 0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: [position.coords.longitude, position.coords.latitude]
        }));
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await medicalShopsAPI.createShop({
        ...formData,
        coordinates: formData.coordinates
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      {error && <div className="alert alert-error">{error}</div>}
      <input
        type="text"
        placeholder="Shop Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="tel"
        placeholder="Phone *"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="text"
        placeholder="Address *"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="form-input"
      />
      <input
        type="text"
        placeholder="Opening Hours (e.g., 9:00 AM - 9:00 PM)"
        value={formData.openingHours}
        onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
        className="form-input"
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Medical Shop'}
      </button>
    </form>
  );
};

// Create Hospital Form Component (now supports adding doctors, tests, services before create)
const CreateHospitalForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Private',
    phone: '',
    address: '',
    email: '',
    openingHours: '',
    emergencyServices: false,
    bedsAvailable: 0,
    specializations: '',
    coordinates: [0, 0]
  });
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [services, setServices] = useState([]);

  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '' });
  const [newTest, setNewTest] = useState({ name: '', price: '' });
  const [newService, setNewService] = useState({ name: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: [position.coords.longitude, position.coords.latitude]
        }));
      });
    }
  }, []);

  const addDoctor = () => {
    if (!newDoctor.name || !newDoctor.specialization) return;
    setDoctors(prev => [...prev, { ...newDoctor }]);
    setNewDoctor({ name: '', specialization: '' });
  };

  const removeDoctor = (i) => setDoctors(prev => prev.filter((_, idx) => idx !== i));

  const addTest = () => {
    if (!newTest.name || !newTest.price) return;
    setTests(prev => [...prev, { ...newTest, price: parseFloat(newTest.price) }]);
    setNewTest({ name: '', price: '' });
  };

  const removeTest = (i) => setTests(prev => prev.filter((_, idx) => idx !== i));

  const addService = () => {
    if (!newService.name) return;
    setServices(prev => [...prev, { ...newService }]);
    setNewService({ name: '' });
  };

  const removeService = (i) => setServices(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        ...formData,
        coordinates: formData.coordinates,
        specializations: formData.specializations
          ? formData.specializations.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        doctors,
        tests,
        services
      };
      const response = await hospitalsAPI.createHospital(payload);
      onSuccess(response.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hospital');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      {error && <div className="alert alert-error">{error}</div>}
      <input
        type="text"
        placeholder="Hospital Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="form-input"
        required
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="form-input"
      >
        <option value="Private">Private</option>
        <option value="Public">Public</option>
        <option value="Clinic">Clinic</option>
      </select>
      <input
        type="tel"
        placeholder="Phone *"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="text"
        placeholder="Address *"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="form-input"
      />
      <input
        type="text"
        placeholder="Opening Hours"
        value={formData.openingHours}
        onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
        className="form-input"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={formData.emergencyServices}
          onChange={(e) => setFormData({ ...formData, emergencyServices: e.target.checked })}
        />
        <label>Emergency Services Available</label>
      </div>
      <input
        type="number"
        placeholder="Beds Available"
        value={formData.bedsAvailable}
        onChange={(e) => setFormData({ ...formData, bedsAvailable: parseInt(e.target.value) || 0 })}
        className="form-input"
        min="0"
      />
      <input
        type="text"
        placeholder="Specializations (comma separated)"
        value={formData.specializations}
        onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
        className="form-input"
      />

      <div className="section-divider" />
      <h3>Initial Doctors</h3>
      <div className="form-row">
        <input type="text" placeholder="Name" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} className="form-input" />
        <input type="text" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} className="form-input" />
        <button type="button" className="btn" onClick={addDoctor}>Add</button>
      </div>
      <div className="items-list">
        {doctors.map((d, i) => (
          <div key={i} className="item-card">
            <div className="item-header">
              <h4>{d.name} - {d.specialization}</h4>
              <button type="button" onClick={() => removeDoctor(i)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="section-divider" />
      <h3>Initial Tests</h3>
      <div className="form-row">
        <input type="text" placeholder="Test Name" value={newTest.name} onChange={(e) => setNewTest({ ...newTest, name: e.target.value })} className="form-input" />
        <input type="number" placeholder="Price" value={newTest.price} onChange={(e) => setNewTest({ ...newTest, price: e.target.value })} className="form-input" />
        <button type="button" className="btn" onClick={addTest}>Add</button>
      </div>
      <div className="items-list">
        {tests.map((t, i) => (
          <div key={i} className="item-card">
            <div className="item-header">
              <h4>{t.name}</h4>
              <button type="button" onClick={() => removeTest(i)} className="btn-delete">Delete</button>
            </div>
            <div className="item-details">Price: ₹{t.price}</div>
          </div>
        ))}
      </div>

      <div className="section-divider" />
      <h3>Initial Services</h3>
      <div className="form-row">
        <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="form-input" />
        <button type="button" className="btn" onClick={addService}>Add</button>
      </div>
      <div className="items-list">
        {services.map((s, i) => (
          <div key={i} className="item-card">
            <div className="item-header">
              <h4>{s.name}</h4>
              <button type="button" onClick={() => removeService(i)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Hospital'}
      </button>
    </form>
  );
};

export default OwnerDashboard;

