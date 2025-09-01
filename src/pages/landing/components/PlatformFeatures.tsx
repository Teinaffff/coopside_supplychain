import { motion } from "framer-motion";
import { BarChart3, CheckCircle, Shield, Smartphone, Zap } from "lucide-react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const PlatformFeatures = () => {
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
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Platform Features
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Built for
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600">
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
