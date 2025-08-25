import { motion } from "framer-motion";
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

interface TestimonialNavigationProps {
  testimonials: Testimonial[];
  activeTestimonial: number;
  onTestimonialChange: (index: number) => void;
}

const TestimonialNavigation = ({
  testimonials,
  activeTestimonial,
  onTestimonialChange,
}: TestimonialNavigationProps) => {
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
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      {testimonials.map((testimonial, index) => {
        const IconComponent = testimonial.icon;
        return (
          <motion.div
            key={index}
            className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border-2 ${
              activeTestimonial === index
                ? "bg-white/20 border-cyan-400"
                : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20"
            }`}
            variants={itemVariants}
            onClick={() => onTestimonialChange(index)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <IconComponent size={20} className="text-white" />
              </motion.div>
              <div>
                <div className="font-semibold text-white">
                  {testimonial.name}
                </div>
                <div className="text-gray-300 text-sm">
                  {testimonial.company}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TestimonialNavigation;