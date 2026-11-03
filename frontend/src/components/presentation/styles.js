/**
 * Presentation Styling Guide
 * Standard colors, typography, and animations
 */

export const COLORS = {
  // Primaries
  primary: {
    blue: '#1e40af',
    purple: '#7c3aed',
    indigo: '#4f46e5',
  },
  // Secondaries
  secondary: {
    orange: '#ea580c',
    amber: '#d97706',
    red: '#dc2626',
  },
  // Neutrals
  neutral: {
    white: '#ffffff',
    gray100: '#f3f4f6',
    gray900: '#111827',
  },
  // States
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
};

export const TYPOGRAPHY = {
  sizes: {
    h1: 'text-5xl md:text-7xl',
    h2: 'text-4xl md:text-5xl',
    h3: 'text-2xl md:text-3xl',
    body: 'text-lg md:text-xl',
    small: 'text-sm md:text-base',
  },
  weights: {
    light: 'font-light',
    normal: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
};

export const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  },
  item: {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, type: 'spring' },
    },
  },
  slideEnter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  slideCenter: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  slideExit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const SLIDE_STYLES = {
  baseContainer: 'w-full h-full p-8 overflow-hidden',
  title: 'text-5xl font-bold text-gray-900',
  subtitle: 'text-2xl font-bold text-gray-800 mb-6',
  card: 'bg-white rounded-xl p-6 shadow-lg border-t-4',
  button: 'inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r rounded-lg font-bold transition transform hover:scale-105',
};

/**
 * Reusable slide components
 */

export const CardVariants = {
  featured: 'bg-white rounded-xl p-6 shadow-lg border-t-4 hover:shadow-xl transition hover:y-2',
  plain: 'bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20',
  gradient: 'bg-gradient-to-br rounded-xl p-6 shadow-xl',
};

/**
 * Predefined gradients
 */

export const GRADIENTS = {
  slide1: 'from-blue-600 via-purple-600 to-indigo-700',
  slide2: 'from-slate-50 to-blue-50',
  slide3: 'from-slate-50 to-red-50',
  slide4: 'from-slate-50 to-green-50',
  slide5: 'from-slate-50 to-indigo-50',
  slide6: 'from-slate-50 to-cyan-50',
  slide7: 'from-slate-50 to-yellow-50',
  slide8: 'from-slate-50 to-pink-50',
  slide9: 'from-slate-50 to-green-50',
  slide10: 'from-slate-50 to-orange-50',
  slide11: 'from-slate-50 to-purple-50',
  slide12: 'from-slate-50 to-blue-50',
  slide13: 'from-slate-50 to-teal-50',
  slide14: 'from-slate-50 to-lime-50',
  slide15: 'from-slate-900 via-purple-900 to-blue-900',
};

/**
 * Color themes per slide
 */

export const SLIDE_THEMES = {
  1: { primary: 'blue', secondary: 'purple', accent: 'indigo' },
  2: { primary: 'blue', secondary: 'green', accent: 'cyan' },
  3: { primary: 'red', secondary: 'orange', accent: 'amber' },
  4: { primary: 'green', secondary: 'emerald', accent: 'teal' },
  5: { primary: 'indigo', secondary: 'blue', accent: 'purple' },
  6: { primary: 'cyan', secondary: 'blue', accent: 'indigo' },
  7: { primary: 'yellow', secondary: 'orange', accent: 'amber' },
  8: { primary: 'pink', secondary: 'red', accent: 'orange' },
  9: { primary: 'green', secondary: 'emerald', accent: 'teal' },
  10: { primary: 'orange', secondary: 'red', accent: 'pink' },
  11: { primary: 'purple', secondary: 'indigo', accent: 'blue' },
  12: { primary: 'blue', secondary: 'cyan', accent: 'teal' },
  13: { primary: 'teal', secondary: 'cyan', accent: 'blue' },
  14: { primary: 'lime', secondary: 'green', accent: 'emerald' },
  15: { primary: 'purple', secondary: 'blue', accent: 'indigo' },
};

/**
 * Slide icons
 */

export const SLIDE_ICONS = {
  1: '🎓',
  2: '🤖',
  3: '⚠️',
  4: '🎯',
  5: '💡',
  6: '🏗️',
  7: '📦',
  8: '🔧',
  9: '📉',
  10: '🌳',
  11: '🚀',
  12: '⚙️',
  13: '💻',
  14: '📊',
  15: '🎯',
};
