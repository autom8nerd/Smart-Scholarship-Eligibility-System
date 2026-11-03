import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl hover:text-red-200 transition">
            <div className="bg-white text-red-700 p-2 rounded-lg">
              <span className="text-xl">📚</span>
            </div>
            <span>Smart Enrollment</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-red-200 transition">Home</Link>
            <Link to="/details" className="hover:text-red-200 transition">Details</Link>
            <Link to="/confidentiality" className="hover:text-red-200 transition">Confidentiality</Link>

            {isAuthenticated ? (
              <>
                {userRole === 'admin' ? (
                  <Link to="/admin/dashboard" className="hover:text-red-200 transition">Dashboard</Link>
                ) : (
                  <Link to="/student/profile" className="hover:text-red-200 transition">My Profile</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/student-login" className="hover:text-red-200 transition">Student Login</Link>
                <Link to="/admin-login" className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition">Admin Login</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/" className="block hover:text-red-200 transition py-2" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/details" className="block hover:text-red-200 transition py-2" onClick={() => setIsOpen(false)}>Details</Link>
            <Link to="/confidentiality" className="block hover:text-red-200 transition py-2" onClick={() => setIsOpen(false)}>Confidentiality</Link>

            {isAuthenticated ? (
              <>
                {userRole === 'admin' ? (
                  <Link to="/admin/dashboard" className="block hover:text-red-200 transition py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                ) : (
                  <Link to="/student/profile" className="block hover:text-red-200 transition py-2" onClick={() => setIsOpen(false)}>My Profile</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/student-login" className="block hover:text-red-200 transition py-2" onClick={() => setIsOpen(false)}>Student Login</Link>
                <Link to="/admin-login" className="block bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition text-center" onClick={() => setIsOpen(false)}>Admin Login</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
