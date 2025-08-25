import { motion } from "framer-motion";
import { Building2, Factory, Quote, Star, Users } from "lucide-react";
import { useState } from "react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      ref={ref}
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
            className="bg-gradient-to-r from-cyan-400 to-blue-400 text-gray-900 px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Success Stories
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
            Trusted by
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              {" "}
              Industry Leaders
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Hear from our partners who are transforming their operations and
            achieving remarkable results with our platform.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
          </div>

          <motion.div className="relative z-10" variants={itemVariants}>
            {/* Quote Icon */}
            <motion.div
              className="flex justify-center mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full p-4 shadow-xl">
                <Quote size={32} className="text-gray-900" />
              </div>
            </motion.div>

            {/* Testimonial Content */}
            <div className="text-center">
              <motion.p
                className="text-xl md:text-2xl font-medium leading-relaxed mb-8 max-w-4xl mx-auto"
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                "{testimonials[activeTestimonial].quote}"
              </motion.p>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map(
                  (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star
                        className="text-yellow-400 fill-current"
                        size={24}
                      />
                    </motion.div>
                  )
                )}
              </div>

              {/* Author Info */}
              <motion.div
                className="flex items-center justify-center space-x-4"
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-700 font-bold text-lg">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-300">
                    {testimonials[activeTestimonial].role}
                  </div>
                  <div className="text-cyan-400 text-sm">
                    {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonial Navigation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <motion.div
                key={index}
                className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border-2 ${
                  activeTestimonial === index
                    ? "bg-white/20 border-cyan-400"
                    : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20"
                }`}
                variants={itemVariants}
                onClick={() => setActiveTestimonial(index)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <IconComponent size={20} className="text-white" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
