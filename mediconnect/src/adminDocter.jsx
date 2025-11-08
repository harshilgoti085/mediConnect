import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDoctorPanel() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ⚙️ Replace with real admin token after login
  const token = "YOUR_ADMIN_JWT_TOKEN_HERE";

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Doctor/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setMessage("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Approve Doctor
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/Doctor/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Doctor approved successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Approval failed:", error);
      setMessage("Error approving doctor.");
    }
  };

  // Delete Doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:5000/Doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("Error deleting doctor.");
    }
  };

  return (
    <div className="container mt-5">
      {/* Bootstrap CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <h2 className="text-center mb-4">🩺 Mediconnect Admin Doctor Panel</h2>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading doctors...</p>
        </div>
      ) : (
        <div className="table-responsive shadow-lg rounded">
          <table className="table table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Hospital</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-muted">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((doc, index) => (
                  <tr key={doc._id}>
                    <td>{index + 1}</td>
                    <td>{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.experience} yrs</td>
                    <td>{doc.hospitalName || "-"}</td>
                    <td>{doc.contactNumber || "-"}</td>
                    <td>
                      {doc.isApproved ? (
                        <span className="badge bg-success">Approved</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </td>
                    <td>
                      {!doc.isApproved && (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleApprove(doc._id)}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(doc._id)}
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
  );
}

export default AdminDoctorPanel;
