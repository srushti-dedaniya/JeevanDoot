import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import KPIWidget from '../../components/charts/KPIWidget';
import SearchBar from '../../components/common/SearchBar';
import { useNotification } from '../../hooks/useNotification';
import { downloadCSV } from '../../utils/helpers';
import { formatDate } from '../../utils/formatDate';
import { NGO_NAV } from './ngoNav';

const CAMPAIGNS = ['Malaria Prevention', 'Maternal Health', 'Nutrition Drive', 'Clean Water & Sanitation', 'Vaccination Support'];

const DONATION_STATUSES = ['Pending', 'Received'];

const EXPORT_PERIODS = [
  { value: '1', label: 'Last 1 month' },
  { value: '3', label: 'Last 3 months' },
  { value: '6', label: 'Last 6 months' },
  { value: '12', label: 'Last 12 months' },
  { value: 'all', label: 'All time' },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

export default function Donations() {
  const { notify } = useNotification();
  const [donations, setDonations] = useState([
    { id: 'D-2210', donor: 'Seva Foundation', amount: 250000, campaign: 'Malaria Prevention', date: daysAgo(5), status: 'Received' },
    { id: 'D-2209', donor: 'Rotary Club', amount: 120000, campaign: 'Maternal Health', date: daysAgo(24), status: 'Received' },
    { id: 'D-2208', donor: 'Azim Premji Trust', amount: 300000, campaign: 'Nutrition Drive', date: daysAgo(58), status: 'Pending' },
    { id: 'D-2207', donor: 'Lok Foundation', amount: 80000, campaign: 'Clean Water & Sanitation', date: daysAgo(95), status: 'Received' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [exportMonths, setExportMonths] = useState('12');
  const [form, setForm] = useState({ donor: '', amount: '', campaign: CAMPAIGNS[0] });

  const totalReceived = donations
    .filter((d) => d.status === 'Received')
    .reduce((sum, d) => sum + d.amount, 0);

  const filtered = donations.filter(
    (d) =>
      !query ||
      d.donor.toLowerCase().includes(query.toLowerCase()) ||
      d.campaign.toLowerCase().includes(query.toLowerCase())
  );

  const formatAmount = (value) => `₹${value.toLocaleString('en-IN')}`;

  const changeStatus = (id, status) => {
    const donation = donations.find((d) => d.id === id);
    if (!donation || donation.status === status) return;
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    notify({ type: 'success', message: `Donation ${donation.id} marked as ${status}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { id: `D-${Date.now().toString().slice(-4)}`, donor: form.donor, amount: Number(form.amount) || 0, campaign: form.campaign, date: new Date(), status: 'Pending' };
    setDonations((prev) => [entry, ...prev]);
    setShowForm(false);
    setForm({ donor: '', amount: '', campaign: CAMPAIGNS[0] });
    notify({ type: 'success', message: `Donation ${entry.id} recorded` });
  };

  const inExportWindow = (date) => {
    if (exportMonths === 'all') return true;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - Number(exportMonths));
    return new Date(date) >= cutoff;
  };

  const handleExport = () => {
    const rows = donations
      .filter((d) => inExportWindow(d.date))
      .map((d) => [
        d.id,
        d.donor,
        d.campaign,
        d.amount,
        formatDate(d.date, 'yyyy-MM-dd'),
        d.status,
      ]);
    downloadCSV('donations.csv', ['ID', 'Donor', 'Campaign', 'Amount (INR)', 'Date', 'Status'], rows);
    notify({ type: 'success', message: `${rows.length} donation${rows.length === 1 ? '' : 's'} exported to CSV` });
  };

  return (
    <DashboardLayout
      sidebarProps={NGO_NAV}
      headerProps={{
        title: 'Donations',
        subtitle: 'Funds received for community programs',
        right: (
          <>
            <div className="flex items-center gap-3">
              <span className="text-label-md text-on-surface-variant whitespace-nowrap">Export</span>
              <select
                value={exportMonths}
                onChange={(e) => setExportMonths(e.target.value)}
                className="h-11 bg-surface-container-low border border-outline-variant rounded-lg px-3 text-label-md focus:ring-2 focus:ring-primary"
                aria-label="Export period"
              >
                {EXPORT_PERIODS.map((period) => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
              <Button variant="outline" icon="download" onClick={handleExport}>Download CSV</Button>
            </div>
            <Button icon="add" onClick={() => setShowForm(true)}>Record Donation</Button>
          </>
        ),
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KPIWidget label="Total Collected" value={formatAmount(totalReceived)} icon="payments" color="primary" trend={15} />
        <KPIWidget label="Annual Goal" value="₹25,00,000" icon="flag" color="secondary" sublabel="64% of target reached" />
        <KPIWidget label="Active Campaigns" value={CAMPAIGNS.length} icon="campaign" color="tertiary" sublabel="Across 7 villages" />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <Card title="Record a Donation" icon="volunteer_activism">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Donor</label>
                <input
                  value={form.donor}
                  onChange={(e) => setForm((f) => ({ ...f, donor: e.target.value }))}
                  placeholder="Organization / individual"
                  required
                  className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="e.g. 50000"
                  required
                  className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label-lg font-semibold text-on-surface ml-1 mb-2">Campaign</label>
                <select
                  value={form.campaign}
                  onChange={(e) => setForm((f) => ({ ...f, campaign: e.target.value }))}
                  className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-4 focus:ring-2 focus:ring-primary"
                >
                  {CAMPAIGNS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="submit" icon="save">Save Donation</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </Card>
        </form>
      )}

      <Card
        title="Donation Tracker"
        subtitle={`${filtered.length} donations recorded`}
        headerRight={<SearchBar placeholder="Search donor or campaign..." onSearch={setQuery} containerClassName="w-64" />}
      >
        {filtered.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">No donations match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-on-primary">
                  <th className="px-6 py-3 font-headline font-semibold">ID</th>
                  <th className="px-6 py-3 font-headline font-semibold">Donor</th>
                  <th className="px-6 py-3 font-headline font-semibold">Campaign</th>
                  <th className="px-6 py-3 font-headline font-semibold">Amount</th>
                  <th className="px-6 py-3 font-headline font-semibold">Date</th>
                  <th className="px-6 py-3 font-headline font-semibold">Status</th>
                  <th className="px-6 py-3 font-headline font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-primary">{d.id}</td>
                    <td className="px-6 py-4 font-semibold">{d.donor}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{d.campaign}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{formatAmount(d.amount)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatDate(d.date, 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <Badge variant={d.status === 'Received' ? 'success' : 'warning'} dot>{d.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={d.status}
                        onChange={(e) => changeStatus(d.id, e.target.value)}
                        className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-label-md focus:ring-2 focus:ring-primary"
                        aria-label={`Update status for donation ${d.id}`}
                      >
                        {DONATION_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
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
