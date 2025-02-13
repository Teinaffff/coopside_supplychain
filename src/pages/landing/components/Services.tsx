import { motion } from "framer-motion";
import {
  Box,
  Briefcase,
  DollarSign,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react"; // Replace with your preferred icon library
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const services = [
  {
    title: "Establish PC",
    description:
      "Financial services tailored to empower small businesses and farmers.",
    icon: <UserPlus size={24} />,
  },
  {
    title: "Establish Union",
    description:
      "Financial services tailored to empower small businesses and farmers.",
    icon: <Users size={24} />,
  },
  {
    title: "Buy Share",
    description:
      "Financial services tailored to empower small businesses and farmers.",
    icon: <Briefcase size={24} />,
  },
  {
    title: "Membership Cancellation",
    description:
      "Financial services tailored to empower small businesses and farmers.",
    icon: <XCircle size={24} />,
  },
  {
    title: "Inventory Management",
    description:
      "Financial services tailored to empower small businesses and farmers.",
    icon: <Box size={24} />,
  },
  {
    title: "Loan Origination",
    description:
      "Financial services tailored to empower small businesses and farmers.",
    icon: <DollarSign size={24} />,
  },
];

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animation for child elements
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const { ref, inView } = useIntersectionObserver();

  return (
    <motion.section
      className="py-20 bg-gray-100"
      id="services"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="services">
        <motion.div className="text-center mb-10" variants={cardVariants}>
          <span className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
            Our Services
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            What We Offer
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Comprehensive solutions designed to support and elevate our members.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow rounded-lg hover:shadow-xl hover:bg-cyan-50 transition duration-300 group"
              variants={cardVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-cyan-100 text-cyan-600 p-4 rounded-full transition duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Services;
