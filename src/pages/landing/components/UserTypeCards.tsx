import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Factory,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/ui/button";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const UserTypeCards = () => {
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

  const userTypes = [
    {
      icon: Building2,
      title: "Institutions",
      description:
        "Join our cooperative network and streamline your operations",
      benefits: [
        "Digital Onboarding",
        "Compliance Management",
        "Performance Analytics",
      ],
      color: "from-blue-500 to-cyan-500",
      buttonText: "Register Institution",
      action: () => navigate("/register?type=institution"),
    },
    {
      icon: Factory,
      title: "Manufacturers",
      description: "Connect with our supply chain and expand your market reach",
      benefits: ["Production Tracking", "Quality Control", "Market Access"],
      color: "from-green-500 to-emerald-500",
      buttonText: "Become a Partner",
      action: () => navigate("/register?type=manufacturer"),
    },
    {
      icon: Users,
      title: "Agents",
      description: "Empower your field operations with our mobile platform",
      benefits: ["Mobile Tools", "Commission Tracking", "Training Support"],
      color: "from-purple-500 to-violet-500",
      buttonText: "Join as Agent",
      action: () => navigate("/register?type=agent"),
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      {userTypes.map((userType, index) => {
        const IconComponent = userType.icon;
        return (
          <motion.div
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${userType.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            {/* Icon */}
            <motion.div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${userType.color} text-white mb-6 shadow-lg relative`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent size={28} />
            </motion.div>

            {/* Content */}
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {userType.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {userType.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-8">
                {userType.benefits.map((benefit, benefitIndex) => (
                  <div
                    key={benefitIndex}
                    className="flex items-center text-gray-700"
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${userType.color} mr-3`}
                    />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={userType.action}
                className={`w-full bg-gradient-to-r ${userType.color} hover:opacity-90 text-white py-3 rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl flex items-center justify-center space-x-2`}
              >
                <span>{userType.buttonText}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Button>
            </div>

            {/* Hover Effect */}
            <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default UserTypeCards;