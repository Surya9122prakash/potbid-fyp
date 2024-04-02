// import React, { useState, useEffect } from "react";
// import Nav from "../components/Nav";
// import { motion } from "framer-motion";
// import { BiLogoGmail } from "react-icons/bi";
// import { useNavigate, Link } from "react-router-dom";
// import { BiSolidUser } from "react-icons/bi";
// import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
// import { RxDotFilled } from "react-icons/rx";
// import Cookies from "js-cookie";
// import { useUser } from "../context/UserContext";
// import axios from "axios";

// const Profile = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   let navigate = useNavigate();
//   const { user } = useUser();

//   const handleMessageChange = async (e) => {
//     setMessage(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
// console.log("Form submitted");
// const token = Cookies.get("token");
// if (!token) {
//   return;
// }
// if (!user || !message) {
//   // Validate if the user is logged in and required fields are present
//   return;
// }
// try {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("upload_preset", "mystore");
//   data.append("cloud_name", "dthytjb3h");
//   const ress = await fetch(
//     "https://api.cloudinary.com/v1_1/dthytjb3h/image/upload",
//     {
//       method: "POST",
//       body: data,
//     }
//   );

//   const cloudData = await ress.json();
//   // const post = {
//   //   userId: user._id,
//   //   name: user.username,
//   //   email: user.email,
//   //   photo: cloudData.url,
//   //   message: message,
//   // };
//   // console.log(post);
//   const res = await axios.post(
//     "http://localhost:5000/complaint/post",
//     {
//       userId: user._id,
//       name: user.name,
//       email: user.email,
//       photo: cloudData.url,
//       message: message,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//     {
//       withCredentials: true,
//     }
//   );
//   console.log(res.data);
//   // navigate();

//   setPic(res.data.photo);
// } catch (err) {
//   console.log(err);
// }
//   };

//   const slides = [
//     {
//       url: "http://th.bing.com/th/id/R.11a96778883a5dee200eb4ac7a06419d?rik=VQroFwymdZ2%2b3g&riu=http%3a%2f%2fs3.amazonaws.com%2fposttv-thumbnails%2fpotholes_16thHDR.jpeg&ehk=mwe77wsSgpy3UWabMaVouLmFnS23h%2fQpYnkSwa5TjD0%3d&risl=&pid=ImgRaw&r=0",
//     },
//     {
//       url: "http://th.bing.com/th/id/OIP.f89RU48MutAMqAqR-vlCngHaED?w=900&h=492&rs=1&pid=ImgDetMain",
//     },
//     {
//       url: "https://th.bing.com/th/id/OIP.kJfuttDTfkvwbNFi6W16zwHaFj?w=1024&h=768&rs=1&pid=ImgDetMain",
//     },
//     {
//       url: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80",
//     },
//     {
//       url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80",
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const prevSlide = () => {
//     const isFirstSlide = currentIndex === 0;
//     const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
//     setCurrentIndex(newIndex);
//   };

//   const nextSlide = () => {
//     const isLastSlide = currentIndex === slides.length - 1;
//     const newIndex = isLastSlide ? 0 : currentIndex + 1;
//     setCurrentIndex(newIndex);
//   };

//   const goToSlide = (slideIndex) => {
//     setCurrentIndex(slideIndex);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000); // Change the interval as needed (in milliseconds)

//     return () => clearInterval(interval);
//   }, [currentIndex]); // Reset interval on currentIndex change

//   return (
//     <div className="h-full w-full">
//       <Nav />
//       {/* <div>
//         <div
//           style={{
//             backgroundImage: `url(${slides[currentIndex].url})`,
//             height: "700px",
//           }}
//           className="w-full rounded-2xl bg-center bg-cover duration-500"
//         ></div>
//         <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
//           <BsChevronCompactLeft onClick={prevSlide} size={30} />
//         </div>
//         <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
//           <BsChevronCompactRight onClick={nextSlide} size={30} />
//         </div>
//         <div className="flex top-4 justify-center py-2">
//           {slides.map((slide, slideIndex) => (
//             <div
//               key={slideIndex}
//               onClick={() => goToSlide(slideIndex)}
//               className="text-2xl cursor-pointer"
//             >
//               <RxDotFilled />
//             </div>
//           ))}
//         </div>
//       </div> */}
//       <div className="flex justify-center items-center h-full pt-40">
//         <div className="max-w-[400px] w-full mx-auto bg-gradient-to-tr from-teal-300 to-blue-400 p-8 px-8 rounded-lg">
//           <motion.h2
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             className="text-4xl text-white font-bold text-center"
//           >
//             Complaint
//           </motion.h2>
//           <form onSubmit={handleSubmit}>
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1, delay: 3 }}
//               className="flex flex-row text-white py-2"
//             >
//               <input
//                 onChange={async (e) => {
//                   setFile(e.target.files[0]);
//                 }}
//                 type="file"
//                 className="px-4"
//               />
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1, delay: 3 }}
//               className="flex flex-row text-white py-2"
//             >
//               <div className="text-2xl pt-4">Message</div>
//               &nbsp; &nbsp;
//               <textarea
//                 className="rounded-lg bg-white mt-2 p-2 focus-border-blue-500 focus-bg-gray-800 focus-outline-none w-full"
//                 placeholder="Message"
//                 value={message}
//                 onChange={handleMessageChange}
//               />
//             </motion.div>
//             <motion.button
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1, delay: 4 }}
//               className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
//               type="submit"
//             >
//               Submit
//             </motion.button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import PublicNav from "../components/PublicNav";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";
import axios from "axios";
const Profile = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen overflow-hidden">
      <PublicNav />
      <div className="flex w-screen overflow-hidden py-40 px-20 gap-10 bg-gradient-to-tr from-blue-300 to-pink-300 h-screen">
        <div className="w-full">
          <div
            className="relative h-80 lg:flex cursor-pointer"
            onClick={() => {
              navigate("/complaintform");
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full z-10 border-2 shadow-black shadow-2xl border-black rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
              style={{
                backgroundImage:
                  'url("http://www.thecarexpert.co.uk/wp-content/uploads/2018/03/large-potholes-uk-roads.jpg")',
                backgroundSize: "cover",
              }}
              title="Woman holding a mug"
            ></div>
            <div className="relative w-full h-full bg-black z-50 bg-opacity-50 text-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-center items-center leading-normal">
              <div className="text-3xl font-bold">Report Potholes</div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div
            className="relative h-80 lg:flex cursor-pointer"
            onClick={() => {
              navigate("/complaints");
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full z-10 border-2 shadow-black shadow-2xl border-black rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://image.freepik.com/free-vector/contact-us-concept-illustration_278696-3.jpg")',
                backgroundSize: "cover",
              }}
              title="Woman holding a mug"
            ></div>
            <div className="relative w-full h-full bg-black z-50 bg-opacity-50 text-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-center items-center leading-normal">
              <div className="text-3xl font-bold">My Complaints</div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div
            className="relative h-80 lg:flex cursor-pointer"
            onClick={() => {
              navigate("/contracts");
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full z-10 border-2 shadow-black shadow-2xl border-black rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://th.bing.com/th/id/R.25c5812151f1ceeda5773f0e67e807f4?rik=bpHiw1Qf5HSxrg&riu=http%3a%2f%2fmedia.istockphoto.com%2fvectors%2fset-of-four-different-contracts-different-backgrounds-vector-il-vector-id474279466%3fk%3d6%26m%3d474279466%26s%3d612x612%26w%3d0%26h%3dIYl2DxmdCaS-O5IOVz9Lhw61rDObq9dkYIgn3qJP2XQ%3d&ehk=Yo0f6NDeOXKL3OrFO1nqEsKCocUkG2vdSvDD8BFdsUk%3d&risl=&pid=ImgRaw&r=0")',
                backgroundSize: "cover",
              }}
              title="Woman holding a mug"
            ></div>
            <div className="relative w-full h-full bg-black z-50 bg-opacity-50 text-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-center items-center leading-normal">
              <div className="text-3xl font-bold">Contracts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
