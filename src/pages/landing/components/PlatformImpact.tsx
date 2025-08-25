import { motion } from "framer-motion";
import {
  Building2,
  Factory,
  Package,
  Users,
} from "lucide-react";
import CountUp from "react-countup";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const PlatformImpact = () => {
  const { ref, inView } = useIntersectionObserver();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const statsData = [
    {
      icon: Building2,
      value: 500,
      suffix: "+",
      label: "Partner Institutions",
      description: "Registered cooperative institutions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Factory,
      value: 200,
      suffix: "+",
      label: "Manufacturing Partners",
      description: "Verified production facilities",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      value: 1000,
      suffix: "+",
      label: "Active Agents",
      description: "Field agents nationwide",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Package,
      value: 10000,
      suffix: "+",
      label: "Monthly Transactions",
      description: "Supply chain transactions",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Statistics Section */}
        <motion.div
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Impact
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our growing network is transforming how cooperative unions operate
              across Ethiopia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ y: -5 }}
                  >
                    <IconComponent size={24} />
                  </motion.div>

                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {inView && (
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        delay={index * 0.2}
                        suffix={stat.suffix}
                      />
                    )}
                  </div>

                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {stat.label}
                  </div>

                  <div className="text-sm text-gray-600">
                    {stat.description}
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

export default PlatformImpact;