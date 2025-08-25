import { motion } from "framer-motion";
import {
    Award,
    Building2,
    Clock,
    DollarSign,
    Factory,
    Package,
    TrendingUp,
    Users,
} from "lucide-react";
import CountUp from "react-countup";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const Statistics = () => {
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

  const mainStats = [
    {
      icon: Building2,
      value: 500,
      suffix: "+",
      label: "Partner Institutions",
      description: "Registered cooperative institutions",
      color: "from-blue-500 to-cyan-500",
      growth: "+25%",
    },
    {
      icon: Factory,
      value: 200,
      suffix: "+",
      label: "Manufacturing Partners",
      description: "Verified production facilities",
      color: "from-green-500 to-emerald-500",
      growth: "+40%",
    },
    {
      icon: Users,
      value: 1000,
      suffix: "+",
      label: "Active Agents",
      description: "Field agents nationwide",
      color: "from-purple-500 to-violet-500",
      growth: "+60%",
    },
    {
      icon: Package,
      value: 50000,
      suffix: "+",
      label: "Monthly Transactions",
      description: "Supply chain transactions",
      color: "from-orange-500 to-red-500",
      growth: "+80%",
    },
  ];

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
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100"
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
            Platform Metrics
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Driving
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              {" "}
              Measurable Impact
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our platform's success is measured by the growth and prosperity of
            our cooperative network across Ethiopia.
          </p>
        </motion.div>

        {/* Main Statistics */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Growth Badge */}
                <motion.div
                  className="absolute top-4 right-4 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {stat.growth}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 shadow-lg relative z-10`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent size={28} />
                </motion.div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 relative z-10">
                  {inView && (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      delay={index * 0.2}
                      suffix={stat.suffix}
                      separator=","
                    />
                  )}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-800 mb-2 relative z-10">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600 relative z-10">
                  {stat.description}
                </div>

                {/* Hover Effect */}
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
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
      </div>
    </section>
  );
};

export default Statistics;
