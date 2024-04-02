import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { motion } from "framer-motion"
import Cookies from 'js-cookie';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilters, setStatusFilters] = useState({});
  const token = Cookies.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/complaint/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const initialStatusFilters = response.data.reduce((acc, complaint) => {
          acc[complaint._id] = 'all';
          return acc;
        }, {});
        setStatusFilters(initialStatusFilters);
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchComplaints();
  }, []);

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
      const response = await axios.get('http://localhost:5000/complaint/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedComplaints = response.data;
      setComplaints(updatedComplaints);

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
    <div className='flex h-screen'>
      <div className="w-1/4 bg-transparent">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
          className="fixed inset-y-0 left-0 w-64 bg-gray-900 h-full z-50 overflow-y-auto"
        >
          <Sidebar />
        </motion.div>
      </div>
      <div className='w-3/4'>
        <h1 className='text-xl font-bold text-center underline pb-20'>Complaints</h1>
        <div className="grid grid-cols-4 gap-40 px-20">
          {complaints.map(complaint => (
            <div
              key={complaint._id}
              className="bg-white py-4 px-5 mb-4 rounded shadow-xl h-fit w-fit"
              style={{ maxWidth: "250px" }}
            >
              {/* Photo */}
              <img
                src={complaint.photo}
                alt="Complaint Photo"
                className="mb-2 rounded-md w-full h-40"
                style={{ maxHeight: "200px" }}
              />
              {/* Buttons */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => navigate(`/complaint/${complaint._id}`)}
                  className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                >
                  <FaEye />
                </button>
              </div>
              <div className="flex py-1 justify-end">
                <p
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
                </p>
              </div>
              {/* Complaint information */}
              <p className="truncate"><strong>Name:</strong> {complaint.name}</p>
              <p className="truncate"><strong>Email:</strong> {complaint.email}</p>
              <p className="truncate"><strong>Message:</strong> {complaint.message}</p>
              <p className="truncate"><strong>Phone:</strong> {complaint.phone}</p>
              <p className="truncate"><strong>Address:</strong> {complaint.location.address}</p>
              <p className="truncate"><strong>Coordinates:</strong><br /> [Lat:{complaint.location.coordinates[0]}, Lng:{complaint.location.coordinates[1]}]</p>
              <p className="truncate"><strong>Road:</strong> {complaint.road}</p>
              <p className='truncate'><strong>Maps:</strong> <a href={`https://maps.google.com/?q=${complaint.location.coordinates[0]},${complaint.location.coordinates[1]}`} className='text-blue-500 underline'>Click here</a></p>
              <div className='flex justify-center pt-2'>
                <select className='border-2 border-black rounded-lg flex' value={statusFilters[complaint._id]} onChange={(e) => handleChangeStatusFilter(e, complaint._id)}>
                  <option value="all">All</option>
                  <option value="pending" disabled={complaint.status === 'pending'}>Pending</option>
                  <option value="in progress" disabled={complaint.status === 'in progress'}>In Progress</option>
                  <option value="completed" disabled={complaint.status === 'completed'}>Completed</option>
                </select>
              </div>
              {/* Submit button for each complaint */}
              <div className="text-center mt-3">
                <button onClick={() => handleSubmitStatusFilter(complaint._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Status</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;
