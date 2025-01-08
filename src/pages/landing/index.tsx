import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AboutUs from "./components/About";
import ContactUs from "./components/Contactus";
import Footer from "./components/Footer";

const Landing = () => {
  return (
    <div>
      <Header />
      <Hero />
      <AboutUs />
      <Services />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Landing;
