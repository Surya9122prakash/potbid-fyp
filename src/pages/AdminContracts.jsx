import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEye } from "react-icons/fa";
import { RiFileEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import Sidebar from "../components/Sidebar";

const AdminContracts = () => {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        fetchAllContracts();
    }, []);

    const fetchAllContracts = async () => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get("http://localhost:5000/contract/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContracts(response.data);
        } catch (error) {
            console.error("Error fetching contracts:", error);
        }
    };

    const handleDeleteContract = async (contractId) => {
        try {
            const token = Cookies.get("token");
            const response = await axios.delete(
                `http://localhost:5000/contract/${contractId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Delete response:", response.data);

            fetchAllContracts();
        } catch (error) {
            console.error("Error deleting contract:", error);
        }
    };

    const navigate = useNavigate();

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
            <div className="w-3/4">
                <h1 className="text-center text-xl font-bold underline pb-7">All Contracts</h1>
                <div className="grid grid-cols-3 gap-20 px-20">
                    {contracts.map((contract) => (
                        <div
                            key={contract._id}
                            className="bg-white py-4 px-5 mb-4 rounded shadow-xl h-fit w-fit"
                            style={{ maxWidth: "250px" }}
                        >
                            {/* Buttons */}
                            <div className="flex mb-2 gap-2 justify-end ">
                                <div className="">
                                    <button
                                        onClick={() => navigate(`/contract/${contract._id}`)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded-md"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/contract/edit/${contract._id}`)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md ml-2"
                                    >
                                        <RiFileEditFill />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDeleteContract(contract._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                            <div className="ml-auto pl-32">
                                <p
                                    className={`truncate ${contract.status === "completed"
                                        ? "bg-green-200"
                                        : contract.status === "on progress"
                                            ? "bg-yellow-200"
                                            : contract.status === "pending"
                                                ? "bg-red-200"
                                                : ""
                                        } w-fit p-2 rounded-full`}
                                >
                                    {contract.status}
                                </p>
                            </div>
                            {/* Contract information */}
                            <p className="truncate">Title: {contract.title}</p>
                            <p className="text-lg font-semibold">Company Name: {contract.company_name}</p>
                            <p className="text-lg font-semibold">Contract Budget: &#8377;{contract.price}</p>
                            <p className="text-lg font-semibold">Date: {contract.date}</p>
                            <p className="text-lg font-semibold">Location: {contract.location}</p>
                            <p className="text-lg font-semibold">Road: {contract.road}</p>
                            <p className="text-lg font-semibold">Predicted Price: &#8377;{contract.predicted_price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminContracts;
