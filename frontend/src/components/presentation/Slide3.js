import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Users, Clock, HelpCircle } from 'lucide-react';

const Slide3 = () => {
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-red-50 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-red-600 rounded-xl">
              <AlertCircle size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Context & Problem Statement
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Contexte */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            Real-World Context
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-red-600">
              <div className="flex items-start gap-4">
                <div className="text-2xl sm:text-3xl md:text-4xl">🎓</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Higher Education Institutions</h3>
                  <p className="text-gray-700">Applicant volume far exceeds available admissions capacity</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-red-600">
              <div className="flex items-start gap-4">
                <div className="text-2xl sm:text-3xl md:text-4xl">⚠️</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Scholarship Allocation</h3>
                  <p className="text-gray-700">Often subjective, slow, and hard to audit or justify</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Problématique */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            Problem Statement
          </h2>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-8 shadow-xl text-white">
            <div className="flex items-start gap-4 mb-4 sm:mb-5">
              <HelpCircle size={32} />
              <div>
                <h3 className="text-xl font-bold mb-4">
                  How to automate and ensure equity in:
                </h3>
                <ul className="space-y-3 text-sm md:text-base">
                  <li>✓ Student admission selections</li>
                  <li>✓ Scholarship allocation</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/30 pt-6">
              <p className="font-semibold mb-3">While strictly balancing:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                  <p className="font-semibold">📊 Academic Merit</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                  <p className="font-semibold">💰 Financial & Social Need</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                  <p className="font-semibold">📅 Annual Quotas</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Défis */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            Key Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '🎯', title: 'Objectivity', desc: 'Eliminating subjective human bias' },
              { icon: '⚡', title: 'Efficiency', desc: 'Rapidly processing large applicant pools' },
              { icon: '⚖️', title: 'Equity', desc: 'Ensuring consistent, transparent decisions' },
            ].map((challenge, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-t-4 border-red-600"
              >
                <div className="text-4xl mb-3">{challenge.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide3;
