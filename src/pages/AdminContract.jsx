import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion"

const AdminContract = () => {
  const [contract, setContract] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchContract = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/contract/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setContract(response.data);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };

    fetchContract();
  }, [id]);

  return (
    <div className="flex h-screen">
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
      <div className="flex flex-col w-3/4 justify-center items-center h-full">
        <h1 className="text-2xl font-bold mb-4">Contract Details</h1>
        <div className="bg-white rounded shadow-xl p-6 max-w-md">
          <p className="text-lg font-semibold">Title: {contract.title}</p>
          <p className="text-lg font-semibold">Company Name: {contract.company_name}</p>
          <p className="text-lg font-semibold">Contract Budget: &#8377;{contract.price}</p>
          <p className="text-lg font-semibold">Date: {contract.date}</p>
          <p className="text-lg font-semibold">Location: {contract.location}</p>
          <p className="text-lg font-semibold">Road: {contract.road}</p>
          <p className="text-lg font-semibold">Status: <p
            className={`truncate capitalize ${contract.status === "completed"
              ? "bg-green-200"
              : contract.status === "in progress"
                ? "bg-yellow-200"
                : contract.status === "pending"
                  ? "bg-red-200"
                  : ""
              } w-fit p-2 rounded-full`}
          >
            {contract.status}
          </p></p>
          {/* Add any additional fields here */}
        </div>
      </div>
    </div>
  );
};

export default AdminContract;
