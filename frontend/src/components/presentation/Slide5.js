import React from 'react';
import { motion } from 'framer-motion';

const Slide5 = () => {
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-green-50 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-indigo-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">💡</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Proposed Solution
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Notre Solution */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            An intelligent system comprising:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: '🌐', title: 'Web Application', desc: 'React Frontend + FastAPI Backend' },
              { icon: '💾', title: 'Database', desc: 'Centralized MongoDB Datastore' },
              { icon: '🤖', title: 'ML Models', desc: 'Three complementary algorithms' },
              { icon: '⚙️', title: 'Consensus Fusion', desc: 'Multi-model ranking mechanism' },
            ].map((component, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-indigo-600"
              >
                <div className="text-4xl mb-3">{component.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{component.title}</h3>
                <p className="text-gray-600">{component.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pourquoi plusieurs modèles */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🎯 Why Multiple Models?
          </h2>
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-8 shadow-xl text-white">
            <p className="text-sm md:text-base font-semibold mb-4 sm:mb-5">
              To maximize:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: '🎯', title: 'Reliability', desc: 'Greater confidence in decisions' },
                { icon: '📈', title: 'Precision', desc: 'High prediction accuracy' },
                { icon: '✅', title: 'Trust', desc: 'Consensus-backed explainability' },
              ].map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="font-bold text-sm md:text-base mb-2">{benefit.title}</h3>
                  <p className="text-sm opacity-90">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Architecture Flow */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📊 Operational Workflow
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-xl p-8 shadow-lg">
            {[
              { step: 1, icon: '📝', label: 'Data\nInput' },
              { step: 2, icon: '⚙️', label: 'Feature\nExtraction' },
              { step: 3, icon: '🤖', label: 'Score\nInference' },
              { step: 4, icon: '📊', label: 'Consensus\nFusion' },
              { step: 5, icon: '✅', label: 'Final\nDecision' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-indigo-600 text-white rounded-full w-20 h-20 flex flex-col items-center justify-center font-bold shadow-lg"
                >
                  <div className="text-sm md:text-base md:text-xl">{item.icon}</div>
                  <div className="text-xs">{item.step}</div>
                </motion.div>
                {idx < 4 && (
                  <div className="hidden md:block w-8 h-1 bg-gradient-to-r from-indigo-600 to-blue-600" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 text-center text-xs text-gray-600">
            {[
              'Applicant enters profile data',
              'Backend extracts features',
              '3 ML models predict scores',
              'Consensus weights combined',
              'Final quota-aware ranking',
            ].map((desc, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-2">
                {desc}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide5;
