import React from 'react';
import { motion } from 'framer-motion';

const Slide13 = () => {
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-orange-100 p-0 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10"
        >
        {/* Title */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">💻</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Implementation: Web Application
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Fonctionnalités Étudiants */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            👨‍🎓 Student Portal Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '📝', title: 'Registration', desc: 'Create account and submit application data' },
              { icon: '🤖', title: 'AI Recommendations', desc: 'View predictions and consensus ranking' },
              { icon: '📥', title: 'Official Export', desc: 'Download admission and scholarship documentation' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-teal-600"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fonctionnalités Admin */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            👨‍💼 Administrator Dashboard Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: '👥', title: 'Student Management', desc: 'Review, approve, reject, or edit student profiles' },
              { icon: '🚀', title: 'Execute ML Ranking', desc: 'Run consensus algorithms across candidate pools' },
              { icon: '📋', title: 'Quota Management', desc: 'Set and adapt annual scholarship thresholds' },
              { icon: '📊', title: 'System Analytics', desc: 'Visualize distribution metrics, trends, and charts' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-teal-600"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interface Stack */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🏗️ Technology Architecture
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                { 
                  icon: '⚛️', 
                  title: 'Frontend', 
                  techs: ['React 18', 'Tailwind CSS', 'Axios API Client', 'Chart.js / Recharts'],
                },
                { 
                  icon: '🚀', 
                  title: 'Backend', 
                  techs: ['FastAPI', 'MongoDB', 'Python 3.11+', 'Passlib Auth'],
                },
                { 
                  icon: '🤖', 
                  title: 'ML Pipeline', 
                  techs: ['Scikit-learn', '3 ML Models', 'Feature Engineering', 'Consensus Logic'],
                },
              ].map((stack, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border-2 border-teal-600"
                >
                  <div className="text-4xl mb-3">{stack.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-4">{stack.title}</h3>
                  <ul className="space-y-2">
                    {stack.techs.map((tech, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                        <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Workflow */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ⚡ End-to-End Workflow
          </h2>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-8 border-2 border-teal-600">
            <div className="space-y-4">
              {[
                { step: 1, icon: '📝', desc: 'Student completes and submits registration form' },
                { step: 2, icon: '💾', desc: 'Application validated and stored in MongoDB' },
                { step: 3, icon: '🔄', desc: 'Administrator triggers consensus ranking' },
                { step: 4, icon: '🤖', desc: '3 ML models compute independent inference scores' },
                { step: 5, icon: '⚙️', desc: 'Consensus engine allocates quotas & awards' },
                { step: 6, icon: '✅', desc: 'Decision and recommendations surfaced in portals' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg"
                >
                  <div className="bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <span className="text-sm md:text-base md:text-xl">{item.icon}</span>
                  <p className="text-gray-800 font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide13;
