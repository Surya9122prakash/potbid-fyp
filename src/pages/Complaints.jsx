import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import { RiFileEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get("http://localhost:5000/complaint", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleDelete = async (complaintId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://localhost:5000/complaint/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(
        complaints.filter((complaint) => complaint._id !== complaintId)
      );
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <>
      <PublicNav/>
      <div style={{ display: "flex", justifyContent: "center" }} className="w-screen h-screen bg-gradient-to-tr from-blue-300 to-pink-300">
        <div>
          <h2 className="text-2xl font-bold">My Complaints:</h2>
          <div className="py-4 w-full flex flex-row gap-5">
            {complaints.map((complaint) => (
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
                // style={{ maxHeight: "200px" }}
              />
              {/* Buttons */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => navigate(`/complaints/${complaint._id}`)}
                  className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                >
                  <RiFileEditFill />
                </button>
                <button
                  onClick={() => handleDelete(complaint._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  <MdDelete />
                </button>
              </div>
              {/* Complaint information */}
              <p className="truncate">Name: {complaint.name}</p>
              <p className="truncate">Email: {complaint.email}</p>
              <p className="truncate">Message: {complaint.message}</p>
            </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaints;
