import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./doctorNavbar1";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ CORRECT TOKEN KEY
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor-login");
    } else {
      fetchAppointments(token);
    }
  }, []);

  const fetchAppointments = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/appointment/my-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("doctorToken");
      navigate("/doctor-login");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      const token = localStorage.getItem("doctorToken");

      await axios.post(
        `http://localhost:5000/appointment/${action}`,
        { appointmentId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAppointments(token);
    } catch {
      alert("Action failed");
    }
  };

  const filteredList = appointments.filter(
    (app) => app.status === filter
  );

  if (loading)
    return <div className="text-center mt-5 spinner-border"></div>;

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Doctor Appointments</h2>

        <div className="btn-group mb-4">
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              className={`btn ${
                filter === s ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilter(s)}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="row">
          {filteredList.length > 0 ? (
            filteredList.map((app) => (
              <div className="col-md-4 mb-3" key={app._id}>
                <div className="card p-3 shadow-sm">
                  <h5>{app.patientId?.name}</h5>
                  <p>{app.timeSlot}</p>

                  {filter === "pending" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success w-100"
                        onClick={() =>
                          handleStatusUpdate(app._id, "approve")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger w-100"
                        onClick={() =>
                          handleStatusUpdate(app._id, "reject")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No appointments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
