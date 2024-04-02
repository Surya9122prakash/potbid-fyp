import React from "react";
import Nav from "../components/Nav";
import { motion } from "framer-motion";
import pothole from "../assets/pothole.png";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <>
      <div className="">
        <Nav />
      </div>
      {/* <Hero /> */}
      <div className="h-[90vh] bg-gradient-to-r from-indigo-400 to-cyan-400">
        <div className="flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative"
          >
            <div className="h-screen relative pb-10">
              <img
                src={pothole}
                className=" pl-40 h-[500px] w-[1700px] z-0"
                alt="Pothole"
              />
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex py-60 pl-[320px]">
              <h1 className="text-white text-5xl font-bold z-10">POTHOLES</h1>
            </div>
          </motion.div>
          {/* <div className="h-auto border-l-2 border-gray-400"></div> */}
          <div className="md:w-full w-fit md:px-20 px-7 py-20" id="About">
            <div className="text-white p-4">
              <h2 className="underline px-10 text-4xl">
                <b>Welcome to the Portal!</b>
              </h2>
              <p className="text-justify text-2xl relative w-[450px] pl-12 px-1">
                It's your go-to platform for tenders, feedback, complaints, and
                regulatory compliance, tailored for companies, the public, and
                government agencies. PotBid offers a user-friendly experience to
                meet your unique needs, promoting efficiency and transparency in
                the process.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:px-20 lg:px-40 lg:flex-row w-full lg:left-1/2 lg:-translate-x-1/2 gap-20 lg:absolute mx-auto lg:-bottom-28  items-stretch justify-center">
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 5 }}
        >
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, delay: 6 }} // Adjusted delay for the first motion div
            className="h-auto w-5/4 mx-auto text-white font-thin flex flex-col justify-evenly items-center px-10 rounded-3xl bg-gradient-to-tr  from-blue-500 to-teal-400 shadow-2xl  text-xl text-left p-14"
          >
            <h1 className="text-3xl font-bold">Public</h1>
            <p className="w-full  text-md text-justify">
              Feedback Matters! Use this portal to share concerns, feedback, or compliments. We value your input and promptly address your issues. Your engagement fuels our continuous improvement.
            </p>
          </motion.div>
        </motion.div> */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, delay: 3 }} // Adjusted delay for the second motion div
            className="h-full w-5/4 mx-auto text-white font-thin flex flex-col justify-evenly items-center px-10 rounded-3xl bg-gradient-to-tr  from-blue-500 to-teal-400 shadow-2xl  text-xl text-left p-10"
          >
            <h1 className="text-3xl font-bold">Public</h1>
            <p className="w-full  text-md text-justify">
            Feedback Matters! Use this portal to share concerns, feedback, or compliments. We value your input and promptly address your issues. Your engagement fuels our continuous improvement.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
        >
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, delay: 5 }} // Adjusted delay for the second motion div
            className="h-full w-fit mx-auto text-white font-thin flex flex-col justify-evenly items-center rounded-3xl bg-gradient-to-tr  from-blue-500 to-teal-400 shadow-2xl  text-xl text-left p-10"
          >
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="w-full  text-md text-justify px-4">
              Discover and bid on the latest tender opportunities effortlessly.
              Our portal streamlines the bidding process, promoting transparency
              and efficiency. Let's collaborate for a brighter future.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 6 }}
        >
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, delay: 7 }} // Adjusted delay for the third motion div
            className="h-full w-full mx-auto text-white font-thin flex flex-col justify-evenly items-center px-10 rounded-3xl bg-gradient-to-tr  from-blue-500 to-teal-400 shadow-2xl  text-xl text-left py-10"
          >
            <h1 className="text-3xl font-bold">Government</h1>
            <p className="w-full  text-md text-justify">
              Admins ensure fairness and transparency in tendering. They
              regulate compliance, oversee evaluations, and maintain a level
              playing field for all participants.
            </p>
          </motion.div>
        </motion.div>
      </div>
      <div className="pt-60">
        <Contact />
      </div>
    </>
  );
};

export default Home;
