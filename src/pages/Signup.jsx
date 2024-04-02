import React, { useState, useEffect } from "react";
import { BiSolidUser } from "react-icons/bi";
import { AiFillLock } from "react-icons/ai";
import { BiLogoGmail } from "react-icons/bi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    const userData = {
      name: username,
      email: email,
      password: password,
      role: role,
    };
    axios
      .post("http://localhost:5000/user/signup", userData)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          toast.success("Signup successful! and Verification email sent.");
          navigate("/login");
        } else if (response.data.status === "FAILED") {
          toast.error(response.data.message);
        } else {
          toast.error("An error occurred during signup.");
        }
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        toast.error("An error occurred during signup.");
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img
          className="w-full h-full object-cover"
          src="https://i.pinimg.com/736x/43/c0/47/43c04767dc84407724a508142c04e736.jpg"
          alt="Background"
        />
      </div>
      <div className="bg-gradient-to-tr from-teal-300 to-rose-400 flex flex-col justify-center h-screen">
        <form
          className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg"
          onSubmit={handleSignup}
        >
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl text-white font-bold text-center"
          >
            SIGN UP
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="flex flex-row text-gray-400 py-2"
          >
            <div className="text-2xl pt-4">
              <BiSolidUser />
            </div>
            &nbsp; &nbsp;
            <input
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none w-full"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="flex flex-row text-gray-400 py-2"
          >
            <div className="text-2xl pt-4">
              <BiLogoGmail />
            </div>
            &nbsp; &nbsp;
            <input
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none w-full"
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 4 }}
            className="flex flex-row text-gray-400 py-2"
          >
            <div className="text-2xl pt-4">
              <AiFillLock />
            </div>
            &nbsp; &nbsp;
            <input
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none w-full"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 5 }}
            className="flex text-gray-400 py-2"
          >
            <label className="text-2xl pt-3 font-semibold">Role</label>
            &nbsp; &nbsp;
            <input
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none w-full"
              type="text"
              placeholder="public or company"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 6 }}
            className="pl-20 pb-2 text-gray-400 font-semibold"
          >
            <NavLink to="/login">Already have an account?</NavLink>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 7 }}
            className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
