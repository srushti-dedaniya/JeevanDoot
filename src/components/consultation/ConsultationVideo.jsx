import { useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/helpers';
import { formatDuration } from '../../utils/formatDate';
import Button from '../common/Button';

const REMOTE_PARTICIPANT = {
  name: 'Dr. Rajesh Khanna',
  role: 'Consulting Physician',
  specialty: 'Cardiology',
};

/**
 * ConsultationVideo - mock video call surface for telemedicine.
 * Props:
 *  - patient: { name, ... }
 *  - onEnd: callback when the call ends
 *  - doctor: optional remote participant
 */
export default function ConsultationVideo({ patient, onEnd, doctor = REMOTE_PARTICIPANT }) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="bg-surface-container-lowest rounded-2xl card-shadow overflow-hidden">
      <div className="relative bg-black aspect-video flex items-center justify-center">
        {videoOff ? (
          <div className="text-center text-white/70">
            <span className="material-symbols-outlined text-6xl">videocam_off</span>
            <p className="mt-2 font-bold">Camera off</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-4xl font-headline font-bold mb-4">
              {patient?.name?.split(' ').map((n) => n[0]).join('') || 'JD'}
            </div>
            <p className="text-white font-headline text-title-lg">{patient?.name}</p>
            <p className="text-white/60">Patient · Connected</p>
            <div className="absolute inset-0 pointer-events-none video-grid opacity-10" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 text-white px-3 py-1.5 rounded-full text-label-md">
          <span className="material-symbols-outlined text-sm text-error">fiber_manual_record</span>
          {formatDuration(elapsed)}
        </div>

        <div className="absolute bottom-4 right-4 w-40 aspect-video rounded-lg overflow-hidden border-2 border-white/30 bg-surface-container shadow-lg">
          {videoOff ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white/70">videocam_off</span>
            </div>
          ) : (
            <div className="w-full h-full bg-primary/40 flex items-center justify-center">
              <span className="text-white font-headline font-bold">
                {doctor.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline font-bold">
            {doctor.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-on-surface truncate">{doctor.name}</p>
            <p className="text-label-sm text-on-surface-variant">{doctor.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            className={cx(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all',
              muted ? 'bg-error text-white' : 'bg-surface-variant text-on-surface-variant'
            )}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <span className="material-symbols-outlined">{muted ? 'mic_off' : 'mic'}</span>
          </button>
          <button
            onClick={() => setVideoOff((v) => !v)}
            className={cx(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all',
              videoOff ? 'bg-error text-white' : 'bg-surface-variant text-on-surface-variant'
            )}
            aria-label={videoOff ? 'Turn camera on' : 'Turn camera off'}
          >
            <span className="material-symbols-outlined">{videoOff ? 'videocam_off' : 'videocam'}</span>
          </button>
          <Button variant="danger" onClick={onEnd}>
            <span className="material-symbols-outlined">call_end</span>
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
}
