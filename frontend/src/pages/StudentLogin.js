import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import studentService from '../services/studentService';

const StudentLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call backend login endpoint
      const response = await studentService.loginStudent(email, password);
      
      if (!response || !response.etudiant) {
        setError('Incorrect email or password. Please check your credentials.');
        setLoading(false);
        return;
      }
      
      const student = response.etudiant;
      const token = response.token;
      
      // Store student data in localStorage
      localStorage.setItem('studentData', JSON.stringify(student));
      localStorage.setItem('studentEmail', student.email);
      localStorage.setItem('studentId', student.idEtudiant);
      localStorage.setItem('studentToken', token);
      
      // Call onLogin to update application auth state
      onLogin(token, 'student', { 
        email: student.email, 
        name: `${student.prenom} ${student.nom}`, 
        role: 'student',
        id: student.idEtudiant
      });
      
      navigate('/student/profile');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar isAuthenticated={false} userRole={null} onLogout={() => {}} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card - Moroccan Style */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-blue-600">
            {/* Decorative Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 text-center relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-red-500 to-amber-400"></div>
              <div className="inline-block bg-white bg-opacity-20 text-white p-4 rounded-full mb-4 border-2 border-white border-opacity-30">
                <LogIn size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2">Student Login</h1>
              <p className="text-blue-100 text-sm">Access your profile and application tracking</p>
            </div>

            {/* Form Container */}
            <div className="p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded flex items-start space-x-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Password Field with Show/Hide */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🔐 Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-600 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-200 shadow-md"
                >
                  {loading ? '⏳ Logging in...' : '🚀 Log In'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-3 text-gray-500 text-sm">or</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Registration Link */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg">
                <p className="text-gray-700 text-sm">
                  Don't have an account?{' '}
                  <Link to="/student-register" className="font-bold text-blue-600 hover:text-blue-700 underline">
                    Register here
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200 text-center space-y-2 text-sm">
              <div className="flex justify-center space-x-4 text-gray-600">
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  🏠 Home
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/admin-login" className="text-blue-600 hover:text-blue-700 font-medium">
                  🔑 Admin Portal
                </Link>
              </div>
              <p className="text-gray-500 text-xs">
                Need help? Contact administration: admin@institution.edu
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentLogin;
