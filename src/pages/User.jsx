import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion"

const User = () => {
  const { id } = useParams();
  console.log(id);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`http://localhost:5000/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null); // Set user to null to indicate error
      }
    };
    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

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
      <div className="w-3/4 border-none justify-center items-center flex">
        <div className="max-w-sm  mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4">
            <div className="font-bold text-xl mb-2">User Details</div>
            <p className="text-gray-700 text-base mb-2">Name: {user.name}</p>
            <p className="text-gray-700 text-base mb-2">Email: {user.email}</p>
            <p className="text-gray-700 text-base mb-2">Role: {user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
