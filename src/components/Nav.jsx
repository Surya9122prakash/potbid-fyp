// Nav.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; 

const Nav = () => {
  const { user, setUser } = useUser(); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    setLoading(false); 
  }, []);

  console.log("User object:", user);

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");

      await axios.get("http://localhost:5000/user/logout", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Cookies.remove("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <nav
      className="p-4 bg-gradient-to-r from-indigo-400 to-cyan-400 overflow-hidden"
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
            <a href="/contact" className="text-white font-bold">
              Contact
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
                <a href="/profile" className="text-white font-bold">
                  Profile
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

export default Nav;
