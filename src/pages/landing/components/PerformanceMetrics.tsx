import { motion } from "framer-motion";
import {
  Award,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import CountUp from "react-countup";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const PerformanceMetrics = () => {
  const { ref, inView } = useIntersectionObserver();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const performanceStats = [
    {
      icon: TrendingUp,
      value: 99.9,
      suffix: "%",
      label: "Platform Uptime",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Clock,
      value: 2.3,
      suffix: "s",
      label: "Average Response Time",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: DollarSign,
      value: 15,
      suffix: "M+",
      label: "ETB Processed Monthly",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Award,
      value: 4.8,
      suffix: "/5",
      label: "Customer Satisfaction",
      color: "from-pink-400 to-rose-500",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Platform Performance
        </h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Built for reliability, speed, and scale to support Ethiopia's
          growing cooperative ecosystem.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {performanceStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              className="text-center group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                whileHover={{ y: -5, rotate: 5 }}
              >
                <IconComponent size={24} />
              </motion.div>

              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={index * 0.2 + 1}
                    suffix={stat.suffix}
                    decimals={
                      stat.suffix === "s" || stat.suffix === "/5" ? 1 : 0
                    }
                    separator=","
                  />
                )}
              </div>

              <div className="text-lg font-semibold text-gray-800">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PerformanceMetrics;