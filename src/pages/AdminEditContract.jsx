import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdminEditContract = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contractData, setContractData] = useState({
    title: "",
    company: "",
    date: "",
    location: "",
    status: "",
  });

  useEffect(() => {
    fetchContractDetails();
  }, []);

  const fetchContractDetails = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`http://localhost:5000/contract/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setContractData(data);
    } catch (error) {
      console.error("Error fetching contract details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContractData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      await axios.put(`http://localhost:5000/contract/${id}`, contractData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, you can redirect the user to another page after successful submission
      navigate("/admin");
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 border rounded-md">
        <h1 className="text-2xl mb-4 px-28 w-full">Edit Contract</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={contractData.title}
              onChange={handleChange}
              className="border w-full py-2 px-3 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={contractData.company}
              onChange={handleChange}
              className="border w-full py-2 px-3 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={contractData.date ? contractData.date.split("T")[0] : ""}
              onChange={handleChange}
              className="border w-full py-2 px-3 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={contractData.location}
              onChange={handleChange}
              className="border w-full py-2 px-3 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label>Status:</label>
            <select
              name="status"
              value={contractData.status}
              onChange={handleChange}
              className="border w-full py-2 px-3 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Update Contract
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminEditContract;
