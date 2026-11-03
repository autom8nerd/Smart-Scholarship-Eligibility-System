import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Details from './pages/Details';
import Confidentiality from './pages/Confidentiality';
import StudentProfile from './pages/StudentProfile';
import PrivateRoute from './components/PrivateRoute';
import PresentationLanding from './pages/PresentationLanding';
import PresentationPage from './pages/PresentationPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogin = (token, role, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUserRole(role);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />} />
        <Route path="/details" element={<Details isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />} />
        <Route path="/confidentiality" element={<Confidentiality isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />} />
        <Route path="/presentation-landing" element={<PresentationLanding />} />
        <Route path="/presentation" element={<PresentationPage />} />
        
        {/* Authentication Routes */}
        <Route path="/admin-login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/admin/dashboard" />} />
        <Route path="/student-login" element={!isAuthenticated ? <StudentLogin onLogin={handleLogin} /> : <Navigate to="/student/profile" />} />
        <Route path="/student-register" element={!isAuthenticated ? <StudentRegister onLogin={handleLogin} /> : <Navigate to="/student/profile" />} />

        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated} role="admin" userRole={userRole}><AdminDashboard onLogout={handleLogout} user={user} /></PrivateRoute>} />
        <Route path="/student/profile" element={<PrivateRoute isAuthenticated={isAuthenticated} role="student" userRole={userRole}><StudentProfile onLogout={handleLogout} user={user} /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
