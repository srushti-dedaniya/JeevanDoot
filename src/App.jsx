import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeToggle } from './components/common/ThemeToggle';
import AppRoutes from './routes/AppRoutes';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLogin from './pages/auth/AdminLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import CHWLogin from './pages/auth/CHWLogin';
import NotFound from './pages/errors/404';
import Unauthorized from './pages/errors/Unauthorized';

export default function App() {
  return (
    <>
      <Routes>
        {/* Root redirects to doctor login by default */}
        <Route path="/" element={<Navigate to="/doctor/login" replace />} />

        {/* Public authentication pages */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/chw/login" element={<CHWLogin />} />

        {/* Protected dashboards */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppRoutes role="admin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AppRoutes role="doctor" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chw/*"
          element={
            <ProtectedRoute allowedRoles={['chw']}>
              <AppRoutes role="chw" />
            </ProtectedRoute>
          }
        />

        {/* Errors */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ThemeToggle floating />
    </>
  );
}
