import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";
import MainStatistics from "./MainStatistics";
import PerformanceMetrics from "./PerformanceMetrics";

const Statistics = () => {
  const { ref, inView } = useIntersectionObserver();

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100"
      ref={ref}
      id="statistics"
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
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Statistics
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Driving
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600">
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
        <MainStatistics />

        {/* Performance Metrics */}
        <PerformanceMetrics />
      </div>
    </section>
  );
};

export default Statistics;
