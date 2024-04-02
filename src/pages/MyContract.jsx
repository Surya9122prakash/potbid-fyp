import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CompanyNav from '../components/CompanyNav';
import { useParams } from 'react-router-dom';

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const userId = useParams();
  const token = Cookies.get("token");

  useEffect(() => {
    if (userId) {
      const fetchContracts = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/contract/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setContracts(response.data);
        } catch (error) {
          console.error('Error fetching contracts:', error);
        }
      };

      fetchContracts();
    }
  }, [token, userId]);

  return (
    <div className='overflow-hidden'>
      <CompanyNav />
      <div className="h-screen w-screen bg-gradient-to-tr from-blue-300 to-pink-300">
        <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", textDecoration: "underline" }}>My Contracts</h1>
        <div className="px-20 py-10 ">
          <div className="grid grid-cols-4 gap-10">
            {contracts.map((contract) => (
              <div key={contract._id} className="border rounded-lg bg-white overflow-hidden shadow-lg shadow-black">
                <div className="p-4 shadow-md"> {/* Add shadow-md class to apply shadow */}
                  <h2 className="text-xl font-bold mb-2 capitalize">{contract.title}</h2>
                  <p className="text-gray-600">Company Name: {contract.company_name}</p>
                  <p className="text-gray-600">Contract Budget: &#8377;{contract.price}</p>
                  <p className="text-gray-600">Date: {contract.date}</p>
                  <p className="text-gray-600">Location: {contract.location}</p>
                  <p className="text-gray-600">Road: {contract.road}</p>
                  <p className="text-gray-600">Status:
                    <p className={`truncate capitalize ${contract.status === "completed"
                      ? "bg-green-200"
                      : contract.status === "in progress"
                        ? "bg-yellow-200"
                        : contract.status === "pending"
                          ? "bg-red-200"
                          : ""
                      } w-fit p-2 rounded-full`}>
                      {contract.status}
                    </p>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyContracts;
