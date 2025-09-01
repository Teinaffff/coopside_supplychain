import { motion } from "framer-motion";
import { ArrowRight, Globe, Monitor, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/ui/button";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const MultipleAccessChannels = () => {
  const { ref, inView } = useIntersectionObserver();
  const navigate = useNavigate();

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

  const platformFeatures = [
    {
      icon: Monitor,
      title: "Web Dashboard",
      description:
        "Comprehensive web platform for full administrative control and detailed analytics",
      color: "from-indigo-500 to-blue-500",
      features: ["Admin Panel", "Advanced Reports", "Bulk Operations"],
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description:
        "Native iOS and Android apps for field agents and on-the-go management",
      color: "from-green-500 to-teal-500",
      features: ["Offline Mode", "GPS Tracking", "Push Notifications"],
    },
    {
      icon: Globe,
      title: "API Access",
      description:
        "RESTful APIs for seamless integration with existing systems",
      color: "from-orange-500 to-red-500",
      features: ["REST APIs", "Webhooks", "SDK Support"],
    },
  ];

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Platform Access Methods */}
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
                Multiple Access Channels
              </h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                From smartphones to feature phones, web dashboards to APIs -
                access your supply chain data through any device or integration
                method.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((platform, index) => {
                const IconComponent = platform.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} mb-4 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <IconComponent size={28} />
                    </motion.div>
                    <h4 className="text-xl font-bold mb-3">{platform.title}</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {platform.description}
                    </p>

                    {/* Platform Features */}
                    <div className="space-y-2">
                      {platform.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-gray-400 text-sm"
                        >
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${platform.color} mr-3`}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="text-center mt-12 space-y-4"
              variants={itemVariants}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <span>Request Demo</span>
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    size={20}
                  />
                </Button>
              </div>
              <p className="text-gray-400 text-sm">
                Available on all major platforms • Enterprise-ready • 24/7
                Support
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MultipleAccessChannels;
