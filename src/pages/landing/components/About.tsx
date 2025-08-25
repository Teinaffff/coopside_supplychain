import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Factory,
  Globe,
  Heart,
  Package,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import CountUp from "react-countup";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const AboutUs = () => {
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

  const missionPoints = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To revolutionize Ethiopia's supply chain ecosystem by connecting institutions, manufacturers, and consumers through innovative cooperative solutions.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Transparency, collaboration, and sustainable growth drive everything we do. We believe in empowering communities through technology.",
    },
    {
      icon: Globe,
      title: "Our Vision",
      description:
        "To become the leading supply chain management platform in East Africa, fostering economic growth and prosperity for all stakeholders.",
    },
  ];

  const { ref, inView } = useIntersectionObserver();

  return (
    <section
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20"
      id="about"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
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
            About Our Platform
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Transforming Ethiopia's
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              Cooperative Economy
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            We are pioneering a digital transformation in Ethiopia's cooperative
            sector, creating an integrated ecosystem that connects institutions,
            manufacturers, agents, and consumers for sustainable economic
            growth.
          </p>
        </motion.div>

        {/* Mission, Vision, Values */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {missionPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <motion.div
                key={index}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent size={24} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {point.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

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

        {/* Achievement Badges */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {[
            {
              icon: Award,
              title: "Industry Leader",
              description:
                "First comprehensive supply chain platform for Ethiopian cooperatives",
              color: "from-yellow-400 to-orange-500",
            },
            {
              icon: TrendingUp,
              title: "Rapid Growth",
              description: "300% year-over-year growth in platform adoption",
              color: "from-green-400 to-emerald-500",
            },
            {
              icon: Users,
              title: "Community Focused",
              description: "Serving over 50,000 cooperative members nationwide",
              color: "from-blue-400 to-cyan-500",
            },
          ].map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${achievement.color} text-white mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <IconComponent size={20} />
                </motion.div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {achievement.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
