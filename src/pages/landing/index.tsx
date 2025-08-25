import AboutUs from "./components/About";
import CallToAction from "./components/CallToAction";
import ContactUs from "./components/Contactus";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Statistics from "./components/Statistics";
import Testimonials from "./components/Testimonials";

const Landing = () => {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Hero />
      <Services />
      <Features />
      <AboutUs />
      <Statistics />
      <Testimonials />
      <CallToAction />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Landing;
