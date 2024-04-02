import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion"

const AdminComplaint = () => {
  const { id } = useParams(); // Access the complaintId from URL params
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(null);
  const [statusFilters, setStatusFilters] = useState({});
  const token = Cookies.get('token');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `http://localhost:5000/complaint/one/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data)
        setComplaint(res.data);
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setError("Failed to fetch complaint details. Please try again later.");
      }
    };

    fetchComplaint();
  }, [id]);

  const handleChangeStatusFilter = (e, complaintId) => {
    const { value } = e.target;
    setStatusFilters(prevFilters => ({
      ...prevFilters,
      [complaintId]: value,
    }));
  };

  const handleSubmitStatusFilter = async (complaintId) => {
    try {
      await axios.put(`http://localhost:5000/complaint/status/${complaintId}`, {
        status: statusFilters[complaintId],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Status filter for complaint ${complaintId} updated successfully.`);

      // Fetch updated complaints after updating status
      const response = await axios.get(`http://localhost:5000/complaint/one/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedComplaints = response.data;
      setComplaint(updatedComplaints);

      // Update status filters based on the updated complaints
      const updatedStatusFilters = updatedComplaints.reduce((acc, complaint) => {
        acc[complaint._id] = statusFilters[complaint._id] || 'all'; // Preserve existing filters
        return acc;
      }, {});
      setStatusFilters(updatedStatusFilters);
    } catch (error) {
      console.error(`Error updating status filter for complaint ${complaintId}:`, error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-transparent">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
          className="fixed inset-y-0 left-0 w-fit bg-gray-900 h-full z-50 overflow-y-auto"
        >
          <Sidebar />
        </motion.div>
      </div>
      <div className="flex flex-col w-3/4 justify-center items-center h-full">
        <h2 className="text-xl font-bold mb-2">Complaint Details:</h2>
        <div className="bg-white rounded shadow-xl p-6 w-80">
          {error ? (
            <p>{error}</p>
          ) : (
            <div>
              {complaint ? (
                <div className="">
                  <img
                    src={complaint?.photo}
                    alt="User Photo"
                    className="w-full h-40 mb-4 rounded-lg"
                  />
                  <p className="text-lg font-semibold flex justify-end"><p
                    className={`truncate capitalize ${complaint.status === "completed"
                      ? "bg-green-200"
                      : complaint.status === "in progress"
                        ? "bg-yellow-200"
                        : complaint.status === "pending"
                          ? "bg-red-200"
                          : ""
                      } w-fit p-2 rounded-full`}
                  >
                    {complaint.status}
                  </p></p>
                  <p>
                    <strong className="font-bold">Name:</strong> {complaint?.name}
                  </p>
                  <p>
                    <strong className="font-bold">Email:</strong> {complaint?.email}
                  </p>
                  <p>
                    <strong className="font-bold">Message:</strong> {complaint?.message}
                  </p>
                  <p>
                    <strong className="font-bold">Phone:</strong> {complaint?.phone}
                  </p>
                  <p>
                    <strong className="font-bold">Location:</strong> {complaint?.location?.address}
                  </p>
                  <p className="truncate"><strong>Coordinates:</strong><br /> [Lat:{complaint.location.coordinates[0]}, Lng:{complaint.location.coordinates[1]}]</p>
                  <p>
                    <strong className="font-bold">Road:</strong> {complaint?.road}
                  </p>
                  <p><strong>Maps:</strong> <a href={`https://maps.google.com/?q=${complaint.location.coordinates[0]},${complaint.location.coordinates[1]}`} className='text-blue-500 underline'>Click here</a></p>
                  <div className='flex justify-center pt-2'>
                    <select className='border-2 border-black rounded-lg flex' value={statusFilters[complaint._id]} onChange={(e) => handleChangeStatusFilter(e, complaint._id)}>
                      <option value="all">All</option>
                      <option value="pending" disabled={complaint.status === 'pending'}>Pending</option>
                      <option value="in progress" disabled={complaint.status === 'in progress'}>In Progress</option>
                      <option value="completed" disabled={complaint.status === 'completed'}>Completed</option>
                    </select>
                  </div>
                  <div className="text-center mt-3">
                    <button onClick={() => handleSubmitStatusFilter(complaint._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Status</button>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaint;
