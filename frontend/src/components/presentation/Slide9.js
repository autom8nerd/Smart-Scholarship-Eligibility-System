import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Slide9 = () => {
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

  // Mock data for regression visualization
  const regressionData = [
    { x: 0, y: 5 },
    { x: 2, y: 10 },
    { x: 4, y: 15 },
    { x: 6, y: 20 },
    { x: 8, y: 25 },
    { x: 10, y: 30 },
    { x: 12, y: 35 },
    { x: 14, y: 40 },
    { x: 16, y: 45 },
    { x: 18, y: 50 },
  ];

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
            <div className="p-3 bg-green-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">📉</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Linear Regression
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Principe */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            💡 Principle
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-green-600">
            <p className="text-gray-700 text-sm md:text-base font-semibold mb-4">
              Linear regression models a mathematical linear relationship:
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-4 border border-green-200">
              <p className="text-center text-sm md:text-base font-mono text-gray-900">
                <span className="font-bold">Score = w₁×x₁ + w₂×x₂ + ... + b</span>
              </p>
              <p className="text-center text-sm text-gray-600 mt-3">
                Where w = weights, x = features, b = bias
              </p>
            </div>
          </div>
        </motion.div>

        {/* Visualization */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📊 Visualization
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={regressionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'Features', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-2 sm:mt-3">
              Fitted line modeling the relationship between input features and target capacity score
            </p>
          </div>
        </motion.div>

        {/* Rôle */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🎯 Role in Our System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '📊', title: 'Continuous Score', desc: 'Predicts financial capacity score (0–100)' },
              { icon: '💡', title: 'Interpretability', desc: 'Highly transparent and explainable model' },
              { icon: '⚡', title: 'Speed', desc: 'Instantaneous deterministic inference' },
            ].map((role, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-t-4 border-green-600"
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Avantages */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ✅ Key Advantage
          </h2>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-8 shadow-xl text-white">
            <div className="flex items-start gap-4">
              <span className="text-2xl sm:text-3xl md:text-4xl">✔️</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Highly Explainable for Administration</h3>
                <p className="text-sm md:text-base opacity-90">
                  Coefficients provide clear attribution: each feature has a quantifiable, auditable effect on the final score.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Implementation Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { metric: 'R² Score', value: '0.285', meaning: '28.5% explained variance' },
                { metric: 'RMSE', value: '12.14', meaning: 'On 0–100 scale' },
                { metric: 'MAE', value: '9.67', meaning: 'Mean absolute error' },
              ].map((result, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow text-center">
                  <p className="text-sm font-semibold text-green-700">{result.metric}</p>
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

export default Slide9;
