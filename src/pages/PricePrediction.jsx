import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { motion } from "framer-motion"
// import Cookies from 'js-cookie';

const PricePrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [price, setPrice] = useState('');
  const [roads, setRoads] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState('');

  useEffect(() => {
    fetchRoads();
    console.log("road: ",selectedRoad)
  }, []);

  const fetchRoads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/roads');
      setRoads(response.data.roads);
    } catch (error) {
      console.error('Error fetching roads:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('video_file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setVideoSrc(`data:video/mp4;base64,${response.data.video_base64}`);
      setPrice(response.data.total_repair_cost)


      const submit = await axios.post("http://localhost:5000/predictprice",{
        road:selectedRoad,
        predicted_price:response.data.total_repair_cost
      })
      console.log(submit)
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred while uploading the file.');
    }
  };

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
      <div className='w-3/4 '>
        <div className='flex flex-col w-full h-full justify-center items-center'>
          <div className='border-2 border-black p-10 flex flex-col justify-center items-center'>
            <h1 className='font-bold text-xl py-6'>Please Upload the Drone footage</h1>
            <div className='flex flex-col px-10 pl-40'>
              <div className='pb-5'>
                <select value={selectedRoad} onChange={(e) => setSelectedRoad(e.target.value)} className="border-2 border-black">
                  <option value="">Select Road</option>
                  {roads.map((road, index) => (
                    <option key={index} value={road}>
                      {road}
                    </option>
                  ))}
                </select>
              </div>
              <input type="file" className='pb-6' onChange={handleFileChange} />
              <div className='px-10'><button className='bg-black text-white w-[50%] p-2' onClick={handleUpload}>Upload</button></div>
            </div>
            <div className='pt-10'>
              {message && <p>{message}</p>}
              {videoSrc && (
                <video controls width="500" height="auto">
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {price && <p>Potholes Repair Cost: {price}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
