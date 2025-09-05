import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DashboardDriver() {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [busId, setBusId] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState({
    name: 'Campus → Downtown',
    stops: ['Campus Main Gate', 'Downtown Station', 'Shopping Center', 'Campus Back Gate'],
    currentStop: 'Downtown Station',
    nextStop: 'Shopping Center'
  });

  useEffect(() => {
    if (isSharing) {
      // Simulate getting current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toLocaleTimeString()
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );

      // Update location every 5 seconds when sharing
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toLocaleTimeString()
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isSharing]);

  const toggleLocationSharing = () => {
    if (!busId.trim()) {
      alert('Please enter a bus ID first');
      return;
    }
    setIsSharing(!isSharing);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Driver Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}! Manage your route and share your location.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Sharing Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Location Sharing
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bus ID
                  </label>
                  <input
                    type="text"
                    value={busId}
                    onChange={(e) => setBusId(e.target.value)}
                    placeholder="Enter bus ID (e.g., SB001)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  />
                </div>

                <button
                  onClick={toggleLocationSharing}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    isSharing
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSharing ? 'Stop Sharing' : 'Start Sharing'}
                </button>

                {isSharing && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm text-center">
                      🟢 Location sharing active
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Current Location
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Latitude:</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {currentLocation.lat.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Longitude:</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {currentLocation.lng.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {currentLocation.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Driver Info
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Route & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Route Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Current Route: {routeInfo.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Current Stop:</span>
                      <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                        {routeInfo.currentStop}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Next Stop:</span>
                      <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {routeInfo.nextStop}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    All Stops
                  </h4>
                  <div className="space-y-1">
                    {routeInfo.stops.map((stop, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className={`w-4 h-4 rounded-full mr-2 ${
                          stop === routeInfo.currentStop
                            ? 'bg-blue-500'
                            : stop === routeInfo.nextStop
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}></span>
                        <span className={`${
                          stop === routeInfo.currentStop
                            ? 'text-blue-600 dark:text-blue-400 font-medium'
                            : stop === routeInfo.nextStop
                            ? 'text-green-600 dark:text-green-400 font-medium'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {stop}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:scale-105">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Start Trip</span>
                  </div>
                </button>

                <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-200 hover:scale-105">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">End Trip</span>
                  </div>
                </button>

                <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800 transition-all duration-200 hover:scale-105">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Report Issue</span>
                  </div>
                </button>

                <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-all duration-200 hover:scale-105">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Help</span>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">GPS</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">Active</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Network</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Online</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Battery</p>
                  <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">85%</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Speed</p>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">35 km/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


