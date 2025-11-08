import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPatient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Pesent/all");
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setLoading(false);
    }
  };

  // Delete patient
  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:5000/Pesent/${id}`);
      alert("Patient deleted successfully!");
      fetchPatients(); // refresh list
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        🧑‍⚕️ Patient Management Panel
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : patients.length === 0 ? (
        <div className="text-center text-gray-600">No patients found.</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-blue-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 border border-gray-200">Name</th>
                <th className="py-3 px-4 border border-gray-200">Email</th>
                <th className="py-3 px-4 border border-gray-200">Age</th>
                <th className="py-3 px-4 border border-gray-200">Gender</th>
                <th className="py-3 px-4 border border-gray-200">Contact</th>
                <th className="py-3 px-4 border border-gray-200">Address</th>
                <th className="py-3 px-4 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    {patient.name}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    {patient.email}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    {patient.age || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    {patient.gender || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    {patient.contactNumber || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    {patient.address || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-center">
                    <button
                      onClick={() => deletePatient(patient._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPatient;
