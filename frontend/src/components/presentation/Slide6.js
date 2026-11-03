import React from 'react';
import { motion } from 'framer-motion';

const Slide6 = () => {
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-cyan-50 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-cyan-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">🏗️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              System Architecture
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Technologies */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: '⚛️', title: 'Frontend', tech: 'React 18' },
              { icon: '🚀', title: 'Backend', tech: 'FastAPI' },
              { icon: '💾', title: 'Database', tech: 'MongoDB' },
              { icon: '🤖', title: 'Machine Learning', tech: 'Scikit-learn' },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-t-4 border-cyan-600"
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{tech.title}</h3>
                <p className="text-cyan-600 font-semibold">{tech.tech}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📐 Complete Architecture
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <div className="space-y-6">
              {/* Client Layer */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-600">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl sm:text-2xl md:text-3xl">🌐</span>
                  <h3 className="text-sm md:text-base font-bold text-gray-900">Client Tier (Frontend)</h3>
                </div>
                <p className="text-gray-700">React 18 Application - Interactive User Interface</p>
              </motion.div>

              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl text-cyan-600"
                >
                  ↓
                </motion.div>
              </div>

              {/* API Layer */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-600">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl sm:text-2xl md:text-3xl">🔌</span>
                  <h3 className="text-sm md:text-base font-bold text-gray-900">API Tier (Backend)</h3>
                </div>
                <p className="text-gray-700">FastAPI - High-performance RESTful API & business logic</p>
              </motion.div>

              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="text-3xl text-cyan-600"
                >
                  ↓
                </motion.div>
              </div>

              {/* ML & Database Layer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-600">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl sm:text-2xl md:text-3xl">🤖</span>
                    <h3 className="text-sm md:text-base font-bold text-gray-900">ML Engine</h3>
                  </div>
                  <p className="text-gray-700">3 predictive models with consensus ranking</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-600">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl sm:text-2xl md:text-3xl">💾</span>
                    <h3 className="text-sm md:text-base font-bold text-gray-900">Database</h3>
                  </div>
                  <p className="text-gray-700">MongoDB - Centralized document datastore</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flow Description */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ⚡ Data Flow
          </h2>
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-8 border-2 border-cyan-600">
            <ol className="space-y-4">
              {[
                'Student inputs profile information into user interface',
                'Data is sent to FastAPI backend securely',
                'Backend extracts features, scales, and prepares records',
                'All 3 ML models compute scores and predictions',
                'Consensus engine merges outputs with quota rules',
                'Final ranked decisions returned to dashboard',
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <p className="text-gray-800 text-sm md:text-base pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide6;
