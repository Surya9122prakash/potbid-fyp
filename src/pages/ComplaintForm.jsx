import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import PublicNav from "../components/PublicNav";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { AiFillMessage } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
// import LocationSearchInput from "../components/LocationSearchInput";
import GoogleMap from "../components/GoogleMap";
// import { MapContainer } from "../components/GoogleMap";

const ComplaintForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [road, setRoad] = useState("");
  const [location, setLocation] = useState(null);
  let navigate = useNavigate();
  const { user } = useUser();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleRoadChange = (e) => {
    setRoad(e.target.value);
  };

  const handleLocationChange = (location) => {
    setLocation(location);
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const token = Cookies.get("token");
    console.log("Token:", token);

    if (!token) {
      console.log("Token not found, form not submitted");
      return;
    }

    console.log("User:", user);
    console.log("Message:", message);

    if (!user || !message) {
      console.log("User not logged in or message not provided, form not submitted");
      return;
    }

    console.log( {
      userId: user._id,
      name: user.name,
      email: user.email,
      photo: 'cloudData.url',
      message: message,
      phone: phone,
      road: road,
      location: location,
    })

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "mystore");
      data.append("cloud_name", "dthytjb3h");

      console.log("Uploading file to Cloudinary...");
      const ress = await fetch(
        "https://api.cloudinary.com/v1_1/dthytjb3h/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await ress.json();
      console.log("Cloudinary response:", cloudData);

      // // Use Google Maps Geocoding API to get coordinates from the location string
      // console.log("Location:", location); // Add this line
      // const geocodingResponse = await axios.get(
      //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=your_key`
      // );

      // console.log("Geocoding response:", geocodingResponse); // Add this line

      // const coordinates = geocodingResponse.data.results[0].geometry.location;
      // console.log("Coordinates:", coordinates);

      console.log("Posting complaint to server...");
      const res = await axios.post(
        "http://localhost:5000/complaint/post",
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          photo: cloudData.url,
          message: message,
          phone: phone,
          road: road,
          location: location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Complaint posted successfully:", res.data);

      setFile(null);
      setMessage("");
      setPhone("");
      setRoad("");
      setLocation("");

      navigate("/complaints");

      // setPic(res.data.photo);
    } catch (err) {
      console.log(err)
      console.error("Error submitting form:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status code:", err.response.status);
        if (err.response.status === 401) {
          // Handle unauthorized error
          alert("You are not authorized to submit this complaint. Please log in.");
          // You can also redirect the user to the login page or take appropriate action
        } else if (err.response.status === 404) {
          // Handle not found error
          alert("The complaint endpoint could not be found.");
          // You might want to log this error for further investigation
        } else if (err.response.status === 500) {
          // Handle internal server error
          alert("Internal server error occurred. Please try again later.");
          // You might want to log this error for further investigation
        } else {
          // Handle other errors
          alert("An error occurred while submitting the complaint. Please try again later.");
          // You might want to log this error for further investigation
        }
      } else {
        // Handle other errors (e.g., network issues)
        alert("An unexpected error occurred. Please try again later.");
        // You might want to log this error for further investigation
      }
    }

  };



  return (
    <>
      <PublicNav />
      <div className="flex justify-center items-center h-fit pt-24 w-screen overflow-hidden">
        <div className="max-w-[800px] w-full overflow-hidden mx-auto bg-gradient-to-tr from-teal-300 to-blue-400 p-8 px-8 rounded-lg">
          <h2
            className="text-4xl text-white font-bold text-center pb-10"
          >
            Complaint
          </h2>
          <form onSubmit={handleSubmit}>
            <div
              className="flex flex-row text-white py-2"
            >
              <input
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                type="file"
                className="px-4"
              />
            </div>
            <div
              className="flex flex-row text-white py-2 px-4"
            >
              <div className="pt-4"><AiFillMessage size={40} /></div>
              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
              <div className="pl-4 w-screen">
                <textarea
                  className="rounded-lg bg-white mt-2 p-2 focus-border-blue-500 focus-bg-gray-800 focus-outline-none w-full focus:text-black text-black"
                  placeholder="Message"
                  value={message}
                  onChange={handleMessageChange}
                />
              </div>
            </div>
            <div
              className="flex flex-row py-2 px-4"
            >
              <div className="pt-4 pl-1.5 text-white"><FaPhoneAlt size={30} /></div>
              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
              <div className="pl-5 w-screen">
                <input
                  type="text"
                  className="rounded-lg bg-white mt-2 p-2 focus-border-blue-500 focus-bg-gray-800  w-[100%] focus-outline-none focus:text-black text-black"
                  placeholder="Phone"
                  value={phone}
                  onChange={handlePhoneChange}
                /></div>
            </div>
            <div
              className="flex flex-row text-white py-2 px-4"
            >
              <div className="pt-4 pl-1"><FaRoad size={40} /></div>
              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
              <div className="pl-2.5 w-screen">
                <input
                  type="text"
                  className="rounded-lg bg-white mt-2 p-2 focus-border-blue-500 focus-bg-gray-800 focus-outline-none w-[100%] focus:text-black text-black"
                  placeholder="Road"
                  value={road}
                  onChange={handleRoadChange}
                />
              </div>
            </div>
            <div
              className="py-2 pb-96 px-4">
              <GoogleMap setCords={(obj) => {
                console.log("=======================================================")
                console.log(obj)
                setLocation(obj)
              }}  />
              {/* <MapContainer setLocation={handleLocationChange} /> */}
            </div>
            <div className="flex justify-center">
              <button
                className="w-[30%] relative z-2 my-5 py-5 bg-gray-200 cursor-pointer shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-black font-semibold rounded-lg"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ComplaintForm;
