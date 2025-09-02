import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import MapView from '../components/MapView.jsx';

export default function DashboardStudent() {
  const { token, user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [latestLocation, setLatestLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [stopSeq, setStopSeq] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' });
    client.get('/buses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBuses(res.data.buses || []))
      .catch(err => console.error('Failed to fetch buses:', err));
  }, [token]);

  useEffect(() => {
    if (!selectedBus) return;
    
    const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' });
    const id = setInterval(async () => {
      try {
        const { data } = await client.get(`/locations/${selectedBus}/latest`, { headers: { Authorization: `Bearer ${token}` } });
        setLatestLocation(data.location);
      } catch (err) {
        // Bus might not have location yet
      }
    }, 5000);
    
    return () => clearInterval(id);
  }, [selectedBus, token]);

  const points = useMemo(() => latestLocation ? [latestLocation.location.coordinates] : [], [latestLocation]);

  const requestEta = async () => {
    if (!selectedBus || !stopSeq) return;
    
    setIsLoading(true);
    const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' });
    
    try {
      const { data } = await client.get(`/eta/${selectedBus}/${stopSeq}`, { headers: { Authorization: `Bearer ${token}` } });
      setEta(data.etaSeconds);
    } catch (err) {
      console.error('Failed to get ETA:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBusData = buses.find(b => b._id === selectedBus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Track your buses and get real-time updates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Bus Selection & Info */}
        <div className="space-y-6">
          {/* Bus Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Bus</h2>
            <div className="space-y-3">
              {buses.map((bus) => (
                <button
                  key={bus._id}
                  onClick={() => setSelectedBus(bus._id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedBus === bus._id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{bus.numberPlate}</div>
                      <div className="text-sm text-gray-600">Capacity: {bus.capacity} passengers</div>
                      {bus.driver && (
                        <div className="text-sm text-gray-600">Driver: {bus.driver.name}</div>
                      )}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      selectedBus === bus._id ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ETA Request */}
          {selectedBus && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get ETA to Stop</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stop Sequence Number
                  </label>
                  <input
                    type="number"
                    value={stopSeq}
                    onChange={(e) => setStopSeq(e.target.value)}
                    placeholder="Enter stop sequence (1, 2, 3...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={requestEta}
                  disabled={!stopSeq || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Calculating...' : 'Get ETA'}
                </button>
                {eta !== null && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-green-800 font-medium">
                      Estimated arrival time: {Math.round(eta / 60)} minutes
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Bus Details */}
          {selectedBusData && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bus Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bus Number:</span>
                  <span className="font-medium">{selectedBusData.numberPlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{selectedBusData.capacity} passengers</span>
                </div>
                {selectedBusData.driver && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver:</span>
                    <span className="font-medium">{selectedBusData.driver.name}</span>
                  </div>
                )}
                {selectedBusData.route && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">{selectedBusData.route.name}</span>
                  </div>
                )}
                {latestLocation && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(latestLocation.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium">
                        {latestLocation.speedKph ? `${latestLocation.speedKph} km/h` : 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Map */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Bus Location</h2>
            <MapView points={points} />
            {!selectedBus && (
              <div className="text-center text-gray-500 mt-4">
                Select a bus to see its live location on the map
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-blue-800 text-sm">
                  <strong>System Update:</strong> All buses are running on schedule today.
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-yellow-800 text-sm">
                  <strong>Weather Alert:</strong> Light rain expected. Buses may experience minor delays.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


