import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Smart Enrollment</h3>
            <p className="text-gray-400">
              Intelligent scholarship distribution system powered by machine learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/details" className="hover:text-white transition">Details</Link></li>
              <li><Link to="/confidentiality" className="hover:text-white transition">Confidentiality</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400">
              Email: info@smartenrollment.edu<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-400">
              <button className="hover:text-white transition">Facebook</button>
              <button className="hover:text-white transition">Twitter</button>
              <button className="hover:text-white transition">LinkedIn</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm space-y-1.5">
          <p className="text-gray-200 font-semibold">National Institute of Technology Hamirpur (NIT Hamirpur)</p>
          <p className="text-gray-300">
            Developed by: <span className="text-white font-medium">Akash Mavi, Akshay Kumar, Akshita Sharma, Amit Kumar, Ancil</span>
          </p>
          <p className="text-gray-300">
            Supervised by: <span className="text-white font-medium">Dr. Sangeeta Sharma</span>
          </p>
          <p className="text-xs text-gray-500 pt-2">&copy; 2025–2026 Smart Enrollment &amp; Scholarship System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
