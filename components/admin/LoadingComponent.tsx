import { motion } from 'framer-motion';

const LoadingComponent = () => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        rotate: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }
      }
    }
  };

  const innerCircleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };


  const particleVariants = {
    animate: (i) => ({
      y: [0, -15, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.3,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <div className="relative mb-8">
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-blue-100"
          variants={spinnerVariants}
          animate="animate"
        />

        <motion.div
          className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
          variants={spinnerVariants}
          animate="animate"
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          variants={innerCircleVariants}
          animate="animate"
        />

        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-400 rounded-full"
            style={{
              top: `${25 + 35 * Math.sin((i * Math.PI) / 2)}%`,
              left: `${25 + 35 * Math.cos((i * Math.PI) / 2)}%`,
            }}
            custom={i}
            variants={particleVariants}
            animate="animate"
          />
        ))}
      </div>

      <motion.p
        className="text-lg font-medium text-gray-700 mb-4"
        animate="animate"
      >
        Loading your content ...
      </motion.p>


    </div>
  );
};

export default LoadingComponent;