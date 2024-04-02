import React from "react";
import pothole from "../assets/pothole.png";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div>
      <div className="flex pt-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative"
        >
          <div className="h-screen relative">
            <img
              src={pothole}
              className="h-[600px] w-[800px] z-0"
              alt="Pothole"
            />
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex py-72 pl-[200px]">
            <h1 className="text-white text-5xl font-bold z-10">POTHOLES</h1>
          </div>
        </motion.div>
        {/* <div className="h-auto border-l-2 border-gray-400"></div> */}
        <div className="md:w-2/3 w-full md:px-12 px-5 py-20" id="About">
          <div className="text-xl">
            <h2 className="underline px-28 text-4xl">
              <b>Welcome to the Portal</b>
            </h2>
            <br />
            <p className="text-justify relative text-2xl w-[600px] pl-10">
              It's your go-to platform for tenders, feedback, complaints, and
              regulatory compliance. Tailored for companies, the public, and
              government agencies, PotBid offers a user-friendly experience to
              meet your unique needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
