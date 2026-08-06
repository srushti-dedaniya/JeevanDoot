import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import ConsultationSummary from '../../components/consultation/ConsultationSummary';
import RecordingPlayer from '../../components/consultation/RecordingPlayer';
import {
  getAllConsultations,
  deleteConsultation,
  storePrescriptionDraft,
} from '../../utils/consultationUtils';
import { downloadConsultationSummaryPDF } from '../../utils/pdfUtils';
import { getAllRecordings, deleteRecording } from '../../utils/recordingUtils';
import { formatDateTime, formatDuration } from '../../utils/formatDate';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call' },
    { label: 'Consultation History', to: '/doctor/consultation-history', icon: 'video_library', end: true },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

export default function ConsultationHistory() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedRecordings, setSelectedRecordings] = useState([]);

  const loadConsultations = () => setConsultations(getAllConsultations());

  useEffect(() => {
    loadConsultations();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return consultations;
    return consultations.filter((c) =>
      [c.patientName, c.patientId, c.consultationId, c.doctorName].some((value) =>
        String(value || '').toLowerCase().includes(term)
      )
    );
  }, [consultations, query]);

  const openDetail = async (consultation) => {
    setSelected(consultation);
    const all = await getAllRecordings();
    setSelectedRecordings(all.filter((r) => r.consultationId === consultation.consultationId));
  };

  const handleDownload = (consultation) => {
    downloadConsultationSummaryPDF(consultation);
    toast.success('Consultation summary PDF downloaded.');
  };

  const handlePrescription = (consultation) => {
    storePrescriptionDraft(consultation);
    toast.success('Opening prescription editor with consultation data.');
    navigate('/doctor/prescription');
  };

  const handleDelete = (consultation) => {
    const confirmed = window.confirm(
      `Delete consultation ${consultation.consultationId}? This cannot be undone.`
    );
    if (!confirmed) return;
    const result = deleteConsultation(consultation.consultationId);
    if (result.success) {
      toast.success('Consultation deleted.');
      setSelected(null);
      loadConsultations();
    } else {
      toast.error('Could not delete the consultation.');
    }
  };

  const handleDeleteRecording = async (id) => {
    const result = await deleteRecording(id);
    if (result.success) {
      toast.success('Recording deleted.');
      setSelectedRecordings((prev) => prev.filter((r) => r.id !== id));
    } else {
      toast.error('Could not delete the recording.');
    }
  };

  const columns = [
    {
      key: 'patientName',
      header: 'Patient',
      render: (row) => (
        <div>
          <p className="font-bold text-on-surface">{row.patientName}</p>
          <p className="text-label-sm text-on-surface-variant">{row.patientId}</p>
        </div>
      ),
    },
    { key: 'consultationId', header: 'Consultation', render: (row) => <span className="font-mono text-label-md">{row.consultationId}</span> },
    { key: 'date', header: 'Date', render: (row) => formatDateTime(row.date) },
    { key: 'duration', header: 'Duration', render: (row) => formatDuration(row.duration || 0) },
    {
      key: 'diagnosis',
      header: 'Diagnosis',
      render: (row) =>
        row.diagnosis ? (
          <Badge variant="primary">{row.diagnosis}</Badge>
        ) : (
          <span className="text-on-surface-variant">—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openDetail(row)}
            className="p-2 rounded-full text-primary hover:bg-primary-container/30 transition-colors"
            title="View summary"
            aria-label={`View summary for ${row.consultationId}`}
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload(row)}
            className="p-2 rounded-full text-primary hover:bg-primary-container/30 transition-colors"
            title="Download PDF"
            aria-label={`Download summary for ${row.consultationId}`}
          >
            <span className="material-symbols-outlined text-lg">download</span>
          </button>
          <button
            type="button"
            onClick={() => handlePrescription(row)}
            className="p-2 rounded-full text-primary hover:bg-primary-container/30 transition-colors"
            title="Generate prescription"
            aria-label={`Generate prescription for ${row.consultationId}`}
          >
            <span className="material-symbols-outlined text-lg">prescriptions</span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="p-2 rounded-full text-error hover:bg-error-container transition-colors"
            title="Delete consultation"
            aria-label={`Delete consultation ${row.consultationId}`}
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'Consultation History', subtitle: 'Completed telemedicine sessions' }}
    >
      <Card
        title="Past Consultations"
        icon="video_library"
        subtitle={`${consultations.length} completed session${consultations.length === 1 ? '' : 's'}`}
        headerRight={
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient, ID or doctor..."
            icon="search"
            wrapperClassName="w-full md:w-80"
            className="!h-12"
          />
        }
      >
        <Table
          columns={columns}
          data={filtered}
          rowKey="consultationId"
          emptyState={
            <div className="text-center py-14">
              <span className="material-symbols-outlined text-5xl text-outline">video_library</span>
              <p className="font-bold text-on-surface mt-3">
                {query ? 'No consultations match your search.' : 'No consultations yet.'}
              </p>
              <p className="text-on-surface-variant text-label-md mt-1">
                Completed live consultations will appear here automatically.
              </p>
              {!query && (
                <Button className="mt-5" icon="call" onClick={() => navigate('/doctor/consultation')}>
                  Start a Consultation
                </Button>
              )}
            </div>
          }
        />
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Consultation Summary"
        icon="fact_check"
        size="lg"
      >
        {selected && (
          <ConsultationSummary
            summary={selected}
            onDownload={() => handleDownload(selected)}
            onPrescription={() => handlePrescription(selected)}
            onClose={() => setSelected(null)}
          />
        )}

        {selectedRecordings.length > 0 && (
          <div className="mt-8 pt-6 border-t border-outline-variant">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">videocam</span>
              <p className="font-headline text-headline-sm font-bold text-on-surface">
                Session Recordings
              </p>
              <Badge variant="neutral">{selectedRecordings.length}</Badge>
            </div>
            <div className="divide-y divide-outline-variant">
              {selectedRecordings.map((rec) => (
                <RecordingPlayer
                  key={rec.id}
                  recording={rec}
                  onDelete={handleDeleteRecording}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
