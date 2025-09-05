import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DashboardStudent() {
  const { user } = useAuth();
  const [selectedBus, setSelectedBus] = useState(null);
  const [eta, setEta] = useState(null);
  const [isLoadingEta, setIsLoadingEta] = useState(false);

  // Sample bus data
  const buses = [
    { id: 1, number: 'SB001', route: 'Campus → Downtown', driver: 'John Smith', status: 'active', eta: '5 min' },
    { id: 2, number: 'SB002', route: 'Campus → Airport', driver: 'Sarah Johnson', status: 'active', eta: '12 min' },
    { id: 3, number: 'SB003', route: 'Campus → Mall', driver: 'Mike Davis', status: 'maintenance', eta: 'N/A' },
  ];

  const handleEtaRequest = async () => {
    if (!selectedBus) return;
    
    setIsLoadingEta(true);
    // Simulate API call
    setTimeout(() => {
      setEta(`Bus ${selectedBus.number} will arrive in approximately ${selectedBus.eta}`);
      setIsLoadingEta(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}! Track your bus and get real-time updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bus Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Available Buses
              </h2>
              <div className="space-y-3">
                {buses.map((bus) => (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedBus(bus)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedBus?.id === bus.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Bus {bus.number}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{bus.route}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Driver: {bus.driver}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bus.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        }`}>
                          {bus.status}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{bus.eta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* ETA Request */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Request ETA
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Bus
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    {selectedBus ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white font-medium">
                          Bus {selectedBus.number} - {selectedBus.route}
                        </span>
                        <button
                          onClick={() => setSelectedBus(null)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No bus selected</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleEtaRequest}
                  disabled={!selectedBus || isLoadingEta}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isLoadingEta ? 'Getting ETA...' : 'Get ETA'}
                </button>

                {eta && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">{eta}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Map Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Live Map View
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Map integration coming soon</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Google Maps or Mapbox integration</p>
                </div>
              </div>
            </div>

            {/* Bus Details */}
            {selectedBus && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Bus Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bus Number</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedBus.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedBus.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Driver</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedBus.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedBus.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {selectedBus.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notifications
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    🚌 Bus SB001 is running 5 minutes behind schedule due to traffic.
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    ✅ New route added: Campus → Shopping Center (Starting Monday)
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    ⚠️ Bus SB003 is currently under maintenance. Expected completion: Tomorrow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


