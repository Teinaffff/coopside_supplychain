import { motion } from "framer-motion";
import { Calendar, Users, Users2 } from "lucide-react";
import CountUp from "react-countup";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const AboutUs = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  const { ref, inView } = useIntersectionObserver();

  return (
    <section className="bg-gray-50 py-16" id="about" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
            About Us
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 mt-4">
            Uniting for Progress
          </h2>
          <p className="text-gray-600 text-lg">
            We are a cooperative union dedicated to empowering Ethiopian
            communities <br /> through sustainable development and collaborative
            growth.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {[
            {
              title: 50000,
              subtitle: "Members",
              icon: <Users size={24} />,
            },
            {
              title: 600,
              subtitle: "Primary Cooperatives",
              icon: <Users2 size={24} />,
            },
            {
              title: 25,
              subtitle: "Years of Impact",
              icon: <Calendar size={24} />,
            },
            { title: 73, subtitle: "Unions", icon: <Users size={24} /> },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow rounded-lg group transition duration-300 hover:shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <div className="text-4xl bg-cyan-100 text-cyan-600 p-4 rounded-full transition group-hover:bg-cyan-600 group-hover:text-white">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-cyan-800">
                {inView ? (
                  <CountUp
                    start={0}
                    end={item.title}
                    duration={2.5}
                    delay={0.5}
                  />
                ) : (
                  0
                )}
              </h3>
              <p className="text-gray-600 text-sm">{item.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
