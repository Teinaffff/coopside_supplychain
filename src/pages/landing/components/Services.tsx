import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CreditCard,
  Factory,
  Globe,
  Package,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";
import { useState, useEffect } from "react";

const services = [
  {
    title: "Institution Management",
    description:
      "Comprehensive onboarding and management system for cooperative institutions with compliance tracking and performance analytics.",
    icon: <Building2 size={32} />,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Digital Onboarding",
      "Compliance Monitoring",
      "Branch Management",
    ],
  },
  {
    title: "Manufacturing Partners",
    description:
      "Connect and manage manufacturing partners with production tracking, quality control, and supply chain optimization.",
    icon: <Factory size={32} />,
    color: "from-green-500 to-emerald-500",
    features: ["Production Tracking", "Quality Control", "Capacity Planning"],
  },
  {
    title: "Agent Network",
    description:
      "Empower field agents with mobile tools for customer acquisition, service delivery, and performance tracking.",
    icon: <Users size={32} />,
    color: "from-purple-500 to-violet-500",
    features: ["Mobile App", "Performance Analytics", "Commission Tracking"],
  },
  {
    title: "Inventory Management",
    description:
      "Real-time inventory tracking across multiple locations with automated reordering and demand forecasting.",
    icon: <Package size={32} />,
    color: "from-orange-500 to-red-500",
    features: ["Real-time Tracking", "Auto Reordering", "Demand Forecasting"],
  },
  {
    title: "Financial Services",
    description:
      "Integrated loan origination, payment processing, and financial analytics for cooperative members.",
    icon: <CreditCard size={32} />,
    color: "from-indigo-500 to-blue-500",
    features: ["Loan Processing", "Payment Gateway", "Credit Scoring"],
  },
  {
    title: "Analytics & Reporting",
    description:
      "Comprehensive business intelligence with real-time dashboards and automated reporting capabilities.",
    icon: <BarChart3 size={32} />,
    color: "from-teal-500 to-cyan-500",
    features: [
      "Real-time Dashboards",
      "Custom Reports",
      "Predictive Analytics",
    ],
  },
  {
    title: "Security & Compliance",
    description:
      "Enterprise-grade security with role-based access control and regulatory compliance management.",
    icon: <Shield size={32} />,
    color: "from-gray-600 to-gray-800",
    features: ["Role-based Access", "Data Encryption", "Audit Trails"],
  },
  {
    title: "API Integration",
    description:
      "Seamless integration with existing systems through RESTful APIs and webhook support.",
    icon: <Zap size={32} />,
    color: "from-yellow-500 to-orange-500",
    features: ["RESTful APIs", "Webhook Support", "Third-party Integration"],
  },
  {
    title: "Multi-Channel Access",
    description:
      "Access the platform through web and mobile apps for maximum reach and accessibility.",
    icon: <Globe size={32} />,
    color: "from-pink-500 to-rose-500",
    features: ["Web Platform", "Mobile Apps"],
  },
];

const Services = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const { ref, inView } = useIntersectionObserver();
  
  // Force inView to true on small screens
  const effectiveInView = isSmallScreen || inView;

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100"
      id="services"
      initial="hidden"
      animate={effectiveInView ? "visible" : "hidden"}
      variants={containerVariants}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <motion.span
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Our Services
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Comprehensive Supply Chain
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600">
              Management Solutions
            </span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto leading-relaxed">
            Our platform provides end-to-end solutions for managing your
            cooperative union's supply chain operations, from institutional
            partnerships to consumer services.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Icon */}
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} text-white mb-6 shadow-lg`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 },
                }}
              >
                {service.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-center text-sm text-gray-500"
                    initial={{ opacity: 0, x: -10 }}
                    animate={effectiveInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3`}
                    />
                    {feature}
                  </motion.div>
                ))}
              </div>

              {/* Hover Effect */}
              <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Services;
