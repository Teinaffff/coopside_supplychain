import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/ui/button";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const ContactMethods = () => {
  const navigate = useNavigate();
  const { ref, inView } = useIntersectionObserver();

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

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+251 11 123 4567",
      description: "Speak with our team",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "info@supplychain.et",
      description: "Send us a message",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Business",
      value: "+251 91 234 5678",
      description: "Quick support & updates",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
      </div>

      <div className="relative">
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Need More Information?
          </h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our team is ready to help you get started and answer any
            questions about our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.div
                key={index}
                className="text-center group cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} mb-4 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <IconComponent size={24} />
                </motion.div>
                <h4 className="text-xl font-bold mb-2">{method.title}</h4>
                <p className="text-cyan-400 font-semibold mb-1">
                  {method.value}
                </p>
                <p className="text-gray-300 text-sm">
                  {method.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="text-center mt-12" variants={itemVariants}>
          <Button
            onClick={() => navigate("/contact")}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Contact Our Team</span>
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
              size={20}
            />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactMethods;