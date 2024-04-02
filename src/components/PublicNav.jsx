// Nav.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useHistory from React Router

const PublicNav = () => {
  const { user, setUser } = useUser(); // Include setUser from UserContext
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the history object

  useEffect(() => {
    setLoading(false); // Set loading to false when component mounts
  }, []);

  console.log("User object:", user);

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");

      // Send a request to invalidate the user's token on the server
      await axios.get("http://localhost:5000/user/logout", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the token from the client side
      Cookies.remove("token");

      // Update the user context to null
      setUser(null);

      // Redirect to the login page after logout without causing a reload
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle the error here, e.g., display an error message to the user
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while user data is being fetched
  }

  return (
    <nav
      className="p-4 bg-gradient-to-r from-indigo-400 to-cyan-400"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-3xl">PotBid</div>
        <ul className="flex space-x-4 text-2xl">
          <li>
            <a href="/" className="text-white font-bold">
              Home
            </a>
          </li>
          <div className="h-auto border-l-2 border-white"></div>
          <li>
            <a href="/public" className="text-white font-bold">
              Public
            </a>
          </li>
          <div className="h-auto border-l-2 border-white"></div>
          {user ? (
            <>
              <li>
                <a href="/profile" className="text-white font-bold">
                  Welcome, {user.name}
                </a>
              </li>
              <div className="h-auto border-l-2 border-white"></div>
              <li>
                <a href="/complaintform" className="text-white font-bold">
                  Raise Complaint
                </a>
              </li>
              <div className="h-auto border-l-2 border-white"></div>
              <li>
                <a href="/complaints" className="text-white font-bold">
                  My Complaints
                </a>
              </li>
              <div className="h-auto border-l-2 border-white"></div>
              <li>
                <a href="/contracts" className="text-white font-bold">
                  Contracts
                </a>
              </li>
              <div className="h-auto border-l-2 border-white"></div>
              <li>
                <button onClick={handleLogout} className="text-white font-bold">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login" className="text-white font-bold">
                  Login
                </a>
              </li>
              <div className="h-auto border-l-2 border-white"></div>
              <li>
                <a href="/signup" className="text-white font-bold">
                  Signup
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default PublicNav;
