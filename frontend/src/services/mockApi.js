// frontend/src/services/mockApi.js

// =============================
// Fake "database"
// =============================
const users = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@sbms.edu",
      password: "admin123",
      role: "admin",
    },
    {
      id: "2",
      name: "Driver User",
      email: "driver@sbms.edu",
      password: "driver123",
      role: "driver",
    },
    {
      id: "3",
      name: "Student User",
      email: "student@sbms.edu",
      password: "student123",
      role: "student",
    },
  ];
  
  // Fake buses + routes
  let buses = [
    {
      id: "bus1",
      number: "KA-01-1234",
      route: "Route A",
      driver: "Driver User",
      capacity: 40,
      occupancy: 25,
      location: { lat: 28.7041, lng: 77.1025 }, // Delhi coords
    },
    {
      id: "bus2",
      number: "KA-02-5678",
      route: "Route B",
      driver: "Driver User",
      capacity: 35,
      occupancy: 10,
      location: { lat: 28.5355, lng: 77.3910 }, // Noida coords
    },
  ];
  
  let routes = [
    {
      id: "r1",
      name: "Route A",
      stops: ["Stop 1", "Stop 2", "College"],
    },
    {
      id: "r2",
      name: "Route B",
      stops: ["Stop X", "Stop Y", "College"],
    },
  ];
  
  // =============================
  // Auth APIs
  // =============================
  export async function mockLogin(email, password) {
    await new Promise((res) => setTimeout(res, 500));
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");
  
    return {
      token: "fake-jwt-token-" + user.role,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
  
  export async function mockMe(token) {
    await new Promise((res) => setTimeout(res, 300));
    if (!token) throw new Error("No token");
  
    const role = token.replace("fake-jwt-token-", "");
    const user = users.find((u) => u.role === role);
    if (!user) throw new Error("Invalid token");
  
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
  
  // =============================
  // Bus APIs
  // =============================
  export async function mockGetBuses() {
    await new Promise((res) => setTimeout(res, 300));
    return buses;
  }
  
  export async function mockAddBus(bus) {
    await new Promise((res) => setTimeout(res, 300));
    const newBus = { ...bus, id: "bus" + (buses.length + 1) };
    buses.push(newBus);
    return newBus;
  }
  
  export async function mockUpdateBus(id, updates) {
    await new Promise((res) => setTimeout(res, 300));
    buses = buses.map((b) => (b.id === id ? { ...b, ...updates } : b));
    return buses.find((b) => b.id === id);
  }
  
  export async function mockDeleteBus(id) {
    await new Promise((res) => setTimeout(res, 300));
    buses = buses.filter((b) => b.id !== id);
    return true;
  }
  
  // =============================
  // Route APIs
  // =============================
  export async function mockGetRoutes() {
    await new Promise((res) => setTimeout(res, 300));
    return routes;
  }
  
  export async function mockAddRoute(route) {
    await new Promise((res) => setTimeout(res, 300));
    const newRoute = { ...route, id: "r" + (routes.length + 1) };
    routes.push(newRoute);
    return newRoute;
  }
  