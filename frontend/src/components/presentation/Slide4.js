import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const Slide4 = () => {
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-yellow-50 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-green-600 rounded-xl">
              <Target size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Project Objectives
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Objectif Principal */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🎯 Primary Objective
          </h2>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-8 shadow-xl text-white mb-4 sm:mb-5">
            <p className="text-xl leading-relaxed font-semibold">
              Design an intelligent Machine Learning system capable of:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '📊', title: 'Rank', desc: 'Automatically rank students by consensus' },
              { icon: '🔮', title: 'Predict', desc: 'Predict eligibility and award tier' },
              { icon: '✅', title: 'Decide', desc: 'Deliver transparent, explainable decisions' },
            ].map((obj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-t-4 border-green-600"
              >
                <div className="text-4xl mb-3">{obj.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{obj.title}</h3>
                <p className="text-gray-600">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Objectifs Secondaires */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🌟 Secondary Objectives
          </h2>
          <div className="space-y-4">
            {[
              { icon: '⚙️', title: 'Minimize Manual Overhead', desc: 'Automate admissions workflow end-to-end' },
              { icon: '⚡', title: 'Enhance Processing Speed', desc: 'Process student applications in real time' },
              { icon: '⚖️', title: 'Guarantee Fairness', desc: 'Ensure decision consistency and transparency' },
            ].map((obj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 10 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-green-600 flex items-start gap-4"
              >
                <div className="text-xl sm:text-2xl md:text-3xl">{obj.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{obj.title}</h3>
                  <p className="text-gray-600">{obj.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Metrics */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Success Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                '🎯 Accuracy',
                '⚡ Speed',
                '✅ Transparency',
                '📊 Scalability',
              ].map((metric, idx) => (
                <div key={idx} className="text-center py-3 bg-white rounded-lg shadow">
                  <p className="text-sm font-semibold text-gray-900">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide4;
