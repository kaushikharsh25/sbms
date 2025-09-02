import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import DashboardStudent from './pages/DashboardStudent.jsx';
import DashboardDriver from './pages/DashboardDriver.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';

function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/student" 
          element={
            <AppLayout>
              <ProtectedRoute roles={["student", "admin"]}>
                <DashboardStudent />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/driver" 
          element={
            <AppLayout>
              <ProtectedRoute roles={["driver", "admin"]}>
                <DashboardDriver />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AppLayout>
              <ProtectedRoute roles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}


