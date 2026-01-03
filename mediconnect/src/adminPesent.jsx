import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./adminNavbar";

function AdminPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ⚙️ Replace with real admin token after login
  const token = "YOUR_ADMIN_JWT_TOKEN_HERE";

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Pesent/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setMessage("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Delete Patient
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:5000/Pesent/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Patient deleted successfully!");
      fetchPatients();
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("Error deleting patient.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {/* Bootstrap CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />

        <h2 className="text-center mb-4">🧑‍⚕️ Mediconnect Admin Patient Panel</h2>

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading patients...</p>
          </div>
        ) : (
          <div className="table-responsive shadow-lg rounded">
            <table className="table table-hover align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-muted">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient, index) => (
                    <tr key={patient._id}>
                      <td>{index + 1}</td>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.age || "-"}</td>
                      <td>{patient.gender || "-"}</td>
                      <td>{patient.contactNumber || "-"}</td>
                      <td>{patient.address || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(patient._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminPatient;
