import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  Users,
} from "lucide-react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

const AchievementBadges = () => {
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

  const achievements = [
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
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Achievement Badges */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {achievements.map((achievement, index) => {
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

export default AchievementBadges;