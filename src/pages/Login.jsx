import React, { useState } from "react";
import { BiLogoGmail } from "react-icons/bi";
import { AiFillLock } from "react-icons/ai";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toast from "react-toastify"
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      // Make the login request to the server
      const response = await axios.post(
        "http://localhost:5000/user/signin",
        { email, password } // Use the email and password from the state
      );
  
      console.log("Login response:", response.data); // Log the response data
  
      // Extract user data and token from the response
      const { data, token } = response.data;
  
      setUser(data)      

      // Set the token in the cookies
      Cookies.set("token", token);
  
      // Redirect based on the user's role
      if (data && data.role === "admin") {
        navigate("/admin");
      } else if (data && data.role === "company") {
        navigate("/company");
      } else if (data && data.role === "public") {
        navigate("/public");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
        <div className="hidden sm:block">
          <img
            className="w-full h-full object-cover"
            src="https://image.freepik.com/free-vector/login-concept-illustration_114360-739.jpg"
            alt="Login Background"
          />
        </div>
        <div className="bg-gradient-to-tr from-teal-300 to-rose-400 flex flex-col justify-center h-screen">
          <div className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl text-white font-bold text-center"
            >
              SIGN IN
            </motion.h2>
            <form onSubmit={handleLogin}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-row text-gray-400 py-2"
              >
                <div className="text-2xl pt-4">
                  <BiLogoGmail />
                </div>
                &nbsp; &nbsp;
                <input
                  className="rounded-lg bg-gray-700 mt-2 p-2 focus-border-blue-500 focus-bg-gray-800 focus-outline-none w-full"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2 }}
                className="flex flex-row text-gray-400 py-2"
              >
                <div className="text-2xl pt-4">
                  <AiFillLock />
                </div>
                &nbsp; &nbsp;
                <input
                  className="rounded-lg bg-gray-700 mt-2 p-2 focus-border-blue-500 focus-bg-gray-800 focus-outline-none w-full"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3 }}
                className="flex justify-between text-gray-400 py-2 pl-10 font-semibold"
              >
                <Link to="/forgotpassword">Forgot Password?</Link>
                <Link to="/signup">Don't have an Account?</Link>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 4 }}
                className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
                type="submit"
              >
                Sign In
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
