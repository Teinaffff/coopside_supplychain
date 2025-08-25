import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  quote: string;
  icon: any;
  color: string;
}

interface FeaturedTestimonialProps {
  testimonial: Testimonial;
}

const FeaturedTestimonial = ({ testimonial }: FeaturedTestimonialProps) => {
  const { ref, inView } = useIntersectionObserver();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
      </div>

      <motion.div className="relative z-10" variants={itemVariants}>
        {/* Quote Icon */}
        <motion.div
          className="flex justify-center mb-8"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <div className="bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full p-4 shadow-xl">
            <Quote size={32} className="text-gray-900" />
          </div>
        </motion.div>

        {/* Testimonial Content */}
        <div className="text-center">
          <motion.p
            className="text-xl md:text-2xl font-medium leading-relaxed mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            "{testimonial.quote}"
          </motion.p>

          {/* Rating */}
          <div className="flex justify-center mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="text-yellow-400 fill-current" size={24} />
              </motion.div>
            ))}
          </div>

          {/* Author Info */}
          <motion.div
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-700 font-bold text-lg">
                {testimonial.name.charAt(0)}
              </span>
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">{testimonial.name}</div>
              <div className="text-gray-300">{testimonial.role}</div>
              <div className="text-cyan-400 text-sm">{testimonial.company}</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeaturedTestimonial;