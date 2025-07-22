import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import './App.css';

const mapContainerStyle = { width: '100%', height: '400px' };
const center = { lat: 12.9716, lng: 77.5946 }; // Default: Bangalore

function App() {
  const [doctorName, setDoctorName] = useState('');
  const [address, setAddress] = useState('');
  const [marker, setMarker] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [doctors, setDoctors] = useState([]);

  // Handle map click to set marker
  const handleMapClick = (event) => {
    setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  // Save doctor clinic
  const saveDoctor = async () => {
    await axios.post('http://localhost:5000/api/doctors', {
      name: doctorName,
      address,
      latitude: marker.lat,
      longitude: marker.lng,
    });
    alert('Doctor added!');
  };

  // Search doctors
  const searchDoctors = async () => {
    // For simplicity, use a fixed coordinate for search (you can enhance with Geocoding API)
    const response = await axios.get('http://localhost:5000/api/doctors', {
      params: { latitude: 12.9061, longitude: 77.5821, maxDistance: 10000 },
    });
    setDoctors(response.data);
  };

  return (
    <div>
      <h1>Doctor-Patient Platform</h1>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <h2>Add Doctor Clinic</h2>
        <input
          type="text"
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Clinic Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onClick={handleMapClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
        <button onClick={saveDoctor}>Save Doctor</button>

        <h2>Search Doctors</h2>
        <input
          type="text"
          placeholder="Enter location (e.g., JP Nagar)"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={searchDoctors}>Search</button>
        <ul>
          {doctors.map((doc) => (
            <li key={doc._id}>
              {doc.name} - {doc.address}
            </li>
          ))}
        </ul>
      </LoadScript>
    </div>
  );
}

export default App;