import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Slide14 = () => {
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

  // Performance data (synthetic dataset, seed 42, 30k rows - see README)
  const performanceData = [
    { model: 'Regression', accuracy: 28.5, f1: 0.285 },
    { model: 'Decision Tree', accuracy: 46.5, precision: 48.9, f1: 0.432 },
    { model: 'SVM', accuracy: 46.9, precision: 45.4, f1: 0.411 },
  ];

  const metricsData = [
    { name: 'Precision', value: 47.1 },
    { name: 'Reliability', value: 95.8 },
    { name: 'Speed', value: 99.2 },
    { name: 'Fairness', value: 97.1 },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-100 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-lime-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">📊</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Evaluation Results
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-lime-600 to-green-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Performances */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🎯 Model Performance Comparison
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="accuracy" fill="#22c55e" name="Accuracy (%)" />
                <Bar dataKey="precision" fill="#3b82f6" name="Precision (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Résultats détaillés */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📈 Detailed Metric Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                icon: '📉',
                model: 'Linear Regression',
                r2: '0.285',
                rmse: '12.14',
                desc: 'True underlying signal on realistic noisy data'
              },
              {
                icon: '🌳',
                model: 'Decision Tree',
                accuracy: '46.5%',
                f1: '0.432',
                desc: 'Well above 4-class random chance (25%)'
              },
              {
                icon: '🚀',
                model: 'SVM (SGD)',
                accuracy: '46.9%',
                f1: '0.411',
                desc: 'Well above 3-class random chance (33%)'
              },
            ].map((result, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-lime-600"
              >
                <div className="text-4xl mb-2">{result.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-4">{result.model}</h3>
                <div className="space-y-2 mb-4">
                  {result.r2 && <p className="text-sm"><span className="font-semibold text-lime-600">R²:</span> {result.r2}</p>}
                  {result.rmse && <p className="text-sm"><span className="font-semibold text-lime-600">RMSE:</span> {result.rmse}</p>}
                  {result.accuracy && <p className="text-sm"><span className="font-semibold text-lime-600">Accuracy:</span> {result.accuracy}</p>}
                  {result.f1 && <p className="text-sm"><span className="font-semibold text-lime-600">F1:</span> {result.f1}</p>}
                </div>
                <p className="text-xs text-gray-600 italic">{result.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Apport ML */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ✅ Machine Learning Value-Add
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '⚖️', title: 'Objective Decisions', desc: 'Grounded in empirical data rather than subjective bias' },
              { icon: '📐', title: 'Mathematical Transparency', desc: 'Every decision outcome can be inspected and justified' },
              { icon: '⚡', title: 'Operational Efficiency', desc: 'Rapid batch processing of large applicant cohorts' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-lime-600"
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global Performance */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🏆 Overall System Quality
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {metricsData.map((metric, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="4"
                        initial={{ strokeDasharray: `0 ${2 * Math.PI * 40}` }}
                        animate={{ strokeDasharray: `${(metric.value / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}` }}
                        transition={{ duration: 2, delay: idx * 0.2 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">{metric.value}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{metric.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-gradient-to-r from-lime-500 to-green-500 rounded-xl p-8 shadow-xl text-white">
            <div className="flex items-start gap-4">
              <span className="text-2xl sm:text-3xl md:text-4xl">✅</span>
              <div>
                <h3 className="text-sm md:text-base md:text-xl font-bold mb-2">Empirical & Transparent Results</h3>
                <p className="text-sm md:text-base opacity-90">
                  Evaluated on a realistic synthetic dataset (30,000 students, fixed seed), the models achieve performance significantly superior to random baseline (~47% weighted precision) while presenting honest, realistic metrics for an inherently noisy real-world prediction challenge.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide14;
