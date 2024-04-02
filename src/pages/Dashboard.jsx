import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MdTitle } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaRoad } from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import { RiFileEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [statusFilters, setStatusFilters] = useState({});
  const [roads, setRoads] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState("");


  const navigate = useNavigate();
  const token = Cookies.get('token');

  const handleChangeStatusFilter = (e, complaintId) => {
    const { value } = e.target;
    setStatusFilters(prevFilters => ({
      ...prevFilters,
      [complaintId]: value,
    }));
  };

  const handleSubmitStatusFilter = async (complaintId) => {
    try {
      await axios.put(`http://localhost:5000/complaint/status/${complaintId}`, {
        status: statusFilters[complaintId],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Status filter for complaint ${complaintId} updated successfully.`);

      // Fetch updated complaints after updating status
      const response = await axios.get('http://localhost:5000/complaint/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedComplaints = response.data;
      setComplaints(updatedComplaints);

      // Update status filters based on the updated complaints
      const updatedStatusFilters = updatedComplaints.reduce((acc, complaint) => {
        acc[complaint._id] = statusFilters[complaint._id] || 'all'; // Preserve existing filters
        return acc;
      }, {});
      setStatusFilters(updatedStatusFilters);
    } catch (error) {
      console.error(`Error updating status filter for complaint ${complaintId}:`, error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUsers();
    fetchComplaints();
    fetchAllContracts();
    fetchCompanies();
    fetchRoads();
    console.log("sr: ", selectedRoad);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:5000/user/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:5000/user/company", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Companies:", response.data); // Log the response data
      setCompanies(response.data);
      // console.log("Updated Companies state:", companies); // Log the updated companies state
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };


  const fetchComplaints = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`http://localhost:5000/complaint/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/user/${userId}`
      );
      console.log("Delete response:", response.data);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const displayedUsers = users.slice(0, 5);
  const displayedComplaints = complaints.slice(0, 4);
  const displayedContracts = contracts.slice(0, 4);

  const [contractData, setContractData] = useState({
    title: "",
    company_id: "",
    company_name: "",
    date: "",
    price: "",
    location: "",
    road: "",
    status: "pending",
  });

  const fetchRoads = async () => {
    try {
      const response = await axios.get("http://localhost:5000/predictprice/roads");
      setRoads(response.data);
    } catch (error) {
      console.error("Error fetching roads:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company_id") {
      console.log("Companies state:", companies); // Log the companies state
      const selectedCompanyName = companies.find(company => company._id === value)?.name || '';
      console.log("Selected Company ID:", value);
      console.log("Selected Company Name:", selectedCompanyName);
      setContractData(prevData => {
        const newData = {
          ...prevData,
          company_id: value,
          company_name: selectedCompanyName,
        };
        console.log("Updated Contract Data:", newData); // Log the updated contractData
        return newData;
      })
    }
    else if (name === "road") {
      setSelectedRoad(value)
    }
    else {
      setContractData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      console.log(contractData);

      const predictionResponse = await axios.get(`http://localhost:5000/predictprice/${selectedRoad}`);
      const predictedPrice = predictionResponse.data.predicted_price;

      // Ensure company_name is set correctly in contractData
      const selectedCompany = companies.find(company => company._id === contractData.company_id);
      const company_name = selectedCompany ? selectedCompany.name : '';

      const contractDataWithCompanyName = {
        ...contractData,
        road:selectedRoad,
        company_name: company_name,
        predicted_price: predictedPrice
      };

      console.log(contractDataWithCompanyName)

      await axios.post("http://localhost:5000/contract/", contractDataWithCompanyName, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setContractData({
        title: "",
        company_id: "",
        company_name: "",
        date: "",
        price: "",
        location: "",
        road: "",
        status: "",
      });

      fetchAllContracts();
    } catch (error) {
      console.error("Error adding contract:", error);
      console.log("Error response data:", error.response.data); // Log response data
      console.log("Error status:", error.response.status); // Log status code
    }
  };

  const fetchAllContracts = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`http://localhost:5000/contract/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContracts(res.data);
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
      // Update the UI or fetch contracts again to reflect the changes
      fetchAllContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex overflow-hidden">
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
      <div className="w-3/4 py-10 ">
        {/* Main content */}
        <div className="">

        </div>
        <div className="justify-between flex">
          <h1 className="text-black font-bold text-2xl underline">Users</h1>
          <div className="cursor-pointer" onClick={() => navigate("/allusers/")}>
            <h1 className="text-black font-normal text-lg underline pr-40">View All</h1>
          </div>

        </div>
        <div className="py-4 w-full flex flex-row gap-5">
          {displayedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white py-4 px-5 mb-4 rounded shadow-xl h-fit w-fit"
              style={{ maxWidth: "250px" }}
            >
              {/* Buttons */}
              <div className="flex justify-end mb-2 h-8">
                {user._id && (
                  <button
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    <FaEye />
                  </button>
                )}
                {user.role === "company" && (
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    <MdDelete />
                  </button>)}
              </div>
              {/* User information */}
              <p className="truncate"><strong className="font-bold">Name: </strong>{user.name}</p>
              <p className="truncate"><strong className="font-bold">Email:</strong> {user.email}</p>
              <p className="truncate"><strong className="font-bold">Role: </strong>{user.role}</p>
            </div>
          ))}
        </div>
        <div className="justify-between flex">
          <h1 className="text-black font-bold text-2xl underline">Complaints</h1>
          <div className="cursor-pointer" onClick={() => navigate("/admincomplaints/")}>
            <h1 className="text-black font-normal text-lg underline pr-40">View All</h1>
          </div>
        </div>
        <div className="py-4 w-full flex flex-row gap-5">
          {displayedComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white py-4 px-5 mb-4 rounded shadow-xl h-fit w-fit"
              style={{ maxWidth: "250px" }}
            >
              <img
                src={complaint.photo}
                alt="Complaint Photo"
                className="mb-2 rounded-md w-full h-40"
                style={{ maxHeight: "200px" }}
              />
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => navigate(`/complaint/${complaint._id}`)}
                  className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                >
                  <FaEye />
                </button>
              </div>
              <div className="flex py-1 justify-end">
                <p
                  className={`truncate capitalize ${complaint.status === "completed"
                    ? "bg-green-200"
                    : complaint.status === "in progress"
                      ? "bg-yellow-200"
                      : complaint.status === "pending"
                        ? "bg-red-200"
                        : ""
                    } w-fit p-2 rounded-full`}
                >
                  {complaint.status}
                </p>
              </div>
              {/* Complaint information */}
              <p className="truncate"><strong>Name:</strong> {complaint.name}</p>
              <p className="truncate"><strong>Email:</strong> {complaint.email}</p>
              <p className="truncate"><strong>Message:</strong> {complaint.message}</p>
              <p className="truncate"><strong>Phone:</strong> {complaint.phone}</p>
              <p className="truncate"><strong>Address:</strong> {complaint.location.address}</p>
              <p className="truncate"><strong>Coordinates:</strong> {complaint.location.coordinates}</p>
              <p className="truncate"><strong>Road:</strong> {complaint.road}</p>
              <p className='truncate'><strong>Maps:</strong> <a href={`https://maps.google.com/?q=${complaint.location.coordinates[0]},${complaint.location.coordinates[1]}`} className='text-blue-500 underline'>Click here</a></p>
              <div className='flex justify-center pt-2'>
                <select className='border-2 border-black rounded-lg flex' value={statusFilters[complaint._id]} onChange={(e) => handleChangeStatusFilter(e, complaint._id)}>
                  <option value="all">Status</option>
                  <option value="pending" disabled={complaint.status === 'pending'}>Pending</option>
                  <option value="in progress" disabled={complaint.status === 'in progress'}>In Progress</option>
                  <option value="completed" disabled={complaint.status === 'completed'}>Completed</option>
                </select>

              </div>
              {/* Submit button for each complaint */}
              <div className="text-center mt-3">
                <button onClick={() => handleSubmitStatusFilter(complaint._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Update Status</button>
              </div>
            </div>
          ))}
        </div>
        <h1 className="text-black font-bold text-2xl underline">
          Add Contracts
        </h1>
        <div className="lg:pl-40 px-10 w-[90%] ">
          <div className=" lg:w-full w-screen lg:pr-0 pr-20 lg:pt-3 pb-20">
            <form
              className="bg-gradient-to-tr from-teal-300 to-blue-400 shadow-2xl shadow-blue-600 rounded-3xl flex flex-col flex-start lg:w-3/5 w-6/5 text-md text-center items-center"
              onSubmit={handleSubmit}
            >
              <div>
                <h1 className="text-4xl text-white font-bold pt-10">
                  Add Contract
                </h1>
              </div>
              <div className="flex flex-row pt-10 lg:px-0 px-2">
                <div className="flex gap-3">
                  <MdTitle color="white" size={55} />
                  <input
                    className="w-[93%] h-10 p-7 outline-none rounded border-b text-slate-800"
                    type="text"
                    name="title"
                    value={contractData.title}
                    onChange={handleChange}
                    placeholder="Contract Title"
                  />
                </div>
              </div>
              <br />
              <div className="flex flex-row lg:px-0 px-2 overflow-hidden">
                <div className="flex overflow-hidden">
                  <div className="w-screen flex justify-center gap-3 overflow-hidden">
                    <MdDriveFileRenameOutline color="white" size={50} />
                    <select
                      className="w-[16.5%] h-full outline-none rounded border-b text-slate-800"
                      name="company_id"
                      value={contractData.company_id} // Set the value of the select tag
                      onChange={handleChange}
                    >
                      <option>Select a Company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <br />
              <div className="flex flex-row lg:px-0 px-2">
                <div className="flex gap-3 pr-8 w-screen justify-center pl-7">
                  <MdDateRange color="white" size={50} />
                  <input
                    className="w-[17%] h-[60%] p-7 outline-none rounded border-b text-slate-800"
                    type="date"
                    name="date"
                    value={contractData.date}
                    onChange={handleChange}
                    placeholder="Date"
                  />
                </div>
              </div>
              <div className="flex flex-row lg:px-0 px-2">
                <div className="flex gap-3">
                  <MdTitle color="white" size={55} />
                  <input
                    className="w-[93%] h-10 p-7 outline-none rounded border-b text-slate-800"
                    type="number"
                    name="price"
                    value={contractData.price}
                    onChange={handleChange}
                    placeholder="Contract Price"
                  />
                </div>
              </div>
              <br />
              <div className="flex flex-row lg:px-0 px-2">
                <div className="pl-2 flex gap-3">
                  <CiLocationOn color="white" size={50} />
                  <input
                    className="w-[100%] h-[60%] p-7 outline-none rounded border-b text-slate-800"
                    type="text"
                    name="location"
                    value={contractData.location}
                    onChange={handleChange}
                    placeholder="Location"
                  />
                </div>
              </div>
              <div className="flex flex-row lg:px-0 px-2">
                <div className=" flex gap-3 w-screen justify-center">
                  <FaRoad color="white" size={50} />
                  {/* <input
                    className="w-[100%] h-[60%] p-7 outline-none rounded border-b text-slate-800"
                    type="text"
                    name="road"
                    value={contractData.road}
                    onChange={handleChange}
                    placeholder="Road"
                  /> */}
                  <select name="road" value={contractData.road || selectedRoad} onChange={handleChange} className="w-[16.5%] h-[100%] outline-none rounded border-b text-slate-800">
                    <option value="">Select a road</option>
                    {roads.map((road, index) => (
                      <option key={road._id} value={road.road}>{road.road}</option>
                    ))}
                  </select>
                </div>
              </div>
              <br />
              <div className="flex flex-row lg:px-0 px-2">
                <div className="pl-2 flex gap-3 w-screen justify-center">
                  <GrStatusInfo color="white" size={40} />
                  <select
                    className="w-[16.5%] h-[100%] outline-none rounded border-b text-slate-800"
                    name="status"
                    value={contractData.status}
                    onChange={handleChange}
                  >
                    <option value="complete">Complete</option>
                    <option value="in progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <br />
              <div className="lg:px-10 px-10">
                <input
                  className="mt-5 cursor-pointer rounded-full bg-white w-40 text-slate-800 font-bold border-none h-10 text-xl"
                  type="submit"
                  value="Add Contract"
                />
              </div>
              <br />
            </form>
          </div>
        </div>
        <div className="justify-between flex">
          <h1 className="text-black font-bold text-2xl underline">Contracts</h1>
          <div className="cursor-pointer" onClick={() => navigate("/admincontracts/")}>
            <h1 className="text-black font-normal text-lg underline pr-40">View All</h1>
          </div>
        </div>
        <div className="py-4 w-full flex flex-row gap-5">
          {displayedContracts.map((contract) => (
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
                </p>
              </div>
              {/* Contract information */}
              <p className="truncate">Title: {contract.title}</p>
              <p className="truncate">Company Name: {contract.company_name}</p>
              <p className="truncate">Contract Budget: &#8377;{contract.price}</p>
              <p className="truncate">Date: {contract.date}</p>
              <p className="truncate">Location: {contract.location}</p>
              <p className="truncate">Road: {contract.road}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
