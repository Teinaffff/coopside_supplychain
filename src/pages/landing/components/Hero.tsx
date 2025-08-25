import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Factory,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../../assets";
import { Button } from "../../../common/ui/button";

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 1.2,
      },
    },
  };

  return (
    <motion.div
      className="py-20 pt-16 mt-[72px] bg-fit bg-center bg-no-repeat relative min-h-[755px] overflow-hidden"
      id="home"
      style={{
        backgroundImage: `url(${IMAGES.heroRectangle})`,
        backgroundSize: "1440px 770px",
        backgroundPosition: "left bottom",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 right-10 text-cyan-300 opacity-20"
        variants={floatingVariants}
        animate="animate"
      >
        <Factory size={80} />
      </motion.div>
      <motion.div
        className="absolute top-40 left-10 text-cyan-300 opacity-15"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Building2 size={60} />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-20 text-cyan-500 opacity-10"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Users size={70} />
      </motion.div>

      <div className="flex flex-col space-y-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative">
        <motion.div
          className="flex justify-center mb-8"
          variants={fadeInVariants}
        >
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-full inline-flex items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <TrendingUp className="mr-2" size={16} />
            <span className="text-sm font-medium">
              Revolutionizing Supply Chain Management
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
          variants={fadeInVariants}
        >
          Empowering Ethiopia's Supply
          <br />
          Chain Ecosystem
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-center max-w-4xl mx-auto mb-12 leading-relaxed"
          variants={fadeInVariants}
        >
          Connect institutions, manufacturers, agents, and consumers in a
          unified platform.
          <br className="hidden md:block" />
          Streamline operations, manage inventory, and facilitate seamless
          transactions
          <br className="hidden md:block" />
          across Ethiopia's cooperative union network.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          variants={fadeInVariants}
        >
          <Button
            variant="ghost"
            className="flex items-center space-x-2 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={() => navigate("/register")}
          >
            <span>Join Our Network</span>
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform duration-300"
              size={20}
            />
          </Button>

          <Button
            variant="outline"
            className="flex items-center space-x-2 h-12 border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() =>
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>Explore Features</span>
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          variants={statsVariants}
        >
          {[
            { label: "Institutions", value: "500+", icon: Building2 },
            { label: "Manufacturers", value: "200+", icon: Factory },
            { label: "Active Agents", value: "1,000+", icon: Users },
            { label: "Consumers", value: "10,000+", icon: TrendingUp },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
              >
                <IconComponent
                  className="mx-auto mb-2 text-cyan-600"
                  size={24}
                />
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
