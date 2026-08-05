import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { patientService } from '../../services/patientService';
import { useDebounce } from '../../hooks/useDebounce';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

const RISK_BADGE = {
  Critical: 'critical',
  High: 'warning',
  Moderate: 'warning',
  Low: 'success',
};

export default function PatientQueue() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const all = await patientService.getAll();
      if (!active) return;
      setPatients(all);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = patients.filter((p) => {
    const matchesQuery =
      !debouncedQuery ||
      p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesRisk = !riskFilter || p.risk === riskFilter;
    return matchesQuery && matchesRisk;
  });

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Patient Queue', subtitle: 'Manage today’s consultations' }}
    >
      <Card
        title="Current Queue"
        subtitle={`${filtered.length} patients shown`}
        headerRight={
          <div className="flex items-center gap-3">
            <SearchBar placeholder="Search patient or ID..." value={query} onSearch={setQuery} containerClassName="w-72" />
            <Select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              options={[{ value: '', label: 'All Risk Levels' }, ...['Critical', 'High', 'Moderate', 'Low'].map((r) => ({ value: r, label: r }))]}
              className="!h-11 w-44"
            />
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="person_off" title="No patients found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-primary text-on-primary">
                    <th className="px-6 py-3 font-headline font-semibold">Patient ID</th>
                    <th className="px-6 py-3 font-headline font-semibold">Name</th>
                    <th className="px-6 py-3 font-headline font-semibold">Village</th>
                    <th className="px-6 py-3 font-headline font-semibold">Complaint</th>
                    <th className="px-6 py-3 font-headline font-semibold">Status</th>
                    <th className="px-6 py-3 font-headline font-semibold">Risk</th>
                    <th className="px-6 py-3 font-headline font-semibold">Check-in</th>
                    <th className="px-6 py-3 font-headline font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-primary">{p.id}</td>
                      <td className="px-6 py-4 font-semibold text-on-surface">{p.name}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{p.village}</td>
                      <td className="px-6 py-4 text-on-surface-variant max-w-[240px] truncate">{p.complaint}</td>
                      <td className="px-6 py-4">
                        <Badge variant={p.status === 'Waiting' ? 'warning' : p.status === 'In Review' ? 'secondary' : 'success'} dot>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={RISK_BADGE[p.risk] ?? 'neutral'}>{p.risk}</Badge>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{p.lastCheckIn}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link to={`/doctor/case/${p.id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                          <Link to="/doctor/prescription">
                            <Button size="sm">Start</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination items={filtered} perPage={8} />
          </>
        )}
      </Card>
    </DashboardLayout>
  );
}
