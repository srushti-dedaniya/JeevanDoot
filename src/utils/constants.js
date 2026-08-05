export const APP_NAME = 'JeevanDoot';
export const APP_TAGLINE = 'Rural Community Care';

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  CHW: 'chw',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  doctor: 'Doctor',
  chw: 'Health Worker',
};

export const RISK_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const RISK_STYLES = {
  Low: 'bg-primary-fixed text-on-primary-fixed-variant',
  Moderate: 'bg-secondary-container text-on-secondary-container',
  High: 'bg-tertiary-fixed-dim text-tertiary',
  Critical: 'bg-error-container text-on-error-container',
};

export const QUEUE_STATUS = {
  WAITING: 'Waiting',
  IN_REVIEW: 'In Review',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
};

export const VISIT_PURPOSES = [
  'General Checkup',
  'Prenatal Checkup',
  'Postnatal Checkup',
  'Vaccination',
  'Fever / Illness',
  'Chronic Condition Monitoring',
  'Follow-up',
  'Screening Camp',
];

export const DEFAULT_VILLAGES = [
  'Amroli',
  'Palia',
  'Devgram',
  'Kanker East',
  'Dhamtari Rural',
  'Lormi Block',
  'Bijapur Sector 2',
];

export const MEDICATION_SUGGESTIONS = [
  'Paracetamol',
  'Cetirizine',
  'ORS',
  'Amoxicillin',
  'Ibuprofen',
  'Metformin',
  'Amlodipine',
  'Azithromycin',
];

export const REFERRAL_DESTINATIONS = [
  { value: 'agh', label: 'Amroli General Hospital (Primary Care Facility)' },
  { value: 'dcc', label: 'District Cardiology Center (Specialist Hospital)' },
  { value: 'drr', label: 'Dr. Rajeev (Orthopedic Specialist)' },
];

export const COMMON_MEDICINE_SCHEDULES = ['Morning', 'Afternoon', 'Night'];

export const DEFAULT_PER_PAGE = 10;

export const DATE_RANGES = ['Last 24 Hours', 'Last 30 Days', 'Last 6 Months', 'Year to Date'];
