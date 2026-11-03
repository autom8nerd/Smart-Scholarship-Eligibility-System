import React, { useState } from 'react';
import { FileText, BookOpen, Users, TrendingUp, Award, Globe, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Details = ({ isAuthenticated, userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState('programs');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const programs = [
    {
      name: 'Bachelor of Engineering',
      duration: '4 years',
      description: 'Comprehensive engineering program covering civil, mechanical, electrical, and software engineering disciplines.',
      specializations: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Software Engineering'],
      icon: '🏗️'
    },
    {
      name: 'Bachelor of Business Administration',
      duration: '4 years',
      description: 'Prepare for leadership roles in business with courses in management, finance, marketing, and entrepreneurship.',
      specializations: ['Finance', 'Marketing', 'Management', 'Entrepreneurship'],
      icon: '💼'
    },
    {
      name: 'Bachelor of Computer Science',
      duration: '4 years',
      description: 'Master modern programming, algorithms, AI, and machine learning in a cutting-edge curriculum.',
      specializations: ['Artificial Intelligence', 'Data Science', 'Cybersecurity', 'Web Development'],
      icon: '💻'
    },
    {
      name: 'Bachelor of Liberal Arts',
      duration: '4 years',
      description: 'Explore humanities, social, and natural sciences with flexibility in course selection.',
      specializations: ['Psychology', 'History', 'Literature', 'Political Science'],
      icon: '📚'
    }
  ];

  const processSteps = [
    {
      number: '1',
      title: 'Submit an Application',
      description: 'Complete the online application form with your personal, academic, and financial information.',
      icon: '📝'
    },
    {
      number: '2',
      title: 'AI Evaluation',
      description: 'Our ML models analyze your profile to assess academic potential and financial need.',
      icon: '🤖'
    },
    {
      number: '3',
      title: 'Document Verification',
      description: 'Submit supporting documents (transcripts, proof of income, identity documents, etc.).',
      icon: '📋'
    },
    {
      number: '4',
      title: 'Interview',
      description: 'Attend an interview with our admissions team to discuss your goals and eligibility.',
      icon: '💬'
    },
    {
      number: '5',
      title: 'Decision',
      description: 'Receive notification regarding your admission and scholarship award level.',
      icon: '✅'
    },
    {
      number: '6',
      title: 'Enrollment',
      description: 'Complete the enrollment process and begin your academic journey with us.',
      icon: '🎓'
    }
  ];

  const faqs = [
    {
      question: 'What are the minimum academic requirements?',
      answer: 'A minimum overall grade of 12/20 on the Baccalaureate or equivalent. You must also demonstrate solid performance in core subjects such as mathematics and languages.'
    },
    {
      question: 'How is financial need evaluated?',
      answer: 'We evaluate financial need through a comprehensive assessment of family income, assets, dependents, and regional cost of living. Our ML models assist in ranking candidates fairly.'
    },
    {
      question: 'Can I work while studying?',
      answer: 'Yes, scholarship recipients are permitted to work up to 20 hours per week during the academic year. We also offer on-campus student employment opportunities.'
    },
    {
      question: 'Are scholarships renewable?',
      answer: 'Yes, scholarships are renewed annually, provided the student maintains a minimum GPA of 11/20 and demonstrates satisfactory academic progress.'
    },
    {
      question: 'Can international students apply?',
      answer: 'Absolutely! We welcome students from North Africa, the Middle East, and worldwide. All eligible applicants may apply for scholarship support.'
    },
    {
      question: 'What is the application deadline?',
      answer: 'Applications are accepted on a rolling basis. However, priority consideration is given to applications submitted before March 31 for fall enrollment.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-blue-50">
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />

      {/* Hero Section - Moroccan Style */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Program Details</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-red-400 mb-6 rounded"></div>
          <p className="text-xl text-blue-100 max-w-2xl">Complete information about our programs of excellence and the intelligent application process</p>
        </div>
      </section>

      {/* Tabs - Moroccan Style */}
      <section className="bg-white border-b-2 border-blue-200 sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-1">
            <button
              onClick={() => setActiveTab('programs')}
              className={`py-4 px-6 font-bold border-b-4 transition whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'programs'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <BookOpen size={20} />
              <span>Programs</span>
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`py-4 px-6 font-bold border-b-4 transition whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'process'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <TrendingUp size={20} />
              <span>Application Process</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-4 px-6 font-bold border-b-4 transition whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'faq'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <FileText size={20} />
              <span>FAQ</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div>
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-blue-900 mb-4">🎓 Our Academic Programs</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-500 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programs.map((program, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-t-4 border-blue-600">
                    <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-6 flex items-center space-x-4">
                      <span className="text-5xl">{program.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-blue-900">{program.name}</h3>
                        <p className="text-amber-600 font-semibold">⏱️ {program.duration}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 mb-6 leading-relaxed">{program.description}</p>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                          <span>📌 Specializations:</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {program.specializations.map((spec, i) => (
                            <span key={i} className="bg-gradient-to-r from-blue-100 to-amber-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                              ✓ {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process Tab */}
          {activeTab === 'process' && (
            <div>
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-blue-900 mb-4">🚀 Application Process</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-500 rounded"></div>
              </div>
              <div className="relative">
                {/* Vertical Timeline */}
                <div className="space-y-6">
                  {processSteps.map((step, index) => (
                    <div key={index} className="relative flex gap-6">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold text-lg flex-shrink-0 border-4 border-white shadow-lg">
                          {step.number}
                        </div>
                        {index < processSteps.length - 1 && (
                          <div className="w-1 bg-gradient-to-b from-blue-500 to-blue-300 h-16 mt-2"></div>
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 pt-2 pb-6">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-amber-500">
                          <div className="flex items-start space-x-3">
                            <span className="text-3xl">{step.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold text-blue-900 mb-2">{step.title}</h3>
                              <p className="text-gray-700">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div>
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-blue-900 mb-4">❓ Frequently Asked Questions</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-500 rounded"></div>
              </div>
              <div className="space-y-4 max-w-4xl">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-blue-600">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-50 transition"
                    >
                      <h3 className="text-lg font-bold text-blue-900 flex-1">{faq.question}</h3>
                      <ChevronDown
                        size={24}
                        className={`text-blue-600 flex-shrink-0 transition transform ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6 bg-blue-50 border-t border-blue-200">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section - Moroccan Styled */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur border border-white border-opacity-20">
              <Globe className="mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold mb-2">🏫 Modern Campus</h3>
              <p className="text-blue-100">Located in the heart of Morocco with ultra-modern facilities</p>
            </div>
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur border border-white border-opacity-20">
              <Users className="mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold mb-2">👥 12,000+ Students</h3>
              <p className="text-blue-100">Diverse student body representing 50+ countries</p>
            </div>
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur border border-white border-opacity-20">
              <Award className="mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold mb-2">👨‍🎓 Expert Faculty</h3>
              <p className="text-blue-100">Doctorate holders and recognized industry professionals</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Details;
