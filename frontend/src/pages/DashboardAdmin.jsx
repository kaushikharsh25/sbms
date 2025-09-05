import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  mockGetBuses,
  mockAddBus,
  mockDeleteBus,
  mockGetRoutes,
} from "../services/mockApi.js";

export default function DashboardAdmin() {
  const { token, user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [numberPlate, setNumberPlate] = useState("");
  const [capacity, setCapacity] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // detect if real API is set
  const API_BASE = import.meta.env.VITE_API_BASE || null;
  const client = API_BASE
    ? axios.create({ baseURL: API_BASE })
    : null;

  const refetch = async () => {
    try {
      if (API_BASE) {
        // ✅ Real API mode
        const [b, r] = await Promise.all([
          client.get("/buses", { headers: { Authorization: `Bearer ${token}` } }),
          client.get("/routes", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setBuses(b.data.buses || []);
        setRoutes(r.data.routes || []);
      } else {
        // ✅ Mock mode
        const [b, r] = await Promise.all([mockGetBuses(), mockGetRoutes()]);
        setBuses(b || []);
        setRoutes(r || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setMessage({ type: "error", text: "Failed to fetch data" });
    }
  };

  useEffect(() => {
    if (token) refetch();
  }, [token]);

  const addBus = async () => {
    if (!numberPlate.trim()) {
      setMessage({ type: "error", text: "Please enter a bus number plate" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (API_BASE) {
        await client.post(
          "/buses",
          { numberPlate: numberPlate.trim(), capacity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await mockAddBus({
          number: numberPlate.trim(),
          capacity,
          driver: null,
          occupancy: 0,
          route: null,
          isActive: true,
        });
      }

      setNumberPlate("");
      setCapacity(45);
      setMessage({ type: "success", text: "Bus added successfully!" });
      refetch();
    } catch (err) {
      console.error("❌ Failed to add bus:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add bus. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBus = async (busId) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;

    try {
      if (API_BASE) {
        await client.delete(`/buses/${busId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await mockDeleteBus(busId);
      }
      setMessage({ type: "success", text: "Bus deleted successfully!" });
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete bus:", err);
      setMessage({ type: "error", text: "Failed to delete bus. Please try again." });
    }
  };

  const stats = {
    totalBuses: buses.length,
    activeBuses: buses.filter((b) => b.isActive).length,
    totalRoutes: routes.length,
    totalDrivers: buses.filter((b) => b.driver).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {user?.name}! Manage your transportation system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Buses" value={stats.totalBuses} color="blue" />
          <StatCard title="Active Buses" value={stats.activeBuses} color="green" />
          <StatCard title="Total Routes" value={stats.totalRoutes} color="purple" />
          <StatCard title="Assigned Drivers" value={stats.totalDrivers} color="yellow" />
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Bus Management */}
          <div className="space-y-6">
            {/* Add Bus */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Bus</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={numberPlate}
                  onChange={(e) => setNumberPlate(e.target.value)}
                  placeholder="e.g., KA-01-AB-1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 45)}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={addBus}
                  disabled={isLoading || !numberPlate.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg"
                >
                  {isLoading ? "Adding..." : "Add Bus"}
                </button>
              </div>
            </div>

            {/* Buses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Buses</h2>
              {buses.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No buses found. Add your first bus above.
                </div>
              ) : (
                buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center mb-2"
                  >
                    <div>
                      <div className="font-semibold">{bus.number}</div>
                      <div className="text-sm text-gray-600">
                        Capacity: {bus.capacity}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteBus(bus.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Routes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Routes</h2>
            {routes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No routes found.</div>
            ) : (
              routes.map((route) => (
                <div
                  key={route.id}
                  className="border border-gray-200 rounded-lg p-4 mb-2"
                >
                  <div className="font-semibold">{route.name}</div>
                  <div className="text-sm text-gray-600">
                    Stops: {route.stops.length}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "border-blue-500 text-blue-600 bg-blue-100",
    green: "border-green-500 text-green-600 bg-green-100",
    purple: "border-purple-500 text-purple-600 bg-purple-100",
    yellow: "border-yellow-500 text-yellow-600 bg-yellow-100",
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colors[color]}`}>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
