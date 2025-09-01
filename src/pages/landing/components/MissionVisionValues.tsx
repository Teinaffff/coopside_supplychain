import { motion } from "framer-motion";
import {
  Globe,
  Heart,
  Target,
} from "lucide-react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const MissionVisionValues = () => {
  const { ref, inView } = useIntersectionObserver();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const missionPoints = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To revolutionize Ethiopia's supply chain ecosystem by connecting institutions, manufacturers, and consumers through innovative cooperative solutions.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Transparency, collaboration, and sustainable growth drive everything we do. We believe in empowering communities through technology.",
    },
    {
      icon: Globe,
      title: "Our Vision",
      description:
        "To become the leading supply chain management platform in East Africa, fostering economic growth and prosperity for all stakeholders.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            About Our Platform
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Transforming Ethiopia's
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600">
              Cooperative Economy
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            We are pioneering a digital transformation in Ethiopia's cooperative
            sector, creating an integrated ecosystem that connects institutions,
            manufacturers, agents, and consumers for sustainable economic
            growth.
          </p>
        </motion.div>

        {/* Mission, Vision, Values */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {missionPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <motion.div
                key={index}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent size={24} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {point.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionValues;