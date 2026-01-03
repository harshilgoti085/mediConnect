import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import AdminDoctor from "./adminDocter";
import AdminPatient from "./adminPesent";
import AdminLogin from "./adminLogin";
import DocterLogin from "./docterLogin";
import DocterSingup from "./docterSingup";
import PesentLogin from "./pesentLogin";
import PesentSingup from "./pesentSingup";
import DoctorBooking from "./docterBooking";
import DoctorSideBooking from "./doctorSideBooking";
import VideoCall from "./VideoCall";
import PendingAppointments from "./DoctorPending";
import ApprovedAppointments from "./DoctorApproved";
import PesentNavbar from "./pesentNavbar";
import PesentVideoCall from "./pesentSideVideoCall";
import DoctorVideoCall from "./doctotSideVideoCall";
import Preuplod from "./preUplod";
import Predownlod from "./preDownlod";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin-doctor" element={<AdminDoctor />} />
        <Route path="/admin-patient" element={<AdminPatient />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/DocterLogin" element={<DocterLogin />} />
        <Route path="/DocterSingup" element={<DocterSingup />} />
        <Route path="/PesentLogin" element={<PesentLogin />} />
        <Route path="/PesentSingup" element={<PesentSingup />} />

        <Route path="/DoctorBooking" element={<DoctorBooking />} />
        <Route path="/DoctorSideBooking" element={<DoctorSideBooking />} />

        <Route path="/doctor/pending" element={<PendingAppointments />} />
        <Route path="/doctor/approved" element={<ApprovedAppointments />} />

        <Route path="/VideoCall" element={<VideoCall />} />
        <Route path="/PesentVideoCall" element={<PesentVideoCall />} />
        <Route path="/DoctorVideoCall" element={<DoctorVideoCall />} />

        {/* ✅ FIXED ROUTES */}
        <Route
          path="/doctor/appointment/:appointmentId/upload"
          element={<Preuplod />}
        />

        <Route
          path="/patient/appointment/:appointmentId/download"
          element={<Predownlod />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
