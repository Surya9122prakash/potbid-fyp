import React from 'react'
import CompanyNav from '../components/CompanyNav'
import { useNavigate } from "react-router-dom";

const Company = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen overflow-hidden">
      <CompanyNav />
      <div className="flex w-full overflow-hidden py-40 px-96 gap-10 bg-gradient-to-tr from-blue-300 to-pink-300 h-screen">
        <div className="w-full">
          <div
            className="relative h-full lg:flex cursor-pointer"
            onClick={() => {
              navigate("/mycontracts");
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-cover z-10 border-2 shadow-black shadow-2xl border-black rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://th.bing.com/th/id/OIP._4n5QoJGlQgEc61dXar8OwHaHa?rs=1&pid=ImgDetMain")',
                backgroundSize: "cover",
              }}
              title=""
            ></div>
            {/* <div className="relative w-full h-full bg-black z-50 bg-opacity-50 text-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-center items-center leading-normal">
              <div className="text-3xl font-bold">Contracts</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Company

