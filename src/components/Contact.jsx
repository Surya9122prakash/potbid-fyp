import React, { useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { BiSolidUser, BiMessageAltDetail, BiLogoGmail } from "react-icons/bi";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ct6a8nb",
        "template_qstov3o",
        form.current,
        "vZfAR2FTJ2HYT4NXY"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="lg:pl-40 px-10 w-[90%] ">
      <div
        className="lg:pl-96 lg:w-full w-screen lg:pr-0 pr-20 lg:pt-3 pb-20"
      >
        <form
          className="bg-gradient-to-tr from-teal-300 to-blue-400 shadow-2xl shadow-blue-600 rounded-3xl flex flex-col flex-start lg:w-3/5 w-6/5 text-md text-center items-center"
          ref={form}
          onSubmit={sendEmail}
        >
          <div><h1 className="text-4xl text-white font-bold pt-10">Contact Us</h1></div>
          <div className="flex flex-row pt-10 lg:px-0 px-2">
            <div className="">
              <BiSolidUser size={60} fill="white" />
            </div>
            &nbsp; &nbsp; &nbsp;
            <div>
              <input
                className="w-[93%] h-10 p-7 outline-none rounded border-b text-slate-800"
                type="text"
                name="user_name"
                placeholder="Enter Your Name"
              />
            </div>
          </div>
          <br />
          <div className="flex flex-row lg:px-0 px-2">
            <div>
              <BiLogoGmail size={60} fill="white" />
            </div>
            &nbsp; &nbsp; &nbsp;
            <div>
              <input
                className="w-[93%] h-10 p-7 outline-none rounded border-b text-slate-800"
                type="email"
                name="user_email"
                placeholder="Enter Your Email"
              />
            </div>
          </div>
          <br />
          <div className="flex flex-row lg:px-0 px-2">
            <div className="">
              <BiMessageAltDetail size={60} fill="white" />
            </div>
            &nbsp; &nbsp; &nbsp;
            <div className="pr-1">
              <textarea
                className="w-[100%] h-full p-7 outline-none rounded border-b text-slate-800"
                name="message"
                placeholder="Enter Your Message"
              />
            </div>
          </div>
          <br />
          <div className="lg:px-10 px-10">
            <input
              className="mt-5 cursor-pointer rounded-full bg-white w-40 text-slate-800 font-bold border-none h-10 text-xl"
              type="submit"
              value="Send"
            />
          </div>
          <br />
        </form>
      </div>
    </div>
  );
};

export default Contact;
