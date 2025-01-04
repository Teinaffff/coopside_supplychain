import React from "react";
import { Button } from "../../../common/ui/button";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "../../../assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div
      className="py-20 mt-[72px] bg-fit bg-center bg-no-repeat relative min-h-[500px]"
      id="home"
      style={{
        backgroundImage: `url(${IMAGES.heroRectangle})`,
        backgroundSize: "1440px 525px",
        backgroundPosition: "left bottom",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="bg-cyan-600 text-white px-6 py-2 rounded-full inline-flex items-center shadow-lg">
            <span className="text-sm font-medium">
              Empowering Communities Together
            </span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600 animate-fade-in [animation-delay:200ms]">
          Building a Stronger Ethiopia <br />
          Through Cooperation
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in [animation-delay:400ms]">
          Join our cooperative union and be part of a movement that transforms
          lives and strengthens communities across Ethiopia.
        </p>
        <div className="flex justify-center animate-fade-in [animation-delay:600ms]">
          <Button
            variant={"ghost"}
            className="flex space-x-2 h-10 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={() => navigate("/register")}
          >
            <span>Join Us Today</span>
            <ArrowRight height={20} width={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
