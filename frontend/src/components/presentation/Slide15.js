import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Slide15 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, type: 'spring' },
    },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-0 overflow-hidden relative flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center pt-4 sm:pt-6">
            <div className="inline-block p-3 sm:p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 mb-4 sm:mb-5">
              <span className="text-4xl sm:text-5xl md:text-6xl">🎯</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Conclusion
            </h1>
            <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-2 sm:mt-3 mx-auto" />
          </motion.div>

          {/* Main Conclusion */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 md:p-8 border border-white/30 shadow-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
                This project demonstrates that:
              </h2>
              <div className="space-y-4 sm:space-y-5">
                {[
                  {
                    icon: '🤖',
                    title: 'Machine Learning solves real operational challenges',
                    desc: 'AI automates and elevates complex, multi-criteria admissions processes.'
                  },
                  {
                    icon: '⚖️',
                    title: 'Automation fosters fairness and equity',
                    desc: 'Data-driven evaluations eliminate subjective individual bias.'
                  },
                  {
                    icon: '📈',
                    title: 'Ensemble consensus enhances reliability',
                    desc: 'Multiple distinct models working in consensus produce resilient decisions.'
                  },
                ].map((point, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-3 sm:gap-4 bg-white/10 rounded-lg p-4 sm:p-5 border-l-4 border-purple-400 backdrop-blur"
                  >
                    <div className="text-2xl sm:text-3xl flex-shrink-0">{point.icon}</div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base md:text-lg mb-1">{point.title}</h3>
                      <p className="text-white/80 text-xs sm:text-sm">{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Achievements */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 text-center">
              ✨ Key Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  icon: '🎓',
                  title: 'End-to-End System',
                  items: [
                    'Interactive React frontend',
                    'Robust FastAPI backend',
                    '3 complementary ML models',
                    'MongoDB datastore',
                  ]
                },
                {
                  icon: '📊',
                  title: 'Reliable Performance',
                  items: [
                    'High accuracy & precision',
                    'Explainable metrics',
                    'Robust consensus ranking',
                    'Reproducible results',
                  ]
                },
                {
                  icon: '🚀',
                  title: 'Production-Ready Design',
                  items: [
                    'Intuitive user portal',
                    'Administrative dashboard',
                    'Automated report exports',
                    'Dynamic quota management',
                  ]
                },
              ].map((achievement, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-6 border border-white/30 shadow-xl"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{achievement.icon}</div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">{achievement.title}</h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {achievement.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                        <Check size={16} className="text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Future Perspectives */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 text-center">
              🔮 Future Perspectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                '🤖 Deep learning architectures for enriched representation learning',
                '📱 Native mobile application for student applicants',
                '🌐 Nationwide university-scale deployment',
                '📈 Real-time algorithmic quota optimization',
                '🔒 Zero-knowledge privacy & confidential computing',
                '📊 Advanced predictive institutional analytics',
              ].map((perspective, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-3 sm:gap-4 bg-white/10 rounded-lg p-3 sm:p-4 border border-white/30 backdrop-blur"
                >
                  <span className="text-xl sm:text-2xl md:text-3xl flex-shrink-0">{perspective.split(' ')[0]}</span>
                  <p className="text-white/90 text-xs sm:text-sm">{perspective.split(' ').slice(1).join(' ')}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final Message */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl text-center text-white">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Thank You! 🙏</h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-5">
                This project illustrates how data science and machine learning can modernize higher education admissions by making decisions equitable, objective, and transparent.
              </p>
              <div className="flex justify-center gap-6 sm:gap-8 text-xl sm:text-2xl md:text-3xl">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  💡
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>
                  🎓
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>
                  🚀
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="text-center text-white/80 text-xs sm:text-sm pb-6 sm:pb-8 space-y-1">
            <p className="font-bold text-white text-sm sm:text-base">National Institute of Technology Hamirpur (NIT Hamirpur)</p>
            <p className="text-white/90">Developed by: <span className="font-semibold text-white">Akash Mavi, Akshay Kumar, Akshita Sharma, Amit Kumar, Ancil</span></p>
            <p className="text-white/90">Supervised by: <span className="font-semibold text-white">Dr. Sangeeta Sharma</span></p>
            <p className="text-white/60 text-xs mt-2">Academic Year 2025 – 2026</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Slide15;
