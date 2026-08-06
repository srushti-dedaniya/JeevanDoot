import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PatientSidebar from '../../components/layout/PatientSidebar';
import SettingsPreferences from '../../components/layout/SettingsPreferences';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/patient/login', { replace: true });
  };

  return (
    <DashboardLayout
      sidebar={<PatientSidebar />}
      headerProps={{ title: 'Settings', subtitle: 'Account and preferences' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Preferences"
          subtitle="Appearance, language and notification settings"
          icon="tune"
          className="lg:col-span-2"
        >
          <SettingsPreferences />
        </Card>

        <div className="space-y-6">
          <Card title="Account" subtitle="Session management" icon="account_circle">
            <div className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4">
              <span className="material-symbols-outlined text-error shrink-0">logout</span>
              <div className="min-w-0">
                <p className="font-bold text-on-surface text-sm">Log out</p>
                <p className="text-label-md text-on-surface-variant">
                  Ends your session on this device and returns you to the login screen.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="danger" icon="logout" onClick={() => setConfirmLogout(true)}>
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Logout"
        icon="logout"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmLogout(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon="logout" onClick={handleLogout}>
              Logout
            </Button>
          </>
        }
      >
        <p className="text-body-md text-on-surface">
          Are you sure you want to log out? Your session will be cleared and you will be
          redirected to the patient login page.
        </p>
      </Modal>
    </DashboardLayout>
  );
}
