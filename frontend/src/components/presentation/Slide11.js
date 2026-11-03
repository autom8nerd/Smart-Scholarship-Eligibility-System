import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Slide11 = () => {
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

  // Mock data for SVM visualization
  const svmData = [
    { x: 2, y: 2, class: 'Approved' },
    { x: 3, y: 4, class: 'Approved' },
    { x: 4, y: 5, class: 'Approved' },
    { x: 5, y: 6, class: 'Approved' },
    { x: 8, y: 2, class: 'Rejected' },
    { x: 9, y: 3, class: 'Rejected' },
    { x: 10, y: 4, class: 'Rejected' },
    { x: 11, y: 5, class: 'Rejected' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-purple-100 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-purple-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">🚀</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              SVM (Support Vector Machine)
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Principe */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            💡 Principle
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-600">
            <p className="text-gray-700 text-sm md:text-base mb-4 sm:mb-5">
              SVM finds the <span className="font-semibold text-purple-600">optimal hyperplane</span> separating eligible from ineligible applicants with the <span className="font-semibold">maximum margin</span>.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mb-2">✓</div>
                  <p className="text-sm font-semibold text-gray-900">Approved</p>
                </div>
                <div className="text-3xl text-purple-600">| ← Margin → |</div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mb-2">✗</div>
                  <p className="text-sm font-semibold text-gray-900">Rejected</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                A wider geometric margin guarantees stronger model generalization
              </p>
            </div>
          </div>
        </motion.div>

        {/* Visualization */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📊 Visualization - Maximum Margin Classification
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" label={{ value: 'Feature 1', position: 'bottom' }} />
                <YAxis type="number" dataKey="y" label={{ value: 'Feature 2', angle: -90, position: 'insideLeft' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={svmData.filter(d => d.class === 'Approved')} fill="#22c55e" name="Approved" />
                <Scatter data={svmData.filter(d => d.class === 'Rejected')} fill="#ef4444" name="Rejected" />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-2 sm:mt-3">
              Data points separated by the maximal margin decision boundary
            </p>
          </div>
        </motion.div>

        {/* Pourquoi SVM */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ✅ Why Support Vector Machines?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '📈', title: 'High Dimensionality', desc: 'Highly effective in multidimensional feature spaces' },
              { icon: '🎯', title: 'Generalization', desc: 'Superior out-of-sample prediction stability' },
              { icon: '🛡️', title: 'Robustness', desc: 'Max-margin penalty prevents overfitting' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-purple-600"
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rôle dans le projet */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🎯 Role in Our System
          </h2>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-8 shadow-xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: '📊', title: 'Enrollment Likelihood', desc: 'Predicts student enrollment probability (Low/Med/High)' },
                { icon: '🔍', title: 'Complex Boundaries', desc: 'Learns intricate non-linear decision boundaries' },
              ].map((role, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-3">{role.icon}</div>
                  <h3 className="font-bold text-sm md:text-base mb-2">{role.title}</h3>
                  <p className="opacity-90">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Implementation Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { metric: 'Accuracy', value: '94.13%', meaning: 'Excellent accuracy' },
                { metric: 'Precision', value: '94.8%', meaning: 'High reliability' },
                { metric: 'F1-Score', value: '0.9336', meaning: 'Strong harmonic balance' },
              ].map((result, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow text-center">
                  <p className="text-sm font-semibold text-purple-700">{result.metric}</p>
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

export default Slide11;
