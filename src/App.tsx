import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import TransmissionLines from "@/pages/TransmissionLines";
import Towers from "@/pages/Towers";
import InspectionPlans from "@/pages/InspectionPlans";
import Defects from "@/pages/Defects";
import DroneInspection from "@/pages/DroneInspection";
import LiveWorking from "@/pages/LiveWorking";
import Statistics from "@/pages/Statistics";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transmission-lines" element={<TransmissionLines />} />
          <Route path="towers" element={<Towers />} />
          <Route path="inspection-plans" element={<InspectionPlans />} />
          <Route path="defects" element={<Defects />} />
          <Route path="drone-inspection" element={<DroneInspection />} />
          <Route path="live-working" element={<LiveWorking />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </Router>
  );
}
