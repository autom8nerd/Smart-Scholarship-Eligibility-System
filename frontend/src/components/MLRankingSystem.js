import React, { useState, useEffect } from 'react';
import mlRankingService from '../services/mlRankingService';
import {
  Brain, Zap, TrendingUp, Users, CheckCircle,
  BarChart3, Award, AlertCircle, Loader, Activity, Lightbulb
} from 'lucide-react';

const MLRankingSystem = () => {
  const [activeTab, setActiveTab] = useState('models-info');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modelsInfo, setModelsInfo] = useState(null);
  const [rankingData, setRankingData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load models information on mount
  useEffect(() => {
    const loadModelsInfo = async () => {
      try {
        setLoading(true);
        const data = await mlRankingService.getModelsInfo();
        setModelsInfo(data);
      } catch (err) {
        console.error('Error loading models info:', err);
        setError('Error loading model information');
      } finally {
        setLoading(false);
      }
    };
    
    loadModelsInfo();
  }, []);

  // Load ranking data when year changes
  useEffect(() => {
    if (activeTab === 'rankings') {
      loadRankingData();
    }
  }, [selectedYear, activeTab]);

  const loadRankingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ranking = await mlRankingService.rankStudentsByYear(selectedYear);
      const summary = await mlRankingService.getRankingSummary(selectedYear);
      
      setRankingData(ranking);
      setSummaryData(summary);
    } catch (err) {
      console.error('Error loading ranking data:', err);
      setError(err.response?.data?.detail || 'Error loading machine learning predictions');
    } finally {
      setLoading(false);
    }
  };

  const StudentRankingTable = ({ candidates, modelName }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">GPA</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Income</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dependents</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Scholarship Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
          </tr>
        </thead>
        <tbody>
          {candidates && candidates.length > 0 ? (
            candidates.map((student, index) => (
              <tr key={student.idEtudiant || index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-bold text-red-600">{index + 1}</td>
                <td className="px-4 py-3 text-gray-900">
                  <div>
                    <p className="font-semibold">{student.prenom} {student.nom}</p>
                    <p className="text-xs text-gray-600">{student.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900 font-semibold">{student.gpa?.toFixed(2) || 'N/A'}/10</td>
                <td className="px-4 py-3 text-gray-900">₹{student.revenu?.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-900">{student.dependants}</td>
                <td className="px-4 py-3 text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    {student.type_sponsorship}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-sm">
                    {modelName === 'regression' ? student.score_regression : 
                     modelName === 'arbre' ? student.score_arbre : 
                     student.score_svm}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                No students to rank
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const ModelCard = ({ model, info }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{info.nom}</h3>
        <Brain className="text-red-600" size={24} />
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">How It Works</h4>
          <p className="text-sm text-gray-600">{info.fonctionnement}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Capacity</h4>
          <p className="text-sm text-gray-600">{info.capacite}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Strengths</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {info.forces.map((force, idx) => (
              <li key={idx}>{force}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Limitations</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {info.limites.map((limite, idx) => (
              <li key={idx}>{limite}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Features Used</h4>
          <div className="flex flex-wrap gap-2">
            {info.features_utilisees.map((feature, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('models-info')}
          className={`px-6 py-4 font-semibold border-b-2 transition ${
            activeTab === 'models-info'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-gray-600 hover:text-red-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Brain size={20} />
            <span>Models Overview</span>
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab('rankings')}
          className={`px-6 py-4 font-semibold border-b-2 transition ${
            activeTab === 'rankings'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-gray-600 hover:text-red-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>Candidate Rankings</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('student-analysis')}
          className={`px-6 py-4 font-semibold border-b-2 transition ${
            activeTab === 'student-analysis'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-gray-600 hover:text-red-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Users size={20} />
            <span>Detailed Analysis</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('how-it-works')}
          className={`px-6 py-4 font-semibold border-b-2 transition ${
            activeTab === 'how-it-works'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-gray-600 hover:text-red-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Lightbulb size={20} />
            <span>How It Works</span>
          </span>
        </button>
      </div>

      {/* MODELS INFO TAB */}
      {activeTab === 'models-info' && (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Machine Learning Prediction System</h2>
            <p className="text-blue-800">
              Our system utilizes 3 independent machine learning models to rank candidates based on academic
              merit and financial necessity. Each model learns distinct relationships across student features
              to deliver optimal scholarship recommendations.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="text-red-600 animate-spin" size={40} />
            </div>
          ) : modelsInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modelsInfo.models && (
                <>
                  <ModelCard
                    model="regression_lineaire"
                    info={modelsInfo.models.regression_lineaire}
                  />
                  <ModelCard
                    model="arbre_decision"
                    info={modelsInfo.models.arbre_decision}
                  />
                  <ModelCard
                    model="svm"
                    info={modelsInfo.models.svm}
                  />
                </>
              )}
            </div>
          ) : null}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">How It Operates</h3>
                <ul className="text-sm text-yellow-800 space-y-2 list-disc list-inside">
                  <li>Each model learns unique patterns between academic/financial inputs and enrollment/success outcomes</li>
                  <li>Models are trained on historical student records with validated evaluations</li>
                  <li>Every candidate receives a standardized 0-100 score from each model</li>
                  <li>Individual predictions are synthesized into a weighted consensus ranking</li>
                  <li>The top N candidates (matching the annual scholarship quota) are recommended for approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RANKINGS TAB */}
      {activeTab === 'rankings' && (
        <div className="space-y-8">
          {/* Year Selector */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Academic Year</label>
            <div className="flex items-center space-x-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
              >
                {[2024, 2025, 2026, 2027, 2028].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <button
                onClick={loadRankingData}
                disabled={loading}
                className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="text-red-600 animate-spin" size={40} />
            </div>
          ) : summaryData && rankingData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Annual Quota</p>
                  <p className="text-3xl font-bold text-blue-900">{summaryData?.quota || 0}</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-semibold mb-1">Approved Students</p>
                  <p className="text-3xl font-bold text-green-900">{summaryData?.approved_count !== undefined ? summaryData.approved_count : 0}</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Consensus (3/3 models)</p>
                  <p className="text-3xl font-bold text-purple-900">{summaryData?.consensus_count || 0}</p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-600 font-semibold mb-1">Remaining Quota</p>
                  <p className="text-3xl font-bold text-orange-900">{summaryData?.quota_remaining !== undefined ? summaryData.quota_remaining : 0}</p>
                </div>
              </div>

              {/* Consensus Section */}
              {summaryData.consensus_count > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">
                      Consensus Candidates ({summaryData.consensus_count})
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    These students are unanimously recommended by all 3 models (high confidence)
                  </p>
                  <StudentRankingTable
                    candidates={summaryData.consensus_candidates}
                    modelName="average"
                  />
                </div>
              )}

              {/* Model-Specific Rankings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Linear Regression */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="text-blue-600" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Linear Regression</h3>
                      <p className="text-xs text-gray-600">{rankingData.regression_lineaire.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                    {rankingData.regression_lineaire.fonctionnement}
                  </div>
                  <StudentRankingTable
                    candidates={rankingData.regression_lineaire.top_candidates}
                    modelName="regression"
                  />
                </div>

                {/* Decision Tree */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="text-yellow-600" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Decision Tree</h3>
                      <p className="text-xs text-gray-600">{rankingData.arbre_decision.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                    {rankingData.arbre_decision.fonctionnement}
                  </div>
                  <StudentRankingTable
                    candidates={rankingData.arbre_decision.top_candidates}
                    modelName="arbre"
                  />
                </div>

                {/* SVM */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Brain className="text-purple-600" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Support Vector Machine</h3>
                      <p className="text-xs text-gray-600">{rankingData.svm.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                    {rankingData.svm.fonctionnement}
                  </div>
                  <StudentRankingTable
                    candidates={rankingData.svm.top_candidates}
                    modelName="svm"
                  />
                </div>
              </div>

              {/* Merged Ranking */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="text-red-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">
                    Consensus Ranking ({rankingData.merged_ranking.top_candidates.length} / {rankingData.quota})
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Combined ranking based on weighted consensus across all machine learning models
                </p>
                <StudentRankingTable
                  candidates={rankingData.merged_ranking.top_candidates}
                  modelName="average"
                />
                
                {rankingData.merged_ranking.remaining_candidates.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Remaining Candidates</h4>
                    <StudentRankingTable
                      candidates={rankingData.merged_ranking.remaining_candidates.slice(0, 10)}
                      modelName="average"
                    />
                    {rankingData.merged_ranking.remaining_candidates.length > 10 && (
                      <p className="text-center text-gray-600 mt-4">
                        +{rankingData.merged_ranking.remaining_candidates.length - 10} additional candidates
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* STUDENT ANALYSIS TAB */}
      {activeTab === 'student-analysis' && (
        <div className="space-y-8">
          {rankingData && rankingData.merged_ranking.top_candidates.length > 0 ? (
            <>
              {/* Student Selection Grid */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Select a Candidate for Detailed Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rankingData.merged_ranking.top_candidates.map((student, idx) => (
                    <button
                      key={student.idEtudiant}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedStudent?.idEtudiant === student.idEtudiant
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-white hover:border-red-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">#{idx + 1} {student.prenom} {student.nom}</div>
                      <div className="text-xs text-gray-600 mt-1">Score: {student.average_score}</div>
                      <div className="text-xs text-gray-500">GPA: {student.gpa.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Visualizations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Linear Regression Visualization */}
                <div className="bg-white rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" />
                    Linear Regression
                  </h3>
                  <div className="space-y-2">
                    {rankingData.merged_ranking.top_candidates.map((student) => (
                      <div key={student.idEtudiant} className="flex items-center gap-3">
                        <div className="w-32 text-sm font-medium text-gray-700 truncate">
                          {student.prenom} {student.nom.charAt(0)}.
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 flex items-center justify-end pr-2"
                            style={{ width: `${Math.min(student.score_regression, 100)}%` }}
                          >
                            <span className="text-white text-xs font-bold">{student.score_regression}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Tree Visualization */}
                <div className="bg-white rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-600" />
                    Decision Tree
                  </h3>
                  <div className="space-y-2">
                    {rankingData.merged_ranking.top_candidates.map((student) => (
                      <div key={student.idEtudiant} className="flex items-center gap-3">
                        <div className="w-32 text-sm font-medium text-gray-700 truncate">
                          {student.prenom} {student.nom.charAt(0)}.
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full transition-all duration-300 flex items-center justify-end pr-2"
                            style={{ width: `${Math.min(student.score_arbre, 100)}%` }}
                          >
                            <span className="text-white text-xs font-bold">{student.score_arbre}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SVM Visualization */}
                <div className="bg-white rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Brain size={20} className="text-purple-600" />
                    Support Vector Machine
                  </h3>
                  <div className="space-y-2">
                    {rankingData.merged_ranking.top_candidates.map((student) => (
                      <div key={student.idEtudiant} className="flex items-center gap-3">
                        <div className="w-32 text-sm font-medium text-gray-700 truncate">
                          {student.prenom} {student.nom.charAt(0)}.
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-300 flex items-center justify-end pr-2"
                            style={{ width: `${Math.min(student.score_svm, 100)}%` }}
                          >
                            <span className="text-white text-xs font-bold">{student.score_svm}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Student Analysis */}
              {selectedStudent && (
                <div className="space-y-6">
                  {/* Student Header Card */}
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">{selectedStudent.prenom} {selectedStudent.nom}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-red-100 text-sm">Average Score</p>
                        <p className="text-2xl font-bold">{selectedStudent.average_score}</p>
                      </div>
                      <div>
                        <p className="text-red-100 text-sm">Priority Score</p>
                        <p className="text-2xl font-bold">{selectedStudent.priority_score}</p>
                      </div>
                      <div>
                        <p className="text-red-100 text-sm">GPA</p>
                        <p className="text-2xl font-bold">{selectedStudent.gpa.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-red-100 text-sm">Financial Need</p>
                        <p className="text-2xl font-bold">{selectedStudent.financial_need?.toFixed(0) || 'N/A'}%</p>
                      </div>
                      <div>
                        <p className="text-red-100 text-sm">Sponsorship</p>
                        <p className="text-xl font-bold">{selectedStudent.recommended_sponsorship || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Three Model Analysis Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Regression Analysis */}
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="text-blue-600" size={20} />
                        Linear Regression
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded">
                          <p className="text-2xl font-bold text-blue-600">{selectedStudent.score_regression}</p>
                          <p className="text-xs text-gray-600 mt-1">Prediction Score</p>
                        </div>
                        <div className="bg-white p-3 rounded text-sm">
                          <p className="font-semibold text-gray-900 mb-2">Formula Details:</p>
                          <p className="text-gray-700 text-xs">Model computes: GPA × 5.0 + Income × (-0.0001) + Dependents × (-3.0) + Constant</p>
                          <p className="text-blue-700 mt-2 font-semibold">→ Continuous score 0-100</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded text-sm text-blue-900">
                          <p className="font-semibold">💡 Interpretation:</p>
                          <p className="text-xs">Higher score indicates a strong candidate based on linear correlation of GPA and financial need.</p>
                        </div>
                      </div>
                    </div>

                    {/* Decision Tree Analysis */}
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                        <Activity className="text-green-600" size={20} />
                        Decision Tree
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded">
                          <p className="text-2xl font-bold text-green-600">{selectedStudent.score_arbre}</p>
                          <p className="text-xs text-gray-600 mt-1">Classification Tier</p>
                        </div>
                        <div className="bg-white p-3 rounded text-sm">
                          <p className="font-semibold text-gray-900 mb-2">Decision Flow:</p>
                          <div className="space-y-1 text-xs text-gray-700">
                            <div>✓ GPA {selectedStudent.gpa.toFixed(2)} ≥ 15.0?</div>
                            <div>✓ Income {selectedStudent.revenu} ≤ 25,000?</div>
                            <div>✓ Distance {selectedStudent.distance} km?</div>
                          </div>
                          <p className="text-green-700 mt-2 font-semibold">→ {selectedStudent.score_arbre > 50 ? 'RECOMMENDED ✓' : 'NEEDS REVIEW'}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded text-sm text-green-900">
                          <p className="font-semibold">💡 Interpretation:</p>
                          <p className="text-xs">Tree branches through conditional thresholds. Candidate {selectedStudent.score_arbre > 50 ? 'fulfills criteria' : 'partially fulfills criteria'}.</p>
                        </div>
                      </div>
                    </div>

                    {/* SVM Analysis */}
                    <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <Zap className="text-purple-600" size={20} />
                        Support Vector Machine (SVM)
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded">
                          <p className="text-2xl font-bold text-purple-600">{selectedStudent.score_svm}</p>
                          <p className="text-xs text-gray-600 mt-1">Ranking Confidence</p>
                        </div>
                        <div className="bg-white p-3 rounded text-sm">
                          <p className="font-semibold text-gray-900 mb-2">Hyperspace Position:</p>
                          <div className="space-y-1 text-xs text-gray-700">
                            <div>📊 Academic: {((selectedStudent.gpa / 10) * 100).toFixed(0)}% (GPA: {selectedStudent.gpa?.toFixed(2)}/10)</div>
                            <div>💰 Financial: {selectedStudent.revenu > 30000 ? 'Low need' : 'High need'}</div>
                            <div>👥 Dependents: {selectedStudent.dependants}</div>
                            <div>📍 Distance: {selectedStudent.distance} km</div>
                          </div>
                          <p className="text-purple-700 mt-2 font-semibold">→ {selectedStudent.score_svm > 50 ? '✓ POSITIVE' : '✗ NEGATIVE'}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded text-sm text-purple-900">
                          <p className="font-semibold">💡 Interpretation:</p>
                          <p className="text-xs">SVM constructs optimal hyperplane boundary. Candidate is {selectedStudent.score_svm > 50 ? 'on positive margin (recommended)' : 'near decision margin'}.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consensus Analysis */}
                  <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4">📊 Consensus Analysis (3 Models)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600 mb-2">Inter-Model Agreement</p>
                        <div className="flex items-center gap-2">
                          {Math.abs(selectedStudent.score_regression - selectedStudent.score_arbre) < 10 && Math.abs(selectedStudent.score_arbre - selectedStudent.score_svm) < 10 ? (
                            <>
                              <span className="text-2xl">✓✓✓</span>
                              <span className="text-gray-700 font-semibold">Strong Consensus!</span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl">⚠️</span>
                              <span className="text-gray-700 font-semibold">Divergence</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600 mb-2">Score Variance</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {(Math.max(selectedStudent.score_regression, selectedStudent.score_arbre, selectedStudent.score_svm) - 
                            Math.min(selectedStudent.score_regression, selectedStudent.score_arbre, selectedStudent.score_svm)).toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-600">Max deviation</p>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600 mb-2">Recommendation</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {selectedStudent.priority_score > 65 ? '✓ APPROVE' : selectedStudent.priority_score > 45 ? '⚠️ REVIEW' : '✗ REVISE'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Priority score: {selectedStudent.priority_score}</p>
                      </div>
                    </div>
                    <div className="bg-indigo-100 p-4 rounded-lg mt-4 text-sm text-indigo-900">
                      <p className="font-semibold mb-2">📈 Executive Synthesis:</p>
                      <p>
                        <strong>Average Score:</strong> {selectedStudent.average_score} (mean of 3 models)
                        <br/>
                        <strong>Priority Score:</strong> {selectedStudent.priority_score} (GPA 60% + Financial Need 40%)
                        <br/>
                        {selectedStudent.priority_score > 65 
                          ? "✓ Candidate is strongly recommended based on both academic merit AND financial necessity."
                          : selectedStudent.priority_score > 45
                          ? "⚠️ Candidate warrants in-depth review. Academic and financial metrics are balanced."
                          : "Detailed multi-model analysis advises further committee deliberation before determination."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedStudent && (
                <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
                  Select a candidate above to view detailed multi-model evaluation
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              Please load ranking data first to view candidate analysis
            </div>
          )}
        </div>
      )}

      {/* HOW IT WORKS TAB */}
      {activeTab === 'how-it-works' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-red-900 mb-2">🎯 How the Scholarship Allocation System Works</h2>
            <p className="text-red-700 text-lg">Intelligent evaluation prioritizing academically deserving, financially vulnerable students</p>
          </div>

          {/* Step 1 & 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Data Ingestion</h3>
                  <p className="text-blue-800">The system automatically aggregates candidate profiles:</p>
                  <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
                    <li>Baccalaureate exam scores (regional + national)</li>
                    <li>Annual household income</li>
                    <li>Number of dependent family members</li>
                    <li>Commute distance from university</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">Evaluation by 3 ML Models</h3>
                  <p className="text-green-800">Three independent machine learning models evaluate each applicant:</p>
                  <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
                    <li><strong>Linear Regression</strong>: Continuous scoring based on academics and income</li>
                    <li><strong>Decision Tree</strong>: Stratified rule-based classification</li>
                    <li><strong>SVM</strong>: Optimal margin hyperplane classification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 & 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">Intelligent Priority Calculation</h3>
                  <p className="text-purple-800">Each student receives a weighted priority score:</p>
                  <ul className="list-disc list-inside text-purple-700 mt-2 space-y-1">
                    <li><strong>60%</strong>: Academic performance (GPA)</li>
                    <li><strong>40%</strong>: Financial need (income + dependents)</li>
                  </ul>
                  <p className="text-purple-800 mt-3 font-semibold">Outcome: Academic excellence aligned with socioeconomic necessity</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900 mb-2">Scholarship Tier Recommendation</h3>
                  <p className="text-orange-800">The system determines the appropriate sponsorship tier:</p>
                  <ul className="list-disc list-inside text-orange-700 mt-2 space-y-1">
                    <li>🔴 <strong>Full</strong>: Financial need &gt; 70%</li>
                    <li>🟡 <strong>Half</strong>: Financial need 40-70%</li>
                    <li>🟢 <strong>Partial</strong>: Financial need &lt; 40%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking Priority */}
          <div className="bg-gradient-to-b from-indigo-50 to-indigo-100 border-2 border-indigo-300 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">📊 Allocation Priority Hierarchy</h3>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600 flex items-center gap-4">
                <div className="text-4xl font-bold text-indigo-600">🥇</div>
                <div>
                  <p className="font-bold text-indigo-900 text-lg">1st Priority: Vulnerable High Achievers</p>
                  <p className="text-indigo-700">Top academic scores + Lower income + Higher dependents</p>
                  <p className="text-sm text-indigo-600">→ Full Scholarship recommended</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 flex items-center gap-4">
                <div className="text-4xl font-bold text-indigo-500">🥈</div>
                <div>
                  <p className="font-bold text-indigo-900 text-lg">2nd Priority: Balanced Deserving Applicants</p>
                  <p className="text-indigo-700">Good academic scores + Moderate income + Moderate dependents</p>
                  <p className="text-sm text-indigo-600">→ Partial / Half Scholarship recommended</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-400 flex items-center gap-4">
                <div className="text-4xl font-bold text-indigo-400">🥉</div>
                <div>
                  <p className="font-bold text-indigo-900 text-lg">3rd Priority: Exceptional Self-Sustaining Candidates</p>
                  <p className="text-indigo-700">Outstanding academic scores + Higher income + Fewer dependents</p>
                  <p className="text-sm text-indigo-600">→ Partial Scholarship (standard merit aid)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Consensus */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-emerald-900 mb-4">✓ Tri-Model Consensus</h3>
            <p className="text-emerald-800 mb-4">
              When an applicant is recommended across all 3 models (Linear Regression, Decision Tree, SVM),
              they receive a <strong>"Consensus"</strong> classification denoting the highest level of confidence
              in the scholarship allocation decision.
            </p>
            <div className="bg-white p-4 rounded-lg border-l-4 border-emerald-600">
              <p className="font-semibold text-emerald-900">💡 Committee Takeaway:</p>
              <p className="text-emerald-700 mt-2">
                Consensus applicants offer the highest validation confidence because three disparate algorithmic architectures
                independently arrived at matching determinations.
              </p>
            </div>
          </div>

          {/* Final Result */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">🎓 Final Decision Formula</h3>
            <p className="text-lg mb-4">
              Top candidates are ordered according to the formula:
            </p>
            <div className="bg-black bg-opacity-20 p-4 rounded font-mono text-center text-xl mb-4">
              <strong>Priority = (GPA × 60%) + (Financial Need × 40%)</strong>
            </div>
            <p className="text-red-100">
              This methodology guarantees scholarships prioritize those with genuine need
              while rigorously maintaining academic excellence as an essential prerequisite.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLRankingSystem;
