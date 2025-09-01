import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";
import ContactMethods from "./ContactMethods";
import UserTypeCards from "./UserTypeCards";

const CallToAction = () => {
  const { ref, inView } = useIntersectionObserver();

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
      ref={ref}
      id="call-to-action"
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
            Get Started Today
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
            Ready to Transform
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600">
              Your Operations?
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Join thousands of organizations already using our platform to
            streamline their supply chain operations and drive growth.
          </p>
        </motion.div>

        {/* User Type Cards */}
        <UserTypeCards />

        {/* Contact Methods */}
        <ContactMethods />
      </div>
    </section>
  );
};

export default CallToAction;
