import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import { useNotification } from '../../hooks/useNotification';
import { downloadTextFile } from '../../utils/helpers';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/chw/dashboard', icon: 'dashboard', end: true },
    { label: 'Household Registration', to: '/chw/households', icon: 'home_work' },
    { label: 'Health Survey', to: '/chw/survey', icon: 'fact_check' },
    { label: 'Field Reports', to: '/chw/reports', icon: 'description' },
    { label: 'Community Education', to: '/chw/education', icon: 'school' },
    { label: 'My Schedule', to: '/chw/schedule', icon: 'event' },
  ],
};

const REPORT_TYPES = ['Screening Round', 'Vaccination Drive', 'Sanitation Drive', 'Home Visit', 'Training Session'];

export default function FieldReports() {
  const { notify } = useNotification();
  const [reports, setReports] = useState([
    { id: 'FR-2210', type: 'Screening Round', title: 'Malaria screening round 3', village: 'Amroli', date: 'Today', status: 'Approved' },
    { id: 'FR-2204', type: 'Vaccination Drive', title: 'Palia school vaccination', village: 'Palia', date: 'Yesterday', status: 'Pending' },
    { id: 'FR-2190', type: 'Sanitation Drive', title: 'Devgram clean-up drive', village: 'Devgram', date: '2 days ago', status: 'Approved' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ type: REPORT_TYPES[0], title: '', village: '', content: '' });

  const filtered = reports.filter(
    (r) =>
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.village.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { id: `FR-${Date.now().toString().slice(-4)}`, ...form, date: 'Just now', status: 'Pending' };
    setReports((prev) => [entry, ...prev]);
    setShowForm(false);
    setForm({ type: REPORT_TYPES[0], title: '', village: '', content: '' });
    notify({ type: 'success', message: `Report ${entry.id} submitted` });
  };

  const handleExport = () => {
    downloadTextFile(
      reports.map((r) => `${r.id} | ${r.type} | ${r.title} | ${r.village} | ${r.status}`).join('\n'),
      'field-reports.txt'
    );
    notify({ type: 'success', message: 'Reports exported' });
  };

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{
        title: 'Field Reports',
        subtitle: `${reports.length} reports submitted`,
        right: (
          <>
            <Button variant="outline" icon="download" onClick={handleExport}>Export</Button>
            <Button icon="add" onClick={() => setShowForm(true)}>New Report</Button>
          </>
        ),
      }}
    >
      {showForm && (
        <form onSubmit={handleSubmit}>
          <Card title="New Field Report" icon="edit_note">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Report title"
                  required
                  className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Village</label>
                <input
                  value={form.village}
                  onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))}
                  placeholder="Village / cluster"
                  required
                  className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Notes</label>
                <input
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Key observations"
                  className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="submit" icon="send">Submit Report</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </Card>
        </form>
      )}

      <Card
        title="Submitted Reports"
        subtitle={`${filtered.length} shown`}
        headerRight={<SearchBar placeholder="Search reports..." onSearch={setQuery} containerClassName="w-64" />}
      >
        {filtered.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">No reports match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-on-primary">
                  <th className="px-6 py-3 font-headline font-semibold">ID</th>
                  <th className="px-6 py-3 font-headline font-semibold">Title</th>
                  <th className="px-6 py-3 font-headline font-semibold">Type</th>
                  <th className="px-6 py-3 font-headline font-semibold">Village</th>
                  <th className="px-6 py-3 font-headline font-semibold">Date</th>
                  <th className="px-6 py-3 font-headline font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-primary">{r.id}</td>
                    <td className="px-6 py-4 font-semibold">{r.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{r.type}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{r.village}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{r.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant={r.status === 'Approved' ? 'success' : 'warning'} dot>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
