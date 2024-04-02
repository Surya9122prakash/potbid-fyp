import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaEye } from "react-icons/fa";
import Sidebar from '../components/Sidebar';
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]); // Initialize to null

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get('http://localhost:5000/user/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error state
      }
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

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
        <h1 className='text-xl font-bold text-center underline pb-10'>Users</h1>
        <div className='grid grid-cols-4 gap-40 px-20'>
          {users && users.map(user => ( // Check if users is truthy before mapping
            <div
              key={user._id}
              className="bg-white py-4 px-5 mb-4 rounded shadow-xl h-fit w-fit"
              style={{ maxWidth: "250px" }}
            >
              {/* Buttons */}
              <div className="flex justify-end mb-2">
                {user._id && (
                  <button
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    <FaEye />
                  </button>
                )}

                {/* <button
              onClick={() => handleDeleteUser(user._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md"
            >
              Delete
            </button> */}
              </div>
              {/* User information */}
              <p className="truncate">Name: {user.name}</p>
              <p className="truncate">Email: {user.email}</p>
              <p className="truncate">Role: {user.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
