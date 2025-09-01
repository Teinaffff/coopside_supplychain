import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";
import { ContactForm } from "./ContactForm";

const ContactUs = () => {
  const { ref, inView } = useIntersectionObserver();

  return (
    <section className="py-20 bg-gray-50" id="contact-us" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
            Contact Us
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help and would love to hear from you.
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          <ContactInfo inView={inView} />
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

const ContactInfo = ({ inView }: { inView: boolean }) => {
  return (
    <motion.div
      className="w-full lg:w-1/2"
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="space-y-6">
        {[
          {
            icon: Mail,
            label: "Email",
            value: "contact@ethiopiancooperative.org",
            color: "text-cyan-600",
          },
          {
            icon: Phone,
            label: "Phone",
            value: "+251 11 234 5678",
            color: "text-green-600",
          },
          {
            icon: MapPin,
            label: "Address",
            value: "Addis Ababa, Ethiopia",
            color: "text-purple-600",
          },
        ].map((contact, index) => {
          const IconComponent = contact.icon;
          return (
            <motion.div
              key={contact.label}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-3 rounded-full bg-gray-50 ${contact.color}`}>
                <IconComponent size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {contact.label}
                </p>
                <p className="text-gray-900 font-medium">{contact.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
