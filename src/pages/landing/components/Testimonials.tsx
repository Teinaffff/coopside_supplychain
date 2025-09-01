import { motion } from "framer-motion";
import { Building2, Factory, Users } from "lucide-react";
import { useState } from "react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";
import FeaturedTestimonial from "./FeaturedTestimonial";
import TestimonialNavigation from "./TestimonialNavigation";

const Testimonials = () => {
  const { ref, inView } = useIntersectionObserver();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Alemayehu Tadesse",
      role: "General Manager",
      company: "Addis Ababa Cooperative Union",
      image: "/api/placeholder/80/80",
      rating: 5,
      quote:
        "This platform has revolutionized how we manage our cooperative operations. The real-time inventory tracking and agent management features have increased our efficiency by 300%.",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Meron Bekele",
      role: "Production Director",
      company: "Ethiopian Textile Manufacturing",
      image: "/api/placeholder/80/80",
      rating: 5,
      quote:
        "The manufacturing partner integration is seamless. We can now track production, manage quality control, and coordinate with suppliers all in one place. Outstanding platform!",
      icon: Factory,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Dawit Haile",
      role: "Regional Agent Coordinator",
      company: "Oromia Regional Cooperative",
      image: "/api/placeholder/80/80",
      rating: 5,
      quote:
        "Managing over 200 field agents was a nightmare before this platform. Now we have real-time visibility, performance tracking, and seamless communication. Game changer!",
      icon: Users,
      color: "from-purple-500 to-violet-500",
    },
  ];

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      ref={ref}
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-gray-900 px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Success Stories
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
            Trusted by
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600">
              {" "}
              Industry Leaders
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Hear from our partners who are transforming their operations and
            achieving remarkable results with our platform.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <FeaturedTestimonial testimonial={testimonials[activeTestimonial]} />

        {/* Testimonial Navigation */}
        <TestimonialNavigation
          testimonials={testimonials}
          activeTestimonial={activeTestimonial}
          onTestimonialChange={setActiveTestimonial}
        />
      </div>
    </section>
  );
};

export default Testimonials;
