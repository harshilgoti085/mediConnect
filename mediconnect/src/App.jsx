import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import AdminDoctor from "./adminDocter";
import AdminPatient from "./adminPesent";
import Navbar from "./docterNavbar";
import AdminLogin from "./adminLogin";
import DocterLogin from "./docterLogin";
import DocterSingup from "./docterSingup";
import PesentLogin from "./pesentLogin";
import PesentSingup from "./pesentSingup";




function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-doctor" element={<AdminDoctor/>} />
        <Route path="/admin-patient" element={<AdminPatient/>} />
         <Route path="/admin-login" element={<AdminLogin/>} />
         <Route path="/DocterLogin" element={<DocterLogin/>} />
         <Route path="/DocterSingup" element={<DocterSingup/>} />
         <Route path="/PesentLogin" element={<PesentLogin/>} />
         <Route path="/PesentSingup" element={<PesentSingup/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
