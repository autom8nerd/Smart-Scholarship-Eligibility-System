import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Award, Users, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = ({ isAuthenticated, userRole, onLogout }) => {
  // Zelij Pattern SVG
  const ZelijPattern = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="zelij" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="currentColor" opacity="0.05"/>
          <path d="M20,0 L40,20 L20,40 L0,20 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
          <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <rect x="10" y="10" width="20" height="20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#zelij)"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-blue-50">
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />

      {/* Hero Section - Moroccan Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-24">
        {/* Zelij Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <ZelijPattern className="w-full h-full text-white" />
        </div>
        
        {/* Geometric Border Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-amber-500 bg-opacity-30 rounded-full border border-amber-300">
                <span className="text-amber-200 font-semibold text-sm">🎓 Academic Excellence at NIT Hamirpur</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                Transform Your Future
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Access an intelligent scholarship distribution system powered by machine learning. Merit and need-based scholarship opportunities for qualified students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/student-register" className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-500 text-blue-900 hover:from-amber-300 hover:to-amber-400 px-8 py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg">
                  <span>Apply Now</span>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/details" className="px-8 py-3 border-2 border-amber-400 rounded-lg font-bold hover:bg-amber-400 hover:text-blue-900 transition">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              {/* Geometric Design */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-red-500 opacity-20 rounded-3xl transform rotate-6 blur-xl"></div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-8 relative z-10 border-2 border-amber-200">
                <div className="text-center">
                  <div className="text-7xl mb-4">🎓</div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-2">100% Sponsorship</h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-500 mx-auto mb-4 rounded"></div>
                  <p className="text-gray-700">For qualified and meritorious students</p>
                  <div className="mt-6 text-sm text-gray-600">
                    <p className="font-semibold mb-2">Minimum Requirements:</p>
                    <p>✓ Overall CGPA ≥ 6.5 / 10.0</p>
                    <p>✓ Demonstrated financial need</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* School Heritage Section - Moroccan Heritage */}
      <section className="py-20 md:py-28 relative">
        {/* Zelij Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <ZelijPattern className="w-full h-full text-blue-900" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">About Our Institution</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 mx-auto rounded mb-6"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Leader in technical education and research excellence at NIT Hamirpur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Heritage Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-t-4 border-blue-600">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="p-8">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Heritage</h3>
                <div className="h-0.5 w-12 bg-amber-500 mb-4 rounded"></div>
                <p className="text-gray-700 leading-relaxed">
                  Established in 1986, National Institute of Technology Hamirpur (NIT Hamirpur) is an institute of national importance committed to technical excellence, research, and societal impact.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-t-4 border-amber-600">
              <div className="h-2 bg-gradient-to-r from-amber-600 to-orange-500"></div>
              <div className="p-8">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h3>
                <div className="h-0.5 w-12 bg-blue-600 mb-4 rounded"></div>
                <p className="text-gray-700 leading-relaxed">
                  Provide world-class education that empowers students to reach their full potential. We believe that educational excellence must be accessible to all, regardless of financial background.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-t-4 border-red-600">
              <div className="h-2 bg-gradient-to-r from-red-600 to-red-400"></div>
              <div className="p-8">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h3>
                <div className="h-0.5 w-12 bg-amber-500 mb-4 rounded"></div>
                <p className="text-gray-700 leading-relaxed">
                  Become a globally recognized institution for academic excellence and innovation. Train ethical and responsible engineers and leaders who contribute to the progress of the nation and the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 100% Sponsorship Section - Moroccan Style */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 relative">
        {/* Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-red-600"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              100% Sponsorship Opportunities
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 mx-auto rounded mb-6"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Comprehensive support for deserving students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Complete Coverage Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-l-4 border-blue-600">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex items-center space-x-4">
                <Award className="flex-shrink-0" size={32} />
                <h3 className="text-2xl font-bold">Full Coverage</h3>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Full tuition fees for all programs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Housing and meals provided</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Books and learning materials</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Monthly living allowance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Comprehensive health insurance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Benefits Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-l-4 border-amber-600">
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white p-6 flex items-center space-x-4">
                <Zap className="flex-shrink-0" size={32} />
                <h3 className="text-2xl font-bold">Additional Benefits</h3>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Corporate internship opportunities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Mentorship and career guidance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Access to modern campus facilities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">International exchange programs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">Personalized academic support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Moroccan Eligibility Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-red-600">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-8 flex items-center space-x-4">
              <Users className="flex-shrink-0" size={32} />
              <h3 className="text-2xl font-bold">Eligibility Criteria</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border-l-4 border-blue-600 pl-6">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">📚 Academic Excellence</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Minimum overall CGPA of <span className="font-semibold">6.5 / 10</span>. Strong performance in mathematics and core disciplines. For higher semesters: minimum <span className="font-semibold">6.0 / 10</span>.
                  </p>
                </div>
                <div className="border-l-4 border-amber-600 pl-6">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">💰 Financial Need</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Demonstrated family income need with supporting documents. Priority for low-to-middle income families. Comprehensive economic evaluation required.
                  </p>
                </div>
                <div className="border-l-4 border-red-600 pl-6">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">⭐ Character & Commitment</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Strong recommendation letters, community involvement, and leadership qualities. Clear demonstration of commitment to academic and professional success.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
                  <span className="text-lg">🏛️</span>
                  <span>Institutional Eligibility Guidelines</span>
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">✓</span>
                    <span>Enrolled full-time student in an approved degree program</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">✓</span>
                    <span>Valid standardized academic credentials and verified transcripts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">✓</span>
                    <span>Priority consideration given to economically weaker sections and high achievers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action - Moroccan Style */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20 md:py-24 overflow-hidden">
        {/* Zelij Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <ZelijPattern className="w-full h-full text-white" />
        </div>

        {/* Geometric Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Ready to Transform Your Future?</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-red-400 mx-auto rounded mb-8"></div>
          <p className="text-xl mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of scholarship recipients who have transformed their lives through educational excellence. Your academic merit and dedication deserve support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student-register" className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-blue-900 font-bold rounded-lg hover:from-amber-300 hover:to-amber-400 transition transform hover:scale-105 shadow-lg">
              Start Your Application
            </Link>
            <Link to="/details" className="px-8 py-3 border-2 border-amber-400 rounded-lg font-bold hover:bg-amber-400 hover:text-blue-900 transition">
              Learn More About Programs
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-400 border-opacity-30">
            <p className="text-blue-100 text-sm">
              📞 Contact our admissions team for more information | 📧 admission@institution.edu
            </p>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎓 Project Presentation
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Discover our Machine Learning-powered intelligent admission and scholarship system
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 hover:bg-white/15 transition">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Smart Enrollment & Scholarship System
                </h3>
                <p className="text-purple-200 mb-6">
                  An interactive presentation covering 3 ML models, system architecture, and empirical results
                </p>
              </div>
              <Link
                to="/presentation-landing"
                className="inline-block w-full text-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Launch Interactive Presentation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
