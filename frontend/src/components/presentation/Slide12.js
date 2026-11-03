import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Slide12 = () => {
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

  const consensusData = [
    { name: 'Unanimous Approval (3/3)', value: 50, color: '#22c55e' },
    { name: 'Majority Approval (2/3)', value: 30, color: '#eab308' },
    { name: 'Unanimous Rejection', value: 20, color: '#ef4444' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-red-100 p-0 overflow-hidden flex flex-col">
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
            <div className="p-3 bg-blue-600 rounded-xl">
              <span className="text-xl sm:text-2xl md:text-3xl">⚙️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Model Fusion & Consensus Ranking
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mt-2 sm:mt-3" />
        </motion.div>

        {/* Approche */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            🎯 Methodology
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
            <p className="text-gray-700 text-sm md:text-base mb-4 sm:mb-5">
              Each model generates predictions independently. The ensemble consensus engine aggregates the results:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { 
                  icon: '✅', 
                  title: 'Unanimous Consensus', 
                  desc: 'All 3 models agree → High-confidence automated decision' 
                },
                { 
                  icon: '📊', 
                  title: 'Weighted Consensus', 
                  desc: 'Disagreements resolved via normalized score aggregation' 
                },
              ].map((approach, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="text-4xl mb-3">{approach.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{approach.title}</h3>
                  <p className="text-gray-700">{approach.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Flux de Fusion */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📊 Fusion Process
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="space-y-4">
              {[
                { step: 1, icon: '🤖', title: 'Model 1 (Linear Regression)', output: 'Score: 85' },
                { step: 2, icon: '🌳', title: 'Model 2 (Decision Tree)', output: 'Score: 82' },
                { step: 3, icon: '🚀', title: 'Model 3 (SVM Classifier)', output: 'Score: 88' },
              ].map((model, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-600"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl">{model.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{model.title}</p>
                    <p className="text-sm text-gray-600">{model.output}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-center">
              <p className="text-sm md:text-base font-bold">↓ CONSENSUS FUSION ↓</p>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-600 text-center">
              <p className="text-sm text-gray-600 mb-2">Ensemble Consensus Score</p>
              <p className="text-4xl font-bold text-green-600">(85 + 82 + 88) / 3 = 85</p>
              <p className="text-sm md:text-base font-semibold text-green-700 mt-2">✓ APPROVED</p>
            </div>
          </div>
        </motion.div>

        {/* Visualization */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            📊 Decision Distribution
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={consensusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consensusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-2 sm:mt-3">
              Consensus agreement across final scholarship decisions
            </p>
          </div>
        </motion.div>

        {/* Avantages */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm md:text-base md:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
            ✅ Advantages of Consensus Fusion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '✔️', title: 'Robust Decisions', desc: 'Significantly lower false positive rates' },
              { icon: '⚖️', title: 'Mitigates Bias', desc: 'Offsets individual model inductive biases' },
              { icon: '📈', title: 'Higher Confidence', desc: 'Multi-model agreement guarantees dependable results' },
            ].map((adv, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-blue-600"
              >
                <div className="text-4xl mb-3">{adv.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">{adv.title}</h3>
                <p className="text-gray-600">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Slide12;
