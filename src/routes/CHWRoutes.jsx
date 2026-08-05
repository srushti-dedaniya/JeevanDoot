import { Route, Routes } from 'react-router-dom';
import CHWDashboard from '../pages/chw/CHWDashboard';
import HouseholdRegistration from '../pages/chw/HouseholdRegistration';
import HealthSurvey from '../pages/chw/HealthSurvey';
import FieldReports from '../pages/chw/FieldReports';
import CommunityEducation from '../pages/chw/CommunityEducation';
import MySchedule from '../pages/chw/MySchedule';
import NotFound from '../pages/errors/404';

export default function CHWRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<CHWDashboard />} />
      <Route path="households" element={<HouseholdRegistration />} />
      <Route path="survey" element={<HealthSurvey />} />
      <Route path="reports" element={<FieldReports />} />
      <Route path="education" element={<CommunityEducation />} />
      <Route path="schedule" element={<MySchedule />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
