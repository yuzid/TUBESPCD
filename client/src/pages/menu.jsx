import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/spooky-house-in-the-woods.png";

const MainMenu = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/game");
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h1 className="text-4xl font-bold mb-10 text-white drop-shadow-md">
        Your Last Gaze
      </h1>
      <button
        onClick={handleStart}
        className="px-6 py-3 text-lg font-medium text-white border-2 border-white rounded-md hover:bg-white hover:text-black transition duration-200 cursor-pointer"
      >
        Start
      </button>
    </div>
  );
};

export default MainMenu;
