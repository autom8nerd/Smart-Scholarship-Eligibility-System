import React from 'react';
import { motion } from 'framer-motion';

const Slide1 = () => {
  const logos = [
    { src: '/ISGA_Logo.png', alt: 'ISGA' },
    { src: '/edvantis-logo.webp', alt: 'Edvantis' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, type: 'spring' },
    },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 relative overflow-hidden">
      {/* Logos - Left and Right */}
      <motion.img
        src={logos[0].src}
        alt={logos[0].alt}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-6 sm:left-8 md:left-12 h-14 sm:h-18 md:h-24 object-contain drop-shadow-xl filter brightness-110 z-10"
      />
      <motion.img
        src={logos[1].src}
        alt={logos[1].alt}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-8 right-6 sm:right-8 md:right-12 h-14 sm:h-18 md:h-24 object-contain drop-shadow-xl filter brightness-110 z-10"
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 right-10 w-56 sm:w-96 h-56 sm:h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-4xl px-4 sm:px-6"
      >
        <motion.div variants={itemVariants} className="mb-6 sm:mb-7 md:mb-8">
          <div className="inline-block p-4 sm:p-5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 mb-5">
            <span className="text-5xl sm:text-6xl md:text-7xl">🎓</span>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg leading-tight"
        >
          Smart Enrollment & Scholarship System
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-white/90 mb-8 drop-shadow-md"
        >
          Powered by Machine Learning
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="bg-white/25 backdrop-blur-xl rounded-2xl p-5 sm:p-6 md:p-7 border border-white/40 shadow-2xl"
        >
          <div className="text-center mb-4 pb-3 border-b border-white/20">
            <p className="text-xs opacity-75 font-semibold uppercase tracking-wider mb-1">Institution</p>
            <p className="font-bold text-white text-lg sm:text-xl md:text-2xl drop-shadow-lg tracking-wide">
              National Institute of Technology Hamirpur (NIT Hamirpur)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-white text-xs sm:text-sm md:text-base">
            <div className="text-center">
              <p className="text-xs opacity-70 mb-1.5 font-semibold uppercase">Developed by</p>
              <p className="font-bold text-white text-sm sm:text-base md:text-lg drop-shadow-lg tracking-wide">
                Akash Mavi, Akshay Kumar, Akshita Sharma, Amit Kumar, Ancil
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70 mb-1.5 font-semibold uppercase">Supervised by</p>
              <p className="font-bold text-white text-base sm:text-lg md:text-xl drop-shadow-lg tracking-wide">
                Dr. Sangeeta Sharma
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70 mb-1.5 font-semibold uppercase">Academic Year</p>
              <p className="font-bold text-white text-base sm:text-lg md:text-xl drop-shadow-lg tracking-wide">
                2025 – 2026
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex justify-center gap-6 sm:gap-8"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-4xl sm:text-5xl md:text-6xl"
          >
            💡
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl"
          >
            🤖
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl"
          >
            📊
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Slide1;
