import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
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
    return (
        <div className=''>
            <div className="flex items-center justify-between p-4">
                <div className="text-lg font-semibold text-white">
                    PotBid Dashboard
                </div>
            </div>
            <nav className="px-4 py-8">
                <ul>
                    <li>
                        <Link to="/admin"
                            className="text-white block py-2 hover:text-gray-400"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/allusers/"
                            className="text-white block py-2 hover:text-gray-400"
                        >
                            Users
                        </Link>
                    </li>
                    <li>
                        <Link to="/admincomplaints/"
                            className="text-white block py-2 hover:text-gray-400"
                        >
                            Complaints
                        </Link>
                    </li>
                    <li>
                        <Link to="/admincontracts/"
                            className="text-white block py-2 hover:text-gray-400"
                        >
                            Contracts
                        </Link>
                    </li>
                    <li>
                        <Link to="/price/"
                            className="text-white block py-2 hover:text-gray-400"
                        >
                            Price Prediction
                        </Link>
                    </li>
                    <li>
                        <Link to=""
                        onClick={handleLogout}
                            className="text-white block py-2 hover:text-gray-400"
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar