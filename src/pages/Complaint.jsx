import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const Complaint = () => {
  const { id } = useParams(); // Access the complaintId from URL params
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      if (id) {
        try {
          const token = Cookies.get("token");
          const res = await axios.get(`http://localhost:5000/complaint/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(res.data)
          setComplaint(res.data);
        } catch (error) {
          console.error("Error fetching complaint:", error);
          setError("Failed to fetch complaint details. Please try again later.");
        }
      }
    };
    // alert("hi")

    fetchComplaint();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2 className="w-screen text-center font-bold text-2xl underline">Complaint Details:</h2>
          <div className="flex justify-center items-center">
            {complaint ? (
              <div
                key={complaint._id}
                className="bg-white py-4 px-2 mb-4 rounded shadow-xl h-fit w-screen" 
                style={{ maxWidth: "250px" }}
              >
                {/* Photo */}
                <img
                  src={complaint.photo}
                  alt="Complaint Photo"
                  className="mb-2 rounded-md w-full"
                  style={{ maxHeight: "200px" }}
                />
                <div>
                  <p><strong>Name:</strong> {complaint?.name}</p>
                  <p><strong>Email:</strong> {complaint?.email}</p>
                  <p><strong>Message:</strong> {complaint?.message}</p>
                  <p><strong>Phone:</strong> {complaint?.phone}</p>
                  <p><strong>Location:</strong> {complaint?.location?.address}</p>
                  <p><strong>Road:</strong> {complaint?.road}</p>
                  <p><strong>Coordinates:</strong>[{complaint?.location?.coordinates[0]},&nbsp;{complaint?.location?.coordinates[1]}]</p>
                  {/* Add more details as needed */}
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;
