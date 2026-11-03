import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, BarChart3,
  Plus, Edit2, Trash2, Search, LogOut, Settings, Brain, Download,
  CheckCircle, XCircle, Sparkles, Award, AlertCircle
} from 'lucide-react';
import { 
  AlertModal, ConfirmDialog, SuccessModal, ErrorModal 
} from '../components/Modal';
import { StudentEditModal } from '../components/StudentEditModal';
import AIRecommendationModal from '../components/AIRecommendationModal';
import ModelsVisualization from '../components/ModelsVisualization';
import MLRankingSystem from '../components/MLRankingSystem';
import {
  exportChartAsImage,
  exportChartAsPDF,
  exportStudentsAsCSV,
  exportStatisticsAsCSV
} from '../utils/exportUtils';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import quotaService from '../services/quotaService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import studentService from '../services/studentService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper function to calculate GPA from Moroccan standards
const calculateMoroccanGPA = (student) => {
  if (!student) return 0;
  
  // Try to get from new Moroccan structure first
  const notesRegionales = parseFloat(student.donnees_baccalaureat?.notes_regionales) || 0;
  const noteGenerale = parseFloat(student.donnees_baccalaureat?.note_generale) || 0;
  
  // If we have Moroccan data, calculate GPA
  if (notesRegionales > 0 || noteGenerale > 0) {
    const gpa = (notesRegionales + noteGenerale) / 2;
    return isNaN(gpa) ? 0 : gpa;
  }
  
  // Fallback to old structure if it exists
  const oldGPA = parseFloat(student.gpa) || 0;
  if (oldGPA > 0) {
    return oldGPA;
  }
  
  return 0;
};

const AdminDashboard = ({ onLogout, user }) => {
  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Quotas state
  const [quotas, setQuotas] = useState([]);
  const [newQuotaYear, setNewQuotaYear] = useState(new Date().getFullYear());
  const [newQuotaBourses, setNewQuotaBourses] = useState('');
  const [editingQuotaYear, setEditingQuotaYear] = useState(null);
  
  // Quota limit modal
  const [quotaLimitModal, setQuotaLimitModal] = useState({
    show: false,
    year: null,
    currentQuota: null,
    acceptedCount: null,
    newQuotaValue: '',
    studentId: null
  });
  
  // AI Recommendations state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Tour Guide state
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
  // Modal state
  const [modal, setModal] = useState({
    type: null, // 'success', 'error', 'confirm', 'info'
    title: '',
    message: '',
    details: null
  });
  const [confirmAction, setConfirmAction] = useState(null); // Function to execute on confirm
  
  // Export handlers
  const handleExportChart = async (ref, filename, format = 'png') => {
    try {
      if (!ref || !ref.current) {
        throw new Error('Chart reference not found');
      }
      
      if (format === 'png') {
        await exportChartAsImage(ref.current, filename);
      } else if (format === 'pdf') {
        await exportChartAsPDF(ref.current, filename);
      }
      
      setModal({
        type: 'success',
        title: 'Success',
        message: `Chart successfully exported as ${format.toUpperCase()}!`
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Export Error',
        message: error.message || 'Error exporting chart',
        details: error.toString()
      });
    }
  };

  const handleExportStudents = async () => {
    try {
      exportStudentsAsCSV(students, 'students_' + new Date().toISOString().split('T')[0]);
      setModal({
        type: 'success',
        title: 'Success',
        message: 'Student data successfully exported to CSV!'
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Export Error',
        message: error.message || 'Error exporting student data',
        details: error.toString()
      });
    }
  };

  const handleExportStatistics = async () => {
    try {
      exportStatisticsAsCSV({
        totalStudents: stats.totalStudents,
        approved: stats.approved,
        pending: stats.pending,
        rejected: stats.rejected,
        avgGPA: stats.avgGPA,
        totalScholarship: stats.totalScholarship
      }, 'statistics_' + new Date().toISOString().split('T')[0]);
      setModal({
        type: 'success',
        title: 'Success',
        message: 'Statistics successfully exported to CSV!'
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Export Error',
        message: error.message || 'Error exporting statistics',
        details: error.toString()
      });
    }
  };
  
  const [newStudent, setNewStudent] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    niveau_etude: 'Baccalauréat',
    notes_regionales: '',
    note_generale: '',
    option_bac: 'Maths',
    notes_diplome: '',
    option_diplome: '',
    revenu: '',
    dependants: '',
    distance: '',
    type_sponsorship: 'Complète',
  });

  // Load students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await studentService.getAllStudents(0, 100);
        console.log('Students data from API:', data);
        if (data.etudiants && Array.isArray(data.etudiants)) {
          setStudents(ensureStudentIds(data.etudiants));
        }
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
    loadQuotas();
  }, []);

  // Load quotas
  const loadQuotas = async () => {
    try {
      const data = await quotaService.getAllQuotas();
      if (data.quotas && Array.isArray(data.quotas)) {
        setQuotas(data.quotas);
      }
    } catch (error) {
      console.error('Error loading quotas:', error);
    }
  };

  // Helper function to ensure all students have idEtudiant
  const ensureStudentIds = (studentsList) => {
    return studentsList.map(student => ({
      ...student,
      idEtudiant: student.idEtudiant || student._id || `student_${Math.random()}`
    }));
  };
  
  // Handle quota update when limit reached
  const handleQuotaLimitAccept = async () => {
    try {
      setLoading(true);
      const newQuota = parseInt(quotaLimitModal.newQuotaValue);
      
      if (newQuota <= quotaLimitModal.currentQuota) {
        setModal({
          type: 'error',
          title: 'Error',
          message: 'The new quota must be greater than the current quota'
        });
        setLoading(false);
        return;
      }
      
      // Update quota
      await quotaService.setQuota(quotaLimitModal.year, newQuota);
      await loadQuotas();
      
      // Now approve the student
      await studentService.approveStudent(quotaLimitModal.studentId);
      const data = await studentService.getAllStudents(0, 100);
      if (data.etudiants && Array.isArray(data.etudiants)) {
        setStudents(ensureStudentIds(data.etudiants));
      }
      
      setQuotaLimitModal({ show: false, year: null, currentQuota: null, acceptedCount: null, newQuotaValue: '', studentId: null });
      setModal({
        type: 'success',
        title: 'Success',
        message: `Quota updated to ${newQuota} and student approved!`
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error updating quota and approving student',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle quota creation/update
  const handleSaveQuota = async () => {
    if (!newQuotaBourses || newQuotaBourses < 0) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid number of scholarships'
      });
      return;
    }

    try {
      setLoading(true);
      await quotaService.setQuota(newQuotaYear, parseInt(newQuotaBourses));
      
      setModal({
        type: 'success',
        title: 'Success',
        message: `Quota for ${newQuotaYear} updated successfully!`
      });
      
      setNewQuotaBourses('');
      setEditingQuotaYear(null);
      await loadQuotas();
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error updating quota',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle quota deletion
  const handleDeleteQuota = async (year) => {
    try {
      setLoading(true);
      await quotaService.deleteQuota(year);
      
      setModal({
        type: 'success',
        title: 'Success',
        message: `Quota for ${year} deleted successfully!`
      });
      
      await loadQuotas();
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error deleting quota',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Statistics
  const stats = {
    totalStudents: students.length,
    approved: students.filter(s => s.statut === 'Approuvé').length,
    pending: students.filter(s => s.statut === 'En attente').length,
    rejected: students.filter(s => s.statut === 'Rejeté').length,
    avgGPA: students.length > 0 ? (students.reduce((sum, s) => sum + calculateMoroccanGPA(s), 0) / students.length).toFixed(2) : '0.00',
    scholarshipCount: students.filter(s => s.type_sponsorship && s.type_sponsorship !== 'Aucune').length,
  };

  // Chart data
  const chartData = {
    overviewStatus: {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 2,
      }],
    },
    gpaDistribution: {
      labels: students.slice(0, 10).map(s => `${s?.prenom || 'N/A'}`),
      datasets: [{
        label: 'Moroccan GPA',
        data: students.slice(0, 10).map(s => calculateMoroccanGPA(s)),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      }],
    },
    scholarshipTiers: {
      labels: ['None', 'Partial', 'Half', 'Full'],
      datasets: [{
        data: [
          students.filter(s => s.type_sponsorship === 'Aucune').length,
          students.filter(s => s.type_sponsorship === 'Partielle').length,
          students.filter(s => s.type_sponsorship === 'Moitié').length,
          students.filter(s => s.type_sponsorship === 'Complète').length,
        ],
        backgroundColor: ['#94a3b8', '#fbbf24', '#60a5fa', '#34d399'],
        borderWidth: 2,
      }],
    },
  };

  // State for pagination and filters
  const [studentPage, setStudentPage] = useState(1);
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [quotaPage, setQuotaPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = (student?.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = studentStatusFilter === 'all' || student?.statut === studentStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate students
  const totalStudentPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (studentPage - 1) * ITEMS_PER_PAGE,
    studentPage * ITEMS_PER_PAGE
  );

  // Paginate quotas
  const totalQuotaPages = Math.ceil(quotas.length / ITEMS_PER_PAGE);
  const paginatedQuotas = quotas.slice(
    (quotaPage - 1) * ITEMS_PER_PAGE,
    quotaPage * ITEMS_PER_PAGE
  );

  // Event handlers
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await studentService.registerStudent(newStudent);
      // Reload students
      const data = await studentService.getAllStudents(0, 100);
      if (data.etudiants && Array.isArray(data.etudiants)) {
        setStudents(data.etudiants);
      }
      setNewStudent({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        niveau_etude: 'Baccalauréat',
        notes_regionales: '',
        note_generale: '',
        option_bac: 'Maths',
        notes_diplome: '',
        option_diplome: '',
        revenu: '',
        dependants: '',
        distance: '',
        type_sponsorship: 'Complète',
      });
      setShowAddModal(false);
      setModal({
        type: 'success',
        title: 'Success',
        message: 'Student added successfully!'
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error adding student',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (student) => {
    try {
      setLoading(true);
      // Fetch complete student data from backend
      if (student.idEtudiant) {
        const completeStudent = await studentService.getStudent(student.idEtudiant);
        setSelectedStudent(completeStudent);
      } else {
        setSelectedStudent(student);
      }
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching student:', error);
      // Fallback to using the student from the list
      setSelectedStudent(student);
      setShowEditModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (formData) => {
    try {
      setLoading(true);
      console.log('Form Data received:', formData);
      
      // Transform flat form data into nested structure expected by backend
      const updateData = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        niveau_etude: formData.niveau_etude,
        type_sponsorship: formData.type_sponsorship,
        statut: formData.statut,
        donnees_baccalaureat: {
          notes_regionales: parseFloat(formData.notes_regionales) || 0,
          note_generale: parseFloat(formData.note_generale) || 0,
          option: formData.option_bac || 'Maths'
        }
      };
      
      // Only include diplome data if it has values
      if (formData.notes_diplome || formData.option_diplome) {
        updateData.donnees_diplome = {
          notes_diplome: parseFloat(formData.notes_diplome) || 0,
          option: formData.option_diplome || ''
        };
      }
      
      // Always include financial and contextual data
      updateData.donnees_financieres = {
        revenu: parseFloat(formData.revenu) || 0,
        dependants: parseInt(formData.dependants) || 0
      };
      
      updateData.donnees_contextuelles = {
        distance: parseFloat(formData.distance) || 0
      };
      
      console.log('Update Data being sent:', JSON.stringify(updateData, null, 2));
      console.log('Student ID:', selectedStudent.idEtudiant);
      
      const response = await studentService.updateStudent(selectedStudent.idEtudiant, updateData);
      console.log('Update response:', response);
      
      // Reload students from the server to get fresh data
      const data = await studentService.getAllStudents(0, 100);
      console.log('Students reloaded, count:', data.etudiants?.length);
      
      if (data.etudiants && Array.isArray(data.etudiants)) {
        setStudents(ensureStudentIds(data.etudiants));
        setStudentPage(1); // Reset to first page
      }
      
      setShowEditModal(false);
      setSelectedStudent(null);
      
      // Show success modal
      setTimeout(() => {
        setModal({
          type: 'success',
          title: 'Success',
          message: 'Student updated successfully!'
        });
      }, 100);
    } catch (error) {
      console.error('Update error details:', error);
      console.error('Error response:', error.response?.data);
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error updating student',
        details: error.response?.data?.detail || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    setModal({
      type: 'confirm',
      title: 'Confirmation',
      message: 'Are you sure you want to delete this student? This action cannot be undone.'
    });
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        await studentService.deleteStudent(studentId);
        // Reload students
        const data = await studentService.getAllStudents(0, 100);
        if (data.etudiants && Array.isArray(data.etudiants)) {
          setStudents(ensureStudentIds(data.etudiants));
        }
        setModal({
          type: 'success',
          title: 'Success',
          message: 'Student deleted successfully!'
        });
      } catch (error) {
        setModal({
          type: 'error',
          title: 'Error',
          message: 'Error deleting student',
          details: error.message
        });
      } finally {
        setLoading(false);
      }
    });
  };

  const handleApprove = async (studentId) => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      
      // Check quota for current year
      const yearQuota = quotas.find(q => parseInt(q.annee) === currentYear);
      if (yearQuota) {
        const quota = yearQuota.nombre_bourses;
        // Count already accepted students for this year
        const acceptedCount = students.filter(s => s.statut === 'Approuvé').length;
        
        // If quota reached, show modal instead of approving
        if (acceptedCount >= quota) {
          setLoading(false);
          setQuotaLimitModal({
            show: true,
            year: currentYear,
            currentQuota: quota,
            acceptedCount: acceptedCount,
            newQuotaValue: (quota + 1).toString(),
            studentId: studentId
          });
          return;
        }
      }
      
      // Approve student if quota not reached
      await studentService.approveStudent(studentId);
      // Reload students
      const data = await studentService.getAllStudents(0, 100);
      if (data.etudiants && Array.isArray(data.etudiants)) {
        setStudents(ensureStudentIds(data.etudiants));
      }
      setModal({
        type: 'success',
        title: 'Success',
        message: 'Student approved!'
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error approving student',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (studentId) => {
    try {
      setLoading(true);
      await studentService.rejectStudent(studentId);
      // Reload students
      const data = await studentService.getAllStudents(0, 100);
      if (data.etudiants && Array.isArray(data.etudiants)) {
        setStudents(ensureStudentIds(data.etudiants));
      }
      setModal({
        type: 'success',
        title: 'Success',
        message: 'Student rejected!'
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Error rejecting student',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAIRecommendation = async (student) => {
    try {
      if (!student?.idEtudiant) {
        throw new Error('Student ID not available');
      }

      setLoadingAI(true);
      setSelectedStudent(student);
      
      // Call API to get AI recommendations
      const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiBase}/predictions/etudiant/${student.idEtudiant}/recommandations`);
      
      if (!response.ok) {
        throw new Error('Error retrieving recommendations');
      }
      
      const data = await response.json();
      setAiRecommendations(data);
      setShowAIModal(true);
      
    } catch (error) {
      setModal({
        type: 'error',
        title: 'Error',
        message: 'Unable to load AI recommendations',
        details: error.message
      });
    } finally {
      setLoadingAI(false);
    }
  };

  // Tour Guide Component
  const TourGuide = ({ currentStep, onNextStep, onPreviousStep, onComplete, onNavigateTab }) => {
    const tourSteps = [
      {
        title: "📊 Welcome to the Admin Dashboard",
        description: "You are now in the primary administration interface. Here, you can monitor all aspects of the scholarship admission system. Click 'Next' to get started!",
        tips: ["Overview of key statistics", "Complete student management", "Real-time data analysis"],
        action: null,
        highlight: null
      },
      {
        title: "📈 Overview",
        description: "This tab displays key metrics at a glance: total students, approved, pending, rejected, average GPA, and total scholarships allocated.",
        tips: ["Color-coded metric cards", "Real-time updates", "Quick bird's-eye view"],
        action: () => onNavigateTab('overview'),
        highlight: "overview"
      },
      {
        title: "👥 Student Management",
        description: "Manage the full roster of applicants. You can add new students, edit their profiles, and approve or reject scholarship applications.",
        tips: ["Search and filtering", "Add / Edit / Delete", "AI-assisted approval"],
        action: () => onNavigateTab('students'),
        highlight: "students"
      },
      {
        title: "📊 Data Analytics",
        description: "Explore detailed charts: exam grade distribution, scholarship tiers, application statuses, and statistical distributions.",
        tips: ["Interactive charts", "PDF / PNG export", "Up-to-date data"],
        action: () => onNavigateTab('analytics'),
        highlight: "analytics"
      },
      {
        title: "🧠 Machine Learning Models",
        description: "Run automatic ranking across 3 ML models (Linear Regression, Decision Tree, SVM). Review predictions and AI recommendation rationale for each candidate.",
        tips: ["3 independent models", "Calculated priority scores", "Intelligent recommendations"],
        action: () => onNavigateTab('models'),
        highlight: "models"
      },
      {
        title: "📋 Quota Management",
        description: "Define and manage the number of available scholarships per academic year. Control budgetary ceilings and scholarship allocations.",
        tips: ["Annual quotas", "Flexible allocation", "Approved count tracking"],
        action: () => onNavigateTab('quotas'),
        highlight: "quotas"
      },
      {
        title: "🎉 Congratulations!",
        description: "You have explored all the core capabilities of the system! You are now equipped to manage students and use machine learning to optimize scholarship decisions.",
        tips: ["Start with overview stats", "Import student records", "Run ML ranking models"],
        action: null,
        highlight: null
      }
    ];

    const step = tourSteps[currentStep];
    const isLastStep = currentStep === tourSteps.length - 1;
    const emoji = step.title.split(' ')[0];

    return (
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center p-4">
        {/* Animated Card with Professional Styling */}
        <div className="pointer-events-auto animate-in fade-in zoom-in duration-500 w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-l-8 border-blue-600">
            {/* Header Gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10">{emoji}</div>
              <div className="relative z-10">
                <div className="text-5xl mb-2">{emoji}</div>
                <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
                <div className="h-1 w-20 bg-white/30 rounded"></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{step.description}</p>
              
              {/* Tips Section */}
              {step.tips && (
                <div className="bg-blue-50 rounded-lg p-5 mb-8 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span> Key Takeaways
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-blue-800">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">Step {currentStep + 1} / {tourSteps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-between">
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  ⊗ Exit Guide
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onPreviousStep}
                    disabled={currentStep === 0}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition transform hover:scale-105 active:scale-95"
                  >
                    ← Previous
                  </button>
                  {isLastStep ? (
                    <button
                      onClick={onComplete}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      ✓ Complete Guide
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (step.action) {
                          step.action();
                          setTimeout(onNextStep, 600);
                        } else {
                          onNextStep();
                        }
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      Next → ({tourSteps.length - currentStep - 1} remaining)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tour Overlay Component for highlighting
  const TourOverlay = ({ currentStep }) => {
    const [highlightPos, setHighlightPos] = useState(null);

    useEffect(() => {
      const stepTargets = {
        1: '[data-tour-target="overview"]',
        2: '[data-tour-target="students"]',
        3: '[data-tour-target="analytics"]',
        4: '[data-tour-target="models"]',
        5: '[data-tour-target="quotas"]'
      };

      const selector = stepTargets[currentStep];
      if (selector) {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightPos({
            top: rect.top - 12,
            left: rect.left - 12,
            width: rect.width + 24,
            height: rect.height + 24
          });
        }
      } else {
        setHighlightPos(null);
      }
    }, [currentStep]);

    return (
      <div className="fixed inset-0 z-39 pointer-events-none">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 transition-opacity duration-500" />
        
        {/* Highlight box with professional glow effect */}
        {highlightPos && (
          <>
            {/* Outer glow ring */}
            <div
              className="absolute transition-all duration-500 border-2 border-yellow-300 rounded-xl pointer-events-none opacity-40"
              style={{
                top: `${highlightPos.top - 8}px`,
                left: `${highlightPos.left - 8}px`,
                width: `${highlightPos.width + 16}px`,
                height: `${highlightPos.height + 16}px`,
                boxShadow: '0 0 50px rgba(250, 204, 21, 0.6)'
              }}
            />
            {/* Main highlight */}
            <div
              className="absolute transition-all duration-500 border-3 border-yellow-400 rounded-xl pointer-events-none"
              style={{
                top: `${highlightPos.top}px`,
                left: `${highlightPos.left}px`,
                width: `${highlightPos.width}px`,
                height: `${highlightPos.height}px`,
                boxShadow: '0 0 30px rgba(250, 204, 21, 0.9), 0 0 60px rgba(250, 204, 21, 0.5), inset 0 0 20px rgba(250, 204, 21, 0.1), 0 0 0 6px rgba(250, 204, 21, 0.2)'
              }}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} userRole="admin" onLogout={onLogout} />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 overflow-x-auto border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'models', label: 'ML Models', icon: Brain },
              { id: 'quotas', label: 'Scholarships', icon: Award },
              { id: 'settings', label: 'Guide', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  data-tour-target={tab.id}
                  onClick={() => {
                    // During tour, allow navigation but don't close tour
                    if (tourActive) {
                      // Prevent clicking settings tab during tour
                      if (tab.id === 'settings') return;
                    }
                    setActiveTab(tab.id);
                  }}
                  disabled={tourActive && tab.id === 'settings'}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-semibold transition ${
                    activeTab === tab.id
                      ? 'border-red-700 text-red-700'
                      : 'border-transparent text-gray-600 hover:text-red-700'
                  } ${tourActive && tab.id === 'settings' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="card">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Average GPA</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.avgGPA}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Scholarships Awarded</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.scholarshipCount}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Application Status</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportChart({current: document.getElementById('overview-chart')}, 'application_status', 'png')}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs transition"
                      >
                        <Download size={14} /> PNG
                      </button>
                      <button
                        onClick={() => handleExportChart({current: document.getElementById('overview-chart')}, 'application_status', 'pdf')}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs transition"
                      >
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  </div>
                  <div id="overview-chart">
                    {students.length > 0 ? (
                      <Doughnut data={chartData.overviewStatus} options={{ responsive: true }} />
                    ) : (
                      <p className="text-gray-600">No data available</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Scholarship Tiers</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportChart({current: document.getElementById('scholarship-chart')}, 'scholarship_tiers', 'png')}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs transition"
                      >
                        <Download size={14} /> PNG
                      </button>
                      <button
                        onClick={() => handleExportChart({current: document.getElementById('scholarship-chart')}, 'scholarship_tiers', 'pdf')}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs transition"
                      >
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  </div>
                  <div id="scholarship-chart">
                    {students.length > 0 ? (
                      <Pie data={chartData.scholarshipTiers} options={{ responsive: true }} />
                    ) : (
                      <p className="text-gray-600">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'students' && (
            <div>
              {/* Toolbar */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setStudentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    <Plus size={20} />
                    <span>Add Student</span>
                  </button>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Filter by Status</label>
                    <select
                      value={studentStatusFilter}
                      onChange={(e) => {
                        setStudentStatusFilter(e.target.value);
                        setStudentPage(1);
                      }}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All statuses</option>
                      <option value="Approuvé">✓ Approved</option>
                      <option value="En attente">⏳ Pending</option>
                      <option value="Rejeté">✗ Rejected</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600 pt-2 md:pt-6">
                    Results: <span className="font-semibold">{filteredStudents.length}</span> student(s)
                  </div>
                </div>
              </div>

              {/* Add Student Modal */}
              {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-800 text-white p-6 border-b border-red-900">
                      <h2 className="text-2xl font-bold">Add New Student</h2>
                    </div>

                    {/* Modal Content */}
                    <form onSubmit={handleAddStudent} className="p-6 space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="First Name *"
                            required
                            value={newStudent.prenom}
                            onChange={(e) => setNewStudent({ ...newStudent, prenom: e.target.value })}
                            className="form-input"
                          />
                          <input
                            type="text"
                            placeholder="Last Name *"
                            required
                            value={newStudent.nom}
                            onChange={(e) => setNewStudent({ ...newStudent, nom: e.target.value })}
                            className="form-input"
                          />
                          <input
                            type="email"
                            placeholder="Email Address *"
                            required
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                            className="form-input"
                          />
                          <input
                            type="password"
                            placeholder="Password *"
                            required
                            value={newStudent.password}
                            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                            className="form-input"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number *"
                            required
                            value={newStudent.phone}
                            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                            className="form-input"
                          />
                          <input
                            type="text"
                            placeholder="Address *"
                            required
                            value={newStudent.address}
                            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select
                            value={newStudent.niveau_etude}
                            onChange={(e) => setNewStudent({ ...newStudent, niveau_etude: e.target.value })}
                            className="form-input"
                            required
                          >
                            <option value="Baccalauréat">High School Diploma (Baccalaureate)</option>
                            <option value="Bac+2">Associate Degree (Bac+2)</option>
                            <option value="Bac+3">Bachelor's Degree (Bac+3)</option>
                            <option value="Bac+4">Master 1 (Bac+4)</option>
                          </select>
                          <select
                            value={newStudent.option_bac}
                            onChange={(e) => setNewStudent({ ...newStudent, option_bac: e.target.value })}
                            className="form-input"
                            required
                          >
                            <option value="Maths">Mathematical Sciences</option>
                            <option value="Physique">Physics & Chemistry</option>
                            <option value="SVT">Life and Earth Sciences (SVT)</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            placeholder="Regional Exam Grade (0-20) *"
                            required
                            value={newStudent.notes_regionales}
                            onChange={(e) => setNewStudent({ ...newStudent, notes_regionales: parseFloat(e.target.value) })}
                            className="form-input"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            placeholder="General Bac Grade (0-20) *"
                            required
                            value={newStudent.note_generale}
                            onChange={(e) => setNewStudent({ ...newStudent, note_generale: parseFloat(e.target.value) })}
                            className="form-input"
                          />
                        </div>

                        {/* Diploma Fields - Show only for Bac+2 and above */}
                        {(newStudent.niveau_etude === 'Bac+2' || newStudent.niveau_etude === 'Bac+3' || newStudent.niveau_etude === 'Bac+4') && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">Diploma Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="20"
                                placeholder="Diploma Grade (0-20) *"
                                required={newStudent.niveau_etude !== 'Baccalauréat'}
                                value={newStudent.notes_diplome}
                                onChange={(e) => setNewStudent({ ...newStudent, notes_diplome: parseFloat(e.target.value) })}
                                className="form-input"
                              />
                              <input
                                type="text"
                                placeholder="Diploma Major (e.g. Computer Science) *"
                                required={newStudent.niveau_etude !== 'Baccalauréat'}
                                value={newStudent.option_diplome}
                                onChange={(e) => setNewStudent({ ...newStudent, option_diplome: e.target.value })}
                                className="form-input"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Financial Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="number"
                            placeholder="Annual Income (MAD) *"
                            required
                            value={newStudent.revenu}
                            onChange={(e) => setNewStudent({ ...newStudent, revenu: parseFloat(e.target.value) })}
                            className="form-input"
                          />
                          <input
                            type="number"
                            placeholder="Number of Dependents *"
                            required
                            min="0"
                            value={newStudent.dependants}
                            onChange={(e) => setNewStudent({ ...newStudent, dependants: parseInt(e.target.value) })}
                            className="form-input"
                          />
                          <input
                            type="number"
                            placeholder="Distance to University (km) *"
                            required
                            min="0"
                            value={newStudent.distance}
                            onChange={(e) => setNewStudent({ ...newStudent, distance: parseFloat(e.target.value) })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      {/* Sponsorship Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsorship Type</h3>
                        <select
                          value={newStudent.type_sponsorship}
                          onChange={(e) => setNewStudent({ ...newStudent, type_sponsorship: e.target.value })}
                          className="form-input w-full md:w-1/2"
                          required
                        >
                          <option value="Aucune">None (0%)</option>
                          <option value="Partielle">Partial</option>
                          <option value="Moitié">Half (50%)</option>
                          <option value="Complète">Full (100%)</option>
                        </select>
                      </div>

                      {/* Modal Actions */}
                      <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
                        >
                          {loading ? 'Adding student...' : 'Add Student'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          disabled={loading}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Students Table */}
              <div className="card overflow-x-auto">
                {loading ? (
                  <div className="py-8 text-center text-gray-600">Loading student data...</div>
                ) : students.length === 0 ? (
                  <div className="py-8 text-center text-gray-600">No students found</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">GPA</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Sponsorship Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((student) => (
                        <tr key={student?.idEtudiant} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <span className="font-medium text-gray-900 text-xs">{student?.prenom || ''} {student?.nom || ''}</span>
                          </td>
                          <td className="px-4 py-2 text-gray-600 text-xs">{student?.email || 'N/A'}</td>
                          <td className="px-4 py-2">
                            <span className="font-semibold text-blue-600 text-xs">{calculateMoroccanGPA(student).toFixed(2) || 'N/A'}</span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap inline-block ${
                              student?.statut === 'Approuvé'
                                ? 'bg-green-100 text-green-800'
                                : student?.statut === 'En attente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student?.statut === 'Approuvé' ? 'Approved' : student?.statut === 'En attente' ? 'Pending' : student?.statut === 'Rejeté' ? 'Rejected' : (student?.statut || 'N/A')}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600 text-xs">
                            {student?.type_sponsorship || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1 items-center">
                              {student?.statut === 'En attente' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(student?.idEtudiant)}
                                    className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition"
                                    title="Approve"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleReject(student?.idEtudiant)}
                                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                                    title="Reject"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleAIRecommendation(student)}
                                className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition"
                                title="AI Recommendations"
                                disabled={loadingAI}
                              >
                                <Sparkles size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(student)}
                                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(student?.idEtudiant)}
                                className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalStudentPages > 1 && (
                <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold">{studentPage}</span> of <span className="font-semibold">{totalStudentPages}</span>
                    <span className="ml-4">({filteredStudents.length} total)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStudentPage(Math.max(1, studentPage - 1))}
                      disabled={studentPage === 1}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition"
                    >
                      ← Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setStudentPage(page)}
                          className={`px-3 py-2 rounded-lg font-semibold transition ${
                            studentPage === page
                              ? 'bg-red-700 text-white'
                              : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStudentPage(Math.min(totalStudentPages, studentPage + 1))}
                      disabled={studentPage === totalStudentPages}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Exam Scores Distribution */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Exam Scores Distribution</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportChart({current: document.getElementById('exam-chart-container')}, 'exam_scores', 'png')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                    >
                      <Download size={16} /> PNG
                    </button>
                    <button
                      onClick={() => handleExportChart({current: document.getElementById('exam-chart-container')}, 'exam_scores', 'pdf')}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                    >
                      <Download size={16} /> PDF
                    </button>
                  </div>
                </div>
                <div id="exam-chart-container">
                  {students.length > 0 ? (
                    <Bar
                      data={{
                        labels: students.slice(0, 10).map(s => `${s?.prenom || 'N/A'}`),
                        datasets: [{
                          label: 'General Bac Grade',
                          data: students.slice(0, 10).map(s => parseFloat(s?.donnees_baccalaureat?.note_generale) || 0),
                          backgroundColor: 'rgba(220, 38, 38, 0.5)',
                          borderColor: '#dc2626',
                          borderWidth: 1,
                        }],
                      }}
                      options={{ responsive: true }}
                    />
                  ) : (
                    <p className="text-gray-600">No data available</p>
                  )}
                </div>
              </div>

              {/* GPA Distribution */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">GPA Distribution</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportChart({current: document.getElementById('gpa-chart-container')}, 'gpa_distribution', 'png')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                    >
                      <Download size={16} /> PNG
                    </button>
                    <button
                      onClick={() => handleExportChart({current: document.getElementById('gpa-chart-container')}, 'gpa_distribution', 'pdf')}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                    >
                      <Download size={16} /> PDF
                    </button>
                  </div>
                </div>
                <div id="gpa-chart-container">
                  {students.length > 0 ? (
                    <Line
                      data={chartData.gpaDistribution}
                      options={{ responsive: true }}
                    />
                  ) : (
                    <p className="text-gray-600">No data available</p>
                  )}
                </div>
              </div>

              {/* Export All Statistics */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Data Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleExportStudents}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                  >
                    <Download size={20} /> Export Students (CSV)
                  </button>
                  <button
                    onClick={handleExportStatistics}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                  >
                    <Download size={20} /> Export Statistics (CSV)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODELS TAB */}
          {activeTab === 'models' && (
            <MLRankingSystem />
          )}

          {/* QUOTAS TAB */}
          {activeTab === 'quotas' && (
            <div className="space-y-8">
              {/* New Quota Form */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
                  <Award className="text-red-700" size={28} />
                  <h2 className="text-2xl font-bold text-gray-900">Scholarship Quota Management</h2>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingQuotaYear ? `Edit Quota - ${editingQuotaYear}` : 'Add New Quota'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="number"
                        value={newQuotaYear}
                        onChange={(e) => setNewQuotaYear(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                        min={2020}
                        max={2100}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Scholarships</label>
                      <input
                        type="number"
                        value={newQuotaBourses}
                        onChange={(e) => setNewQuotaBourses(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleSaveQuota}
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        {editingQuotaYear ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quotas Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
                        <th className="px-4 py-3 text-left text-sm font-bold text-red-900">📅 Year</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-red-900">💰 Number of Scholarships</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-red-900">📊 Approved</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-red-900">📆 Created Date</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-red-900">🔄 Last Updated</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-red-900">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotas && quotas.length > 0 ? (
                        paginatedQuotas.map((quota) => (
                          <tr key={quota._id || quota.annee} className="border-b border-gray-200 hover:bg-red-50 transition">
                            <td className="px-4 py-3">
                              <span className="text-lg font-bold text-gray-900">{quota.annee}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-600">{quota.nombre_bourses}</span>
                                <div className="text-xs text-gray-600">scholarships</div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-green-500 h-full transition-all"
                                    style={{
                                      width: `${Math.min((students.filter(s => s?.statut === 'Approuvé' && s?.annee === quota.annee).length / quota.nombre_bourses) * 100, 100)}%`
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  {students.filter(s => s?.statut === 'Approuvé' && s?.annee === quota.annee).length}/{quota.nombre_bourses}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-sm">
                              <div className="flex flex-col gap-1">
                                <span>{quota.date_creation ? new Date(quota.date_creation).toLocaleDateString() : 'N/A'}</span>
                                <span className="text-xs text-gray-500">{quota.date_creation ? new Date(quota.date_creation).toLocaleTimeString() : ''}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-sm">
                              <div className="flex flex-col gap-1">
                                <span>{quota.derniere_mise_a_jour ? new Date(quota.derniere_mise_a_jour).toLocaleDateString() : 'N/A'}</span>
                                <span className="text-xs text-gray-500">{quota.derniere_mise_a_jour ? new Date(quota.derniere_mise_a_jour).toLocaleTimeString() : ''}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setNewQuotaYear(quota.annee);
                                    setNewQuotaBourses(quota.nombre_bourses.toString());
                                    setEditingQuotaYear(quota.annee);
                                  }}
                                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition text-xs"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteQuota(quota.annee)}
                                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition text-xs"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                            <div className="text-lg">📭 No quotas defined</div>
                            <div className="text-sm mt-1">Create a new quota to get started.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Quota Pagination */}
                {totalQuotaPages > 1 && (
                  <div className="flex items-center justify-between mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-sm text-gray-600">
                      Page <span className="font-semibold text-red-700">{quotaPage}</span> of <span className="font-semibold text-red-700">{totalQuotaPages}</span>
                      <span className="ml-4 text-gray-500">({quotas.length} total quotas)</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQuotaPage(Math.max(1, quotaPage - 1))}
                        disabled={quotaPage === 1}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition"
                      >
                        ← Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalQuotaPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setQuotaPage(page)}
                            className={`px-3 py-2 rounded-lg font-semibold transition ${
                              quotaPage === page
                                ? 'bg-red-700 text-white'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setQuotaPage(Math.min(totalQuotaPages, quotaPage + 1))}
                        disabled={quotaPage === totalQuotaPages}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quota Summary */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b-2 border-gray-200">📊 Quota Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-blue-700">💰 Total Scholarships</p>
                      <span className="text-2xl">📅</span>
                    </div>
                    <p className="text-4xl font-bold text-blue-700">
                      {quotas && quotas.length > 0 ? quotas.reduce((sum, q) => sum + q.nombre_bourses, 0) : 0}
                    </p>
                    <p className="text-xs text-blue-600 mt-2">Across all years</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-green-700">📆 Years</p>
                      <span className="text-2xl">🗓️</span>
                    </div>
                    <p className="text-4xl font-bold text-green-700">{quotas && quotas.length > 0 ? quotas.length : 0}</p>
                    <p className="text-xs text-green-600 mt-2">Configured years</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-yellow-700">🎯 Current Year</p>
                      <span className="text-2xl">⭐</span>
                    </div>
                    <p className="text-4xl font-bold text-yellow-700">
                      {quotas && quotas.find(q => q.annee === new Date().getFullYear())?.nombre_bourses || 0}
                    </p>
                    <p className="text-xs text-yellow-600 mt-2">{new Date().getFullYear()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-purple-700">✅ Approved</p>
                      <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-4xl font-bold text-purple-700">
                      {students && students.filter(s => s?.statut === 'Approuvé').length}
                    </p>
                    <p className="text-xs text-purple-600 mt-2">Total approved</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB - STARTER GUIDE */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {!tourActive ? (
                <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-2">🎓 Starter Guide</h3>
                      <p className="text-blue-800">Explore all features of the administrator dashboard</p>
                    </div>
                    <div className="text-5xl">👋</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 mb-6 border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-3">What you will learn:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✓ View statistics, metrics and trends</li>
                      <li>✓ Manage applicant rosters and approve/reject applications</li>
                      <li>✓ Analyze distributions with interactive charts</li>
                      <li>✓ Execute ML models for candidate ranking and priority scores</li>
                      <li>✓ Define and monitor annual scholarship quotas</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setTourActive(true);
                      setTourStep(0);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 text-lg"
                  >
                    ▶️ Start Guide (5 minutes)
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* TOUR OVERLAY - FLOATING MODAL */}
      {tourActive && (
        <>
          <TourGuide 
            currentStep={tourStep}
            onNextStep={() => setTourStep(tourStep + 1)}
            onPreviousStep={() => setTourStep(tourStep - 1)}
            onComplete={() => {
              setTourActive(false);
              setTourStep(0);
              setActiveTab('settings');
            }}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
          />
          <TourOverlay currentStep={tourStep} />
        </>
      )}

      {/* Student Edit Modal */}
      {showEditModal && selectedStudent && (
        <StudentEditModal
          student={selectedStudent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
          onSave={handleSaveEdit}
          isLoading={loading}
        />
      )}

      {/* AI Recommendation Modal */}
      {showAIModal && aiRecommendations && (
        <AIRecommendationModal
          student={selectedStudent}
          recommendations={aiRecommendations}
          onClose={() => {
            setShowAIModal(false);
            setAiRecommendations(null);
          }}
          isOpen={showAIModal}
        />
      )}

      {/* Modal Rendering */}
      {modal.type === 'success' && (
        <SuccessModal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ type: null })}
          autoClose={true}
          autoCloseDelay={2000}
        />
      )}

      {modal.type === 'error' && (
        <ErrorModal
          title={modal.title}
          message={modal.message}
          details={modal.details}
          onClose={() => setModal({ type: null })}
        />
      )}

      {modal.type === 'confirm' && (
        <ConfirmDialog
          title={modal.title}
          message={modal.message}
          onConfirm={() => {
            if (confirmAction) {
              confirmAction();
              setModal({ type: null });
            }
          }}
          onCancel={() => setModal({ type: null })}
          isDangerous={true}
        />
      )}

      {modal.type === 'info' && (
        <AlertModal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ type: null })}
          type="info"
        />
      )}

      {/* Quota Limit Modal */}
      {quotaLimitModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quota Limit Reached</h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-gray-800 font-semibold mb-3">The quota of {quotaLimitModal.currentQuota} scholarships for {quotaLimitModal.year} has been reached!</p>
              <p className="text-gray-600 text-sm mb-4">
                You currently have <strong>{quotaLimitModal.acceptedCount}</strong> approved students.
              </p>
              <p className="text-gray-700 text-sm mb-4">
                To approve this student, you must increase the scholarship quota for {quotaLimitModal.year}.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Quota</label>
              <input
                type="number"
                min={quotaLimitModal.currentQuota + 1}
                value={quotaLimitModal.newQuotaValue}
                onChange={(e) => setQuotaLimitModal({ ...quotaLimitModal, newQuotaValue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={`Minimum: ${quotaLimitModal.currentQuota + 1}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current quota: {quotaLimitModal.currentQuota} | Minimum required: {quotaLimitModal.currentQuota + 1}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setQuotaLimitModal({ show: false, year: null, currentQuota: null, acceptedCount: null, newQuotaValue: '', studentId: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleQuotaLimitAccept}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                disabled={loading || !quotaLimitModal.newQuotaValue || parseInt(quotaLimitModal.newQuotaValue) <= quotaLimitModal.currentQuota}
              >
                {loading ? '...' : '✓ Increase Quota & Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
