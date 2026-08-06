import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Badge from '../common/Badge';
import { cx } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useTheme } from '../../hooks/useTheme';

const SETTINGS_KEY = 'jd_settings';

const DOCTOR_PROFILE = {
  doctorId: 'DR-1024',
  specialization: 'General Physician',
  phone: '+91 98765 43210',
  hospital: 'Amroli Primary Health Centre',
  experience: '12 years',
  availability: 'Available',
};

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Gujarati'];

const DEFAULT_SETTINGS = {
  emailNotifs: true,
  smsNotifs: false,
  appNotifs: true,
  language: 'English',
};

const FAQS = [
  {
    q: 'How do I start a live consultation?',
    a: 'Open the Live Consultation page from the sidebar and join the waiting room for the scheduled patient.',
  },
  {
    q: 'How are prescriptions delivered to patients?',
    a: 'Generated prescriptions are saved automatically and can be printed or downloaded as PDF from the Prescription Writing page.',
  },
  {
    q: 'How do I refer a patient to a specialist?',
    a: 'Use the Patient Referral page to choose a destination facility and send the referral request to the specialist.',
  },
];

const NOTIFICATION_PREFS = [
  { key: 'emailNotifs', label: 'Email Notifications', description: 'Daily summaries and alerts to your email' },
  { key: 'smsNotifs', label: 'SMS Notifications', description: 'Urgent alerts via text message' },
  { key: 'appNotifs', label: 'In-app Notifications', description: 'Real-time alerts inside JeevanDoot' },
];

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

function ProfileField({ label, value, icon }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3 min-w-0">
      <span className="material-symbols-outlined text-primary shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="font-bold text-on-surface truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

function SectionHeading({ icon, children }) {
  return (
    <p className="flex items-center gap-2 font-bold text-on-surface mb-3">
      <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
      {children}
    </p>
  );
}

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [bugReport, setBugReport] = useState('');
  const ref = useClickOutside(() => setOpen(false), open);

  const initials =
    String(user?.name ?? 'Doctor')
      .replace('Dr. ', '')
      .split(' ')
      .map((n) => n[0])
      .join('') || 'D';

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore storage errors */
    }
  }, [settings]);

  const saveSettings = () => {
    setModal(null);
    toast.success('Settings saved.');
  };

  const changePassword = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (passwords.next.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    toast.success('Password updated successfully.');
  };

  const submitBug = () => {
    if (!bugReport.trim()) {
      toast.error('Please describe the bug before submitting.');
      return;
    }
    setBugReport('');
    toast.success('Bug report submitted. Thank you!');
  };

  const handleLogout = () => {
    logout();
    navigate('/doctor/login', { replace: true });
  };

  const menuItems = [
    { key: 'profile', label: 'My Profile', icon: 'person' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
    { key: 'help', label: 'Help & Support', icon: 'support_agent' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-full p-1 -m-1 hover:bg-surface-container-low transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline font-bold">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="font-bold text-on-surface text-sm">{user?.name}</p>
          <p className="text-label-md text-on-surface-variant">{DOCTOR_PROFILE.specialization}</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant hidden sm:block text-sm">expand_more</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-64 max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-elevation3 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low">
            <p className="font-bold text-on-surface text-sm truncate">{user?.name}</p>
            <p className="text-label-md text-on-surface-variant truncate">{user?.email}</p>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setModal(item.key);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-body-md text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-outline-variant py-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmLogout(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-body-md text-error hover:bg-error-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        </div>
      )}

      <Modal
        open={modal === 'profile'}
        onClose={() => setModal(null)}
        title="My Profile"
        icon="person"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-2xl font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-headline text-title-lg font-bold text-on-surface truncate">{user?.name}</p>
            <p className="text-on-surface-variant">
              {DOCTOR_PROFILE.specialization} · {DOCTOR_PROFILE.hospital}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileField icon="badge" label="Doctor ID" value={DOCTOR_PROFILE.doctorId} />
          <ProfileField icon="work" label="Specialization" value={DOCTOR_PROFILE.specialization} />
          <ProfileField icon="mail" label="Email" value={user?.email} />
          <ProfileField icon="call" label="Phone Number" value={DOCTOR_PROFILE.phone} />
          <ProfileField icon="local_hospital" label="Hospital / PHC" value={DOCTOR_PROFILE.hospital} />
          <ProfileField icon="school" label="Experience" value={DOCTOR_PROFILE.experience} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 bg-surface-container-low rounded-lg p-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-primary shrink-0">monitor_heart</span>
            <div className="min-w-0">
              <p className="font-bold text-on-surface text-sm">Availability Status</p>
              <p className="text-label-md text-on-surface-variant">Visible to patients and CHWs</p>
            </div>
          </div>
          <Badge variant="success" dot dotColor="bg-primary">
            {DOCTOR_PROFILE.availability}
          </Badge>
        </div>
      </Modal>

      <Modal
        open={modal === 'settings'}
        onClose={() => setModal(null)}
        title="Settings"
        icon="settings"
        size="md"
        footer={<Button onClick={saveSettings} icon="save">Save Changes</Button>}
      >
        <div className="space-y-6">
          <section>
            <SectionHeading icon="key">Change Password</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="password"
                label="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                icon="lock"
                placeholder="••••••••"
              />
              <Input
                type="password"
                label="New Password"
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                icon="lock"
                placeholder="Min. 6 characters"
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                icon="lock"
                placeholder="••••••••"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="secondary" size="sm" icon="key" onClick={changePassword}>
                Change Password
              </Button>
            </div>
          </section>

          <section>
            <SectionHeading icon="dark_mode">Appearance</SectionHeading>
            <div className="flex items-center justify-between gap-3 bg-surface-container-low rounded-lg p-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-primary shrink-0">dark_mode</span>
                <div className="min-w-0">
                  <p className="font-bold text-on-surface text-sm">Dark Mode</p>
                  <p className="text-label-md text-on-surface-variant">Switch between light and dark theme</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                onClick={toggleTheme}
                className={cx(
                  'relative inline-flex items-center h-7 w-12 rounded-full transition-colors shrink-0',
                  theme === 'dark' ? 'bg-primary' : 'bg-surface-container-highest border border-outline'
                )}
              >
                <span
                  className={cx(
                    'inline-block w-5 h-5 rounded-full bg-surface-bright shadow transition-transform',
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </section>

          <section>
            <SectionHeading icon="notifications">Notification Preferences</SectionHeading>
            <div className="space-y-2">
              {NOTIFICATION_PREFS.map((pref) => (
                <label
                  key={pref.key}
                  className="flex items-center justify-between gap-3 cursor-pointer bg-surface-container-low rounded-lg p-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface text-sm">{pref.label}</p>
                    <p className="text-label-md text-on-surface-variant">{pref.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[pref.key]}
                    onChange={(e) => setSettings((s) => ({ ...s, [pref.key]: e.target.checked }))}
                    className="h-5 w-5 rounded border-outline text-primary focus:ring-primary shrink-0"
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading icon="translate">Language</SectionHeading>
            <select
              value={settings.language}
              onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
              className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </section>
        </div>
      </Modal>

      <Modal
        open={modal === 'help'}
        onClose={() => setModal(null)}
        title="Help & Support"
        icon="support_agent"
        size="md"
      >
        <div className="space-y-6">
          <section>
            <SectionHeading icon="headset_mic">Contact Support</SectionHeading>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low rounded-lg p-4">
              <div className="min-w-0">
                <p className="font-bold text-on-surface text-sm">Support Team</p>
                <p className="text-label-md text-on-surface-variant">support@jeevandoot.org · +91 1800 123 456</p>
              </div>
              <Button variant="outline" size="sm" icon="mail" onClick={() => toast.success('Support request sent.')}>
                Contact Support
              </Button>
            </div>
          </section>

          <section>
            <SectionHeading icon="quiz">Frequently Asked Questions</SectionHeading>
            <div className="space-y-2">
              {FAQS.map((faq) => (
                <details key={faq.q} className="bg-surface-container-low rounded-lg p-4 group">
                  <summary className="cursor-pointer font-bold text-on-surface text-sm list-none flex items-center justify-between gap-3">
                    {faq.q}
                    <span className="material-symbols-outlined text-primary text-sm shrink-0 transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-2 text-body-sm text-on-surface-variant">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading icon="bug_report">Report a Bug</SectionHeading>
            <textarea
              value={bugReport}
              onChange={(e) => setBugReport(e.target.value)}
              rows={3}
              placeholder="Describe the issue you encountered..."
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-3 flex justify-end">
              <Button variant="secondary" size="sm" icon="send" onClick={submitBug}>
                Submit Report
              </Button>
            </div>
          </section>
        </div>
      </Modal>

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
        <p className="text-body-md text-on-surface">Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
}
