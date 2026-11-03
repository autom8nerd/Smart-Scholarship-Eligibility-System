import React from 'react';
import { AlertCircle, Lock, FileText, Eye, Shield, Server } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Confidentiality = ({ isAuthenticated, userRole, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-blue-50">
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />

      {/* Hero - Moroccan Style */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-start space-x-4 mb-4">
            <Shield size={48} className="flex-shrink-0 text-amber-300" />
            <div>
              <h1 className="text-5xl font-bold mb-4">🔒 Privacy & Data Security</h1>
              <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-red-400 mb-4 rounded"></div>
              <p className="text-xl text-blue-100">How we protect your personal and academic information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Warning Box - Moroccan Style */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-600 rounded-xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center space-x-3">
              <AlertCircle className="text-amber-600" size={32} />
              <span>⚠️ Important: Information Integrity & Verification</span>
            </h2>
            <div className="text-amber-900 space-y-4">
              <p className="font-semibold text-lg">By submitting an application, you acknowledge and agree that:</p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start space-x-3">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>All provided information must be <strong>completely accurate and truthful</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Any false, misleading, or fabricated information will result in <strong>immediate disqualification</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Submitting fraudulent documentation may result in <strong>legal proceedings</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>The institution reserves the right to perform a <strong>comprehensive background check</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Applicants agree that verification may include contacting educational institutions and previous employers</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
                <p className="font-semibold text-amber-900 mb-3">📞 Following preliminary acceptance, administration will contact you to:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Schedule an in-person meeting or interview</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Request original documents (degrees, transcripts, identity credentials)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Verify your residential address and contact details</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Conduct final eligibility validation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Discuss terms and conditions of the scholarship award</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection - Moroccan Cards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center space-x-3">
              <Lock className="text-blue-600" size={32} />
              <span>🔐 Data Protection & Security</span>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-500 mb-8 rounded"></div>
            
            <div className="space-y-6">
              {/* Card 1 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-blue-600 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <span>📋</span>
                  <span>1. Information We Collect</span>
                </h3>
                <p className="text-gray-700 mb-4">We collect only essential information:</p>
                <ul className="space-y-2 ml-6 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Identity:</strong> full name, date of birth, national ID/passport</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Contact:</strong> email address, phone number, physical address</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Academic:</strong> exam grades, diplomas, official transcripts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Financial:</strong> family income, dependents, supporting certificates</span>
                  </li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-amber-600 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <span>🔄</span>
                  <span>2. How We Use Your Information</span>
                </h3>
                <p className="text-gray-700 mb-4">Your data is used exclusively for:</p>
                <ul className="space-y-2 ml-6 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>Processing:</strong> Reviewing and validating your application</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>AI/ML:</strong> Predictive models evaluating academic potential and financial need</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>Verification:</strong> Confirming accuracy of submitted records</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600">•</span>
                    <span><strong>Communication:</strong> Transmitting admission and scholarship decisions</span>
                  </li>
                </ul>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-green-600 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>3. Security Protocols</span>
                </h3>
                <p className="text-gray-700 mb-4">We adhere to industry security standards:</p>
                <ul className="space-y-2 ml-6 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Encryption:</strong> HTTPS / TLS encryption for all data in transit</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Access Control:</strong> Strict role-based access control (RBAC)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Database:</strong> Secure authentication with salted and hashed credentials</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Audits:</strong> Routine security reviews and monitoring</span>
                  </li>
                </ul>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-red-600 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <span>📅</span>
                  <span>4. Data Retention</span>
                </h3>
                <p className="text-gray-700 mb-4">Your records are retained under clear guidelines:</p>
                <ul className="space-y-2 ml-6 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span><strong>7 years:</strong> Following graduation (enrolled recipients)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span><strong>3 years:</strong> Post-application (non-enrolled applicants)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">→</span>
                    <span><strong>Indefinite:</strong> Fully anonymized data for statistical research</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compliance - Moroccan Style */}
          <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center space-x-3">
              <Shield className="text-blue-600" size={32} />
              <span>✅ Compliance with International Standards</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🇪🇺</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">GDPR</h4>
                  <p className="text-sm text-gray-700">Data protection principles for European Union users</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🇺🇸</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">CCPA</h4>
                  <p className="text-sm text-gray-700">California Consumer Privacy Act standard protections</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🇮🇳</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">DPDP Act (India)</h4>
                  <p className="text-sm text-gray-700">Compliance with the Digital Personal Data Protection Act and institutional data privacy regulations</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🎓</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">FERPA</h4>
                  <p className="text-sm text-gray-700">Student educational records privacy safeguards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Rights */}
          <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center space-x-3">
              <Eye className="text-blue-600" size={32} />
              <span>👤 Your Rights & Contact Details</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-blue-900 mb-4">You have the right to:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span><strong>Access:</strong> Request a copy of your records</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span><strong>Rectification:</strong> Correct inaccuracies or update data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span><strong>Erasure:</strong> Request data deletion when eligible</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span><strong>Objection:</strong> Object to specific data processing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-900 mb-4">📧 Contact Us:</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>DPO (Data Protection Officer):</strong>
                    <br/><span className="text-blue-600">privacy@smartenrollment.edu</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Administrative Support:</strong>
                    <br/><span className="text-blue-600">admin@smartenrollment.edu</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Response Time:</strong>
                    <br/>Within 30 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-red-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Eye className="text-red-600" size={32} />
              <span>Data Protection and Privacy Inquiries</span>
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions or concerns regarding your data or how it is processed, please contact us:
            </p>
            <div className="bg-white rounded-lg p-4 space-y-2">
              <p><strong>Data Protection Officer:</strong> dpo@smartenrollment.edu</p>
              <p><strong>Privacy Team:</strong> privacy@smartenrollment.edu</p>
              <p><strong>Office Address:</strong> Smart Enrollment Building, 123 University Avenue</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-12 text-center text-gray-600">
            <p>Last updated: January 2026</p>
            <p>This policy is subject to updates. Registered users will be notified of material modifications.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Confidentiality;
