import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Globe,
  Monitor,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/ui/button";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const Features = () => {
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

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Access your supply chain data anywhere with our responsive mobile application.",
      benefits: [
        "iOS & Android Apps",
        "Offline Capability",
        "Push Notifications",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade security with end-to-end encryption and compliance standards.",
      benefits: ["256-bit Encryption", "SOC 2 Compliant", "Multi-factor Auth"],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description:
        "Instant updates and real-time synchronization across all connected systems.",
      benefits: ["Live Updates", "Instant Sync", "Real-time Analytics"],
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive reporting and business intelligence for data-driven decisions.",
      benefits: ["Custom Dashboards", "Predictive Analytics", "Export Reports"],
      color: "from-purple-500 to-violet-500",
    },
  ];

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
            Platform Features
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Built for
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              {" "}
              Modern Cooperatives
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge technology with deep
            understanding of cooperative operations to deliver unmatched
            performance and reliability.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg relative `}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent size={28} />
                </motion.div>

                {/* Content */}
                <div className="relative ">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefitIndex}
                        className="flex items-center text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 + benefitIndex * 0.1 }}
                      >
                        <CheckCircle
                          className="text-green-500 mr-3"
                          size={16}
                        />
                        <span className="text-sm font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            );
          })}
        </motion.div>

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
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 group"
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

export default Features;
