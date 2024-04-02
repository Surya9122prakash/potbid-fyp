import React, { useState } from "react";
import { BiLogoGmail } from "react-icons/bi";
import { AiFillLock } from "react-icons/ai";
import axios from "axios";
import { Link ,useNavigate} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import toast from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // Import motion from framer-motion
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleForgot = async (e) => {
        e.preventDefault();
    
        if (email) {
            try {
                const response = await axios.post("http://localhost:5000/user/requestPasswordReset", { email: email, redirectUrl:"http://localhost:5173/passwordreset" });
                if (response.data.status === "FAILED") {
                    console.error(response.data.message);
                } else {
                    console.log("Password reset email sent successfully!!");
                    navigate(`/emailsent/${email}/${true}`);
                }
            } catch(error) {
                console.error("An Error Occurred: ", error);
            }
        } else {
            console.error("Please provide the email address to send the password reset mail!");
        }
    }    

    return (
        <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
                <div className="hidden sm:block">
                    <img
                        className="w-full h-full object-cover"
                        src="https://static.vecteezy.com/system/resources/previews/004/968/639/non_2x/password-has-been-reset-successfully-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
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
                            Password Reset
                        </motion.h2>
                        <form onSubmit={handleForgot}>
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
                                    placeholder="Enter your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 3 }}
                                className="flex justify-between text-gray-400 py-2 pl-10 font-semibold"
                            >
                                <Link to="/login">Already have an Account?</Link>
                                <Link to="/signup">Don't have an Account?</Link>
                            </motion.div>
                            <motion.button
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 4 }}
                                className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
                                type="submit"
                            >
                                Submit
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
