import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Factory,
  Mail,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/ui/button";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const CallToAction = () => {
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
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
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
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Get Started Today
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Ready to Transform
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              Your Operations?
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Join thousands of organizations already using our platform to
            streamline their supply chain operations and drive growth.
          </p>
        </motion.div>

        {/* User Type Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
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
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
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
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 group"
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
      </div>
    </section>
  );
};

export default CallToAction;
