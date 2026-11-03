import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Home, GitBranch, Database, Zap } from 'lucide-react';

const PresentationLanding = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <div className="text-white font-bold">Smart Enrollment</div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            <Home size={20} /> Home
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Interactive Presentation
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8">
              Smart Enrollment & Scholarship Management System
            </p>
            <p className="text-lg text-white/70">
              Powered by Machine Learning
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <button
              onClick={() => navigate('/presentation')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              <Play size={24} />
              <span className="text-lg">Launch Presentation</span>
            </button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: '📊', title: '15 Slides', desc: 'Covering every aspect of the project' },
              { icon: '🎨', title: '3D Animations', desc: 'Smooth and engaging transitions' },
              { icon: '📈', title: 'ML Visualizations', desc: 'Detailed charts for each model' },
              { icon: '🔄', title: 'Intuitive Navigation', desc: 'Keyboard and mouse controls' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ y: -8 }}
                className={`p-6 rounded-xl backdrop-blur-lg border transition ${
                  hoveredFeature === idx
                    ? 'bg-white/20 border-white/40 shadow-xl'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Sections */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database size={32} />,
                title: 'Architecture',
                points: [
                  'Frontend React 18',
                  'Backend FastAPI',
                  'MongoDB Atlas',
                  'Scikit-learn ML',
                ],
              },
              {
                icon: <Zap size={32} />,
                title: 'ML Models',
                points: [
                  'Linear Regression',
                  'Decision Tree',
                  'Support Vector Machine',
                  'Consensus Ranking',
                ],
              },
              {
                icon: <GitBranch size={32} />,
                title: 'Results',
                points: [
                  'Accuracy: 94-98%',
                  'Precision: 95%+',
                  'F1-Score: 0.93+',
                  'Reliable Outcomes',
                ],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 hover:bg-white/15 transition"
              >
                <div className="text-blue-400 mb-4">{section.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-lg py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/60 text-sm">
          <p>Academic Year 2025 - 2026</p>
          <p>Smart Enrollment & Scholarship Management System</p>
        </div>
      </div>
    </div>
  );
};

export default PresentationLanding;
