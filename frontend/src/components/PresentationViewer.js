import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Home, Menu, X, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import des slides
import Slide1 from './presentation/Slide1';
import Slide2 from './presentation/Slide2';
import Slide3 from './presentation/Slide3';
import Slide4 from './presentation/Slide4';
import Slide5 from './presentation/Slide5';
import Slide6 from './presentation/Slide6';
import Slide7 from './presentation/Slide7';
import Slide8 from './presentation/Slide8';
import Slide9 from './presentation/Slide9';
import Slide10 from './presentation/Slide10';
import Slide11 from './presentation/Slide11';
import Slide12 from './presentation/Slide12';
import Slide13 from './presentation/Slide13';
import Slide14 from './presentation/Slide14';
import Slide15 from './presentation/Slide15';

const sections = [
  {
    name: 'Introduction',
    slides: [
      { id: 1, title: 'Title Slide', component: Slide1 },
    ],
  },
  {
    name: 'Concepts',
    slides: [
      { id: 2, title: 'Machine Learning', component: Slide2 },
      { id: 3, title: 'Context & Problem Statement', component: Slide3 },
      { id: 4, title: 'Project Objectives', component: Slide4 },
    ],
  },
  {
    name: 'Implementation',
    slides: [
      { id: 5, title: 'Proposed Solution', component: Slide5 },
      { id: 6, title: 'System Architecture', component: Slide6 },
      { id: 7, title: 'Dataset Overview', component: Slide7 },
      { id: 8, title: 'Data Preprocessing', component: Slide8 },
    ],
  },
  {
    name: 'ML Models',
    slides: [
      { id: 9, title: 'Linear Regression', component: Slide9 },
      { id: 10, title: 'Decision Tree', component: Slide10 },
      { id: 11, title: 'SVM (Support Vector Machine)', component: Slide11 },
      { id: 12, title: 'Model Fusion & Consensus', component: Slide12 },
    ],
  },
  {
    name: 'Results',
    slides: [
      { id: 13, title: 'Web Application', component: Slide13 },
      { id: 14, title: 'Evaluation Results', component: Slide14 },
      { id: 15, title: 'Conclusion', component: Slide15 },
    ],
  },
];

// Flatten slides for navigation
const allSlides = sections.flatMap((section) => section.slides);

const PresentationViewer = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      y: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = allSlides.length - 1;
      if (next >= allSlides.length) next = 0;
      return next;
    });
    setShowMenu(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log('Fullscreen not supported:', err);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else if (onClose) {
          onClose();
        }
      }
      if (e.key === 'm' || e.key === 'M') setShowMenu(!showMenu);
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, showMenu, isFullscreen, onClose]);

  const CurrentSlideComponent = allSlides[currentSlide].component;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Full Screen Slide Container */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: 'spring', stiffness: 400, damping: 40 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <CurrentSlideComponent />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition backdrop-blur-md border border-white/20"
          title="Fullscreen (F)"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition backdrop-blur-md border border-white/20"
          title="Menu (M)"
        >
          {showMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Top Left - Return Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition backdrop-blur-md border border-white/20"
          title="Return (Esc)"
        >
          <Home size={20} />
        </button>
      )}

      {/* Section Menu - Side Panel */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, x: 350 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 350 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-80 bg-slate-800/98 backdrop-blur-2xl z-40 border-l border-white/20 overflow-y-auto shadow-2xl"
          >
            <div className="p-5 pt-16">
              <h2 className="text-lg font-bold text-white mb-6">Sections</h2>
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-6">
                  <h3 className="text-xs font-semibold text-blue-400 uppercase mb-3 tracking-wider">
                    {section.name}
                  </h3>
                  <div className="space-y-2">
                    {section.slides.map((slide, slideIdx) => {
                      const globalIdx = sections
                        .slice(0, sectionIdx)
                        .reduce((sum, s) => sum + s.slides.length, 0) + slideIdx;
                      return (
                        <button
                          key={slide.id}
                          onClick={() => {
                            setDirection(globalIdx > currentSlide ? 1 : -1);
                            setCurrentSlide(globalIdx);
                            setShowMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition ${
                            globalIdx === currentSlide
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-sm font-medium">{slide.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {globalIdx + 1} / {allSlides.length}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Left Slide Counter */}
      <div className="absolute bottom-6 left-6 z-40 bg-white/10 backdrop-blur-md text-white px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/20">
        {currentSlide + 1} / {allSlides.length}
      </div>

      {/* Bottom Navigation Arrows */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        <button
          onClick={() => paginate(-1)}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition backdrop-blur-md border border-blue-400/30 shadow-lg hover:shadow-blue-500/50"
          title="Previous (← or click)"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition backdrop-blur-md border border-blue-400/30 shadow-lg hover:shadow-blue-500/50"
          title="Next (→ or click)"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Indicators - Bottom Center */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40 flex gap-1.5 flex-wrap justify-center max-w-2xl px-4">
        {allSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-2 rounded-full transition ${
              index === currentSlide
                ? 'bg-white shadow-lg'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            animate={{
              width: index === currentSlide ? 28 : 8,
            }}
            title={`${index + 1}: ${allSlides[index].title}`}
          />
        ))}
      </div>

      {/* Help Text */}
      <div className="absolute bottom-6 right-6 z-40 text-xs text-gray-300 text-right bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20 font-medium">
        <div className="mb-1">← → : Navigate</div>
        <div className="mb-1">M : Menu</div>
        <div className="mb-1">F : Fullscreen</div>
        <div>Esc : Exit</div>
      </div>
    </div>
  );
};

export default PresentationViewer;
