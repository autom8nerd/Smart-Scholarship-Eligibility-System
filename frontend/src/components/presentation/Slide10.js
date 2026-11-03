import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Slide10 = () => {
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

  // Mock data for tree visualization
  const treeData = [
    { question: 'GPA > 14', approves: 250, rejects: 50 },
    { question: 'Income < 8000', approves: 120, rejects: 80 },
    { question: 'Distance > 50', approves: 180, rejects: 20 },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-green-100 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-orange-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">🌳</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Decision Tree
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Principe */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            💡 Principle
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-orange-600">
            <p className="text-gray-700 text-sm md:text-base mb-4 sm:mb-5">
              Decision trees operate through:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '❓', title: 'Sequential Splits', desc: 'A hierarchy of recursive questions' },
                { icon: '🔀', title: 'Transparent Rules', desc: 'Clear conditional IF-THEN decision rules' },
                { icon: '📊', title: 'Branches', desc: 'Each branch represents an explicit decision path' },
              ].map((point, idx) => (
                <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-3xl mb-2">{point.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Exemple */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📊 Decision Tree Architecture Example
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="space-y-6">
              {[
                { level: 'Root Node', question: 'GPA > 14 ?', left: 'YES', right: 'NO' },
                { level: 'Level 2', question: 'Income < 8,000 MAD ?', left: 'YES', right: 'NO' },
                { level: 'Level 3', question: 'Distance > 50 km ?', left: 'YES', right: 'NO' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-600"
                >
                  <p className="text-xs text-orange-600 font-bold mb-2">{item.level}</p>
                  <p className="text-sm md:text-base font-bold text-gray-900 mb-3">{item.question}</p>
                  <div className="flex gap-4">
                    <div className="flex-1 text-center p-2 bg-green-100 rounded text-sm font-semibold text-green-800">
                      ✓ {item.left}
                    </div>
                    <div className="flex-1 text-center p-2 bg-red-100 rounded text-sm font-semibold text-red-800">
                      ✗ {item.right}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Visualization */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📈 Decision Distribution
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={treeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approves" fill="#ea580c" name="Approved" />
                <Bar dataKey="rejects" fill="#dc2626" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-2 sm:mt-3">
              Binary decision outcomes at each node split
            </p>
          </div>
        </motion.div>

        {/* Avantages */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ✅ Core Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: '🔀', title: 'Non-Linear Interactions', desc: 'Captures non-linear thresholds and feature combinations' },
              { icon: '💡', title: 'Interpretability', desc: 'Produces transparent, human-auditable logic rules' },
            ].map((adv, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-orange-600"
              >
                <div className="text-4xl mb-3">{adv.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{adv.title}</h3>
                <p className="text-gray-600">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border-2 border-orange-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Implementation Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { metric: 'Accuracy', value: '46.5%', meaning: 'Above 4-class random chance (25%)' },
                { metric: 'Precision', value: '48.9%', meaning: 'Weighted average' },
                { metric: 'F1-Score', value: '0.432', meaning: 'True signal extracted from data' },
              ].map((result, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow text-center">
                  <p className="text-sm font-semibold text-orange-700">{result.metric}</p>
                  <p className="text-sm md:text-base md:text-xl font-bold text-gray-900">{result.value}</p>
                  <p className="text-xs text-gray-600">{result.meaning}</p>
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

export default Slide10;
