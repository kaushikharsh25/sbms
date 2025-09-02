import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DashboardDriver() {
  const { token, user } = useAuth();
  const [busId, setBusId] = useState('');
  const [status, setStatus] = useState('idle');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const watchIdRef = useRef(null);

  useEffect(() => {
    return () => { 
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); 
    };
  }, []);

  const startSharing = () => {
    if (!busId) return;
    
    setStatus('requesting');
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setStatus('error');
      return;
    }

    const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' });
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { longitude: lng, latitude: lat } = pos.coords;
        setCurrentLocation({ lng, lat, speed: pos.coords.speed, heading: pos.coords.heading });
        
        try {
          await client.post('/locations', 
            { 
              busId, 
              lng, 
              lat, 
              speedKph: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : undefined, 
              heading: pos.coords.heading || undefined 
            }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStatus('sharing');
        } catch (e) {
          console.error('Failed to send location:', e);
          setStatus('error');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Failed to get location. Please check your permissions.');
        setStatus('error');
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 10000 
      }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setStatus('idle');
    setCurrentLocation(null);
    setLocationError('');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sharing': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'requesting': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sharing': return '🟢';
      case 'error': return '🔴';
      case 'requesting': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}! Share your location and manage your route.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Location Sharing */}
        <div className="space-y-6">
          {/* Location Sharing Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Sharing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus ID
                </label>
                <input
                  type="text"
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  placeholder="Enter your assigned bus ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={startSharing}
                  disabled={!busId || status === 'sharing' || status === 'requesting'}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed font-medium"
                >
                  {status === 'requesting' ? 'Starting...' : 'Start Sharing'}
                </button>
                <button
                  onClick={stopSharing}
                  disabled={status === 'idle'}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed font-medium"
                >
                  Stop
                </button>
              </div>

              {/* Status Display */}
              <div className={`p-3 rounded-lg ${getStatusColor()}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getStatusIcon()}</span>
                  <span className="font-medium">
                    Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                {status === 'sharing' && (
                  <p className="text-sm mt-1">Location is being shared every 5 seconds</p>
                )}
                {status === 'error' && locationError && (
                  <p className="text-sm mt-1">{locationError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Current Location Info */}
          {currentLocation && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Location</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude:</span>
                  <span className="font-mono font-medium">{currentLocation.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude:</span>
                  <span className="font-mono font-medium">{currentLocation.lng.toFixed(6)}</span>
                </div>
                {currentLocation.speed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-medium">{Math.round(currentLocation.speed * 3.6)} km/h</span>
                  </div>
                )}
                {currentLocation.heading && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heading:</span>
                    <span className="font-medium">{Math.round(currentLocation.heading)}°</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Route & Info */}
        <div className="space-y-6">
          {/* Route Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Information</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Route A - Main Campus Route</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Stop 1: Downtown Station</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Stop 2: Shopping Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Stop 3: Main Campus</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Next Stop:</strong> Main Campus (Stop 3)</p>
                <p><strong>Estimated Time:</strong> 15 minutes</p>
                <p><strong>Current Passengers:</strong> 23/45</p>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'sharing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {status === 'sharing' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                Report Issue
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                Request Break
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                View Schedule
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


