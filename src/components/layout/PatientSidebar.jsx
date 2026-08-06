import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const PATIENT_MENU = [
  { label: 'Dashboard', to: '/patient/dashboard', icon: 'dashboard', end: true },
  { label: 'Medical Records', to: '/patient/records', icon: 'folder_shared' },
  { label: 'Prescriptions', to: '/patient/prescriptions', icon: 'medication' },
  { label: 'Appointments', to: '/patient/appointments', icon: 'event' },
  { label: 'Consultation History', to: '/patient/consultation-history', icon: 'history' },
  { label: 'Reports', to: '/patient/reports', icon: 'description' },
  { label: 'Health Monitoring', to: '/patient/monitoring', icon: 'monitor_heart' },
  { label: 'Notifications', to: '/patient/notifications', icon: 'notifications' },
  { label: 'Profile', to: '/patient/profile', icon: 'person' },
  { label: 'Settings', to: '/patient/settings', icon: 'settings' },
];

export default function PatientSidebar({ brand }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/patient/login', { replace: true });
  };

  const footer = (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-colors duration-200 ease-in-out"
    >
      <span className="material-symbols-outlined">logout</span>
      <span className="font-body text-body-md">Logout</span>
    </button>
  );

  return <Sidebar brand={brand} items={PATIENT_MENU} footer={footer} />;
}
