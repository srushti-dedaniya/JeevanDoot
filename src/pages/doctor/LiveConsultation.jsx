import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ConsultationVideo from '../../components/consultation/ConsultationVideo';
import ChatPanel from '../../components/consultation/ChatPanel';
import { consultationService } from '../../services/consultationService';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../hooks/useNotification';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: 'dashboard', end: true },
    { label: 'Patient Queue', to: '/doctor/queue', icon: 'groups' },
    { label: 'Live Consultation', to: '/doctor/consultation', icon: 'call', end: true },
    { label: 'Performance Analytics', to: '/doctor/performance', icon: 'query_stats' },
  ],
};

export default function LiveConsultation() {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [patient, setPatient] = useState(null);
  const [session, setSession] = useState(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const init = async () => {
      const [p, t] = await Promise.all([
        patientService.getById('JD-9921'),
        consultationService.getTranscript('sess-demo'),
      ]);
      setPatient(p);
      setTranscript(t.scribe);
    };
    init();
  }, []);

  const startSession = async () => {
    const s = await consultationService.createSession(patient.id);
    setSession(s);
    notify({ type: 'info', message: `Consultation session ${s.sessionId} started` });
  };

  const endSession = async () => {
    if (session) await consultationService.endSession(session.sessionId, transcript);
    notify({ type: 'success', message: 'Consultation ended. Summary saved.' });
    navigate('/doctor/dashboard');
  };

  return (
    <DashboardLayout sidebarProps={SIDEBAR} headerProps={{ title: 'Live Consultation', subtitle: 'Secure telemedicine session' }}>
      {!patient ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : !session ? (
        <Card className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-3xl font-bold mb-4">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <h3 className="font-headline text-headline-md font-bold text-on-surface">{patient.name}</h3>
            <p className="text-on-surface-variant mb-2">{patient.id} · {patient.village}</p>
            <Badge variant="critical" uppercase>{patient.risk} Risk</Badge>
            <div className="bg-surface-container-low rounded-lg p-4 mt-6 text-left w-full max-w-md">
              <p className="text-label-md text-on-surface-variant mb-1">Complaint</p>
              <p className="text-on-surface font-medium">{patient.complaint}</p>
            </div>
            <div className="mt-8 flex gap-3">
              <Button size="lg" icon="videocam" onClick={startSession}>
                Start Session
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/doctor/queue')}>
                Back to Queue
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <ConsultationVideo patient={patient} onEnd={endSession} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChatPanel onSend={() => {}} />
            <Card title="AI Scribe Notes" icon="auto_awesome" subtitle="Auto-generated from conversation">
              <p className="text-on-surface-variant leading-relaxed">{transcript}</p>
              <div className="mt-6">
                <label className="block font-bold text-on-surface mb-2">Add Manual Notes</label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button variant="secondary" className="mt-4" icon="save" onClick={() => notify({ type: 'success', message: 'Scribe notes saved' })}>
                Save Scribe Notes
              </Button>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
