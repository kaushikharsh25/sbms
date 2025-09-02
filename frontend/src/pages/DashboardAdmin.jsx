import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DashboardAdmin() {
  const { token, user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [numberPlate, setNumberPlate] = useState('');
  const [capacity, setCapacity] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' });

  const refetch = async () => {
    try {
      const [b, r] = await Promise.all([
        client.get('/buses', { headers: { Authorization: `Bearer ${token}` } }),
        client.get('/routes', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBuses(b.data.buses || []);
      setRoutes(r.data.routes || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setMessage({ type: 'error', text: 'Failed to fetch data' });
    }
  };

  useEffect(() => { 
    if (token) refetch(); 
  }, [token]);

  const addBus = async () => {
    if (!numberPlate.trim()) {
      setMessage({ type: 'error', text: 'Please enter a bus number plate' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await client.post('/buses', { numberPlate: numberPlate.trim(), capacity }, { headers: { Authorization: `Bearer ${token}` } });
      setNumberPlate('');
      setCapacity(45);
      setMessage({ type: 'success', text: 'Bus added successfully!' });
      refetch();
    } catch (err) {
      console.error('Failed to add bus:', err);
      setMessage({ type: 'error', text: 'Failed to add bus. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBus = async (busId) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;

    try {
      await client.delete(`/buses/${busId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type: 'success', text: 'Bus deleted successfully!' });
      refetch();
    } catch (err) {
      console.error('Failed to delete bus:', err);
      setMessage({ type: 'error', text: 'Failed to delete bus. Please try again.' });
    }
  };

  const stats = {
    totalBuses: buses.length,
    activeBuses: buses.filter(b => b.isActive).length,
    totalRoutes: routes.length,
    totalDrivers: buses.filter(b => b.driver).length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}! Manage your transportation system.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Buses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBuses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRoutes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Bus Management */}
        <div className="space-y-6">
          {/* Add Bus Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Bus</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Number Plate
                </label>
                <input
                  type="text"
                  value={numberPlate}
                  onChange={(e) => setNumberPlate(e.target.value)}
                  placeholder="e.g., KA-01-AB-1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 45)}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addBus}
                disabled={isLoading || !numberPlate.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Adding...' : 'Add Bus'}
              </button>
            </div>
          </div>

          {/* Buses List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Buses</h2>
            <div className="space-y-3">
              {buses.map((bus) => (
                <div key={bus._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{bus.numberPlate}</div>
                      <div className="text-sm text-gray-600">Capacity: {bus.capacity} passengers</div>
                      {bus.driver && (
                        <div className="text-sm text-gray-600">Driver: {bus.driver.name}</div>
                      )}
                      {bus.route && (
                        <div className="text-sm text-gray-600">Route: {bus.route.name}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteBus(bus._id)}
                      className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {buses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No buses found. Add your first bus above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Routes & Actions */}
        <div className="space-y-6">
          {/* Routes List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Routes</h2>
            <div className="space-y-3">
              {routes.map((route) => (
                <div key={route._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-gray-900 mb-2">{route.name}</div>
                  <div className="text-sm text-gray-600">
                    Stops: {route.stops?.length || 0}
                  </div>
                  {route.stops && route.stops.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {route.stops.map((stop, index) => (
                        <span key={index} className="inline-block bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
                          {stop.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {routes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No routes found.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                Export Data
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                Add Route
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                System Status
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                Reports
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">API Status:</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


