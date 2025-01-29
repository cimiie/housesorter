import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  const variants = {
    small: {
      width: "700px",
      height: "700px",
      transition: { duration: 0.7 }
    },
    large: {
      width: "95vw",
      height: "90vh",
      transition: { duration: 0.7 }
    }
  };

  // If it's the Sort component, apply size transition
  if (children.type?.name === 'Sort') {
    return (
      <motion.div
        variants={variants}
        animate="large"
        initial="small"
      >
        {children}
      </motion.div>
    );
  }

  // Return without any animation for other components
  return children;
};

export default PageTransition;
