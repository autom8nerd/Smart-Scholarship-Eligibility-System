import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Activity, Zap, Target, Award,
  Download, RefreshCw, Brain, Lightbulb, Users
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const ModelsVisualization = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('decision_tree');
  const [modelDetails, setModelDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [mlInfo, setMlInfo] = useState(null);
  const [mlStats, setMlStats] = useState(null);
  const [rankingData, setRankingData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/modeles/`);
      setModels(response.data.modeles);
      if (!selectedModel && response.data.modeles.length > 0) {
        setSelectedModel(response.data.modeles[0].id);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    if (selectedModel) {
      fetchModelDetails(selectedModel);
    }
  }, [selectedModel]);

  const fetchModelDetails = async (modelId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modeles/${modelId}`);
      setModelDetails(response.data);
    } catch (error) {
      console.error('Error fetching model details:', error);
    }
  };

  // Fetch ML information and explanations
  const fetchMLInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ml-ranking/models-info`);
      setMlInfo(response.data);
    } catch (error) {
      console.error('Error fetching ML info:', error);
    }
  }, []);

  // Fetch ML statistics
  const fetchMLStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ml-ranking/models-statistics`);
      setMlStats(response.data);
    } catch (error) {
      console.error('Error fetching ML stats:', error);
    }
  }, []);

  // Fetch student ranking for a year
  const fetchStudentRanking = useCallback(async (year) => {
    try {
      setLoadingRanking(true);
      const response = await axios.get(`${API_BASE_URL}/ml-ranking/rank-students/${year}`);
      setRankingData(response.data);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoadingRanking(false);
    }
  }, []);

  // Initialize ML data on component mount
  useEffect(() => {
    fetchMLInfo();
    fetchMLStats();
    fetchStudentRanking(selectedYear);
  }, [fetchMLInfo, fetchMLStats, fetchStudentRanking, selectedYear]);

  const getMetricsData = (metrics) => {
    if (!metrics) return [];
    return Object.entries(metrics).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: typeof value === 'number' ? parseFloat(value.toFixed(3)) : value
    }));
  };

  const getFeatureImportanceData = (importance) => {
    if (!importance) return [];
    return Object.entries(importance)
      .map(([feature, value]) => ({
        name: feature,
        importance: parseFloat((value * 100).toFixed(1))
      }))
      .sort((a, b) => b.importance - a.importance);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  const metricsData = modelDetails ? getMetricsData(modelDetails.metriques) : [];
  const featureData = modelDetails ? getFeatureImportanceData(modelDetails.feature_importance) : [];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Zap className="text-amber-500" size={36} />
                Machine Learning Models
              </h1>
              <p className="text-slate-600">Model management, analytics, and explainable decision engine</p>
            </div>
            <button
              onClick={fetchModels}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Model Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg cursor-pointer transition transform hover:scale-105 ${
                  selectedModel === model.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-900 shadow hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{model.nom}</h3>
                    <p className={`text-sm ${selectedModel === model.id ? 'text-blue-100' : 'text-slate-600'}`}>
                      {model.type}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    model.statut === 'actif' || model.statut === 'active'
                      ? selectedModel === model.id ? 'bg-blue-300' : 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {model.statut === 'actif' ? 'Active' : model.statut}
                  </div>
                </div>
                
                {/* Quick Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className={`font-bold ${selectedModel === model.id ? 'text-blue-100' : 'text-blue-600'}`}>
                      {(model.metriques.f1_score * 100).toFixed(0)}%
                    </div>
                    <div className={`text-xs ${selectedModel === model.id ? 'text-blue-200' : 'text-slate-500'}`}>F1</div>
                  </div>
                  <div>
                    <div className={`font-bold ${selectedModel === model.id ? 'text-blue-100' : 'text-emerald-600'}`}>
                      {model.total_predictions}
                    </div>
                    <div className={`text-xs ${selectedModel === model.id ? 'text-blue-200' : 'text-slate-500'}`}>Inferences</div>
                  </div>
                  <div>
                    <div className={`font-bold ${selectedModel === model.id ? 'text-blue-100' : 'text-purple-600'}`}>
                      v{model.version}
                    </div>
                    <div className={`text-xs ${selectedModel === model.id ? 'text-blue-200' : 'text-slate-500'}`}>Version</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Details */}
        {modelDetails && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
              {['overview', 'metrics', 'features', 'info', 'ml-explain', 'ranking', 'student-analysis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'metrics' && '📈 Metrics'}
                  {tab === 'features' && '🎯 Features'}
                  {tab === 'info' && 'ℹ️ Details'}
                  {tab === 'ml-explain' && '🧠 ML Explanation'}
                  {tab === 'ranking' && '🏆 Rankings'}
                  {tab === 'student-analysis' && '👤 Candidate Analysis'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Key Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Target className="text-blue-600" size={24} />
                        <span className="text-2xl font-bold text-blue-600">
                          {(modelDetails.metriques.f1_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-blue-900">F1 Score</p>
                      <p className="text-xs text-blue-700 mt-1">Overall Performance</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="text-emerald-600" size={24} />
                        <span className="text-2xl font-bold text-emerald-600">
                          {modelDetails.total_predictions}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-900">Predictions</p>
                      <p className="text-xs text-emerald-700 mt-1">Total Inferences</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="text-purple-600" size={24} />
                        <span className="text-2xl font-bold text-purple-600">
                          {(modelDetails.metriques.precision * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-purple-900">Precision</p>
                      <p className="text-xs text-purple-700 mt-1">Positive Predictive Value</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-orange-600" size={24} />
                        <span className="text-2xl font-bold text-orange-600">
                          {(modelDetails.metriques.rappel * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-orange-900">Recall</p>
                      <p className="text-xs text-orange-700 mt-1">Coverage of Positives</p>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Metrics Summary</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis domain={[0, 1]} />
                        <Tooltip
                          formatter={(value) => typeof value === 'number' ? value.toFixed(3) : value}
                          contentStyle={{ backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Metrics Tab */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Detailed Metrics Table */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Metrics</h3>
                      <div className="space-y-3">
                        {Object.entries(modelDetails.metriques).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700 font-medium capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${typeof value === 'number' ? Math.min(value * 100, 100) : 0}%`
                                  }}
                                />
                              </div>
                              <span className="text-slate-900 font-bold text-right w-16">
                                {typeof value === 'number' ? (value * 100).toFixed(1) + '%' : value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Pie Chart */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Metrics Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={metricsData.slice(0, 3)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${(value * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {metricsData.slice(0, 3).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Feature Importance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={featureData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="importance" fill="#10b981" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureData.map((feature, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-900">{feature.name}</span>
                          <span className="text-emerald-600 font-bold">{feature.importance}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${feature.importance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Info */}
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Model Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Name:</span>
                          <span className="font-semibold text-slate-900">{modelDetails.nom}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Type:</span>
                          <span className="font-semibold text-slate-900">{modelDetails.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Version:</span>
                          <span className="font-semibold text-slate-900">{modelDetails.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Status:</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {modelDetails.statut === 'actif' ? 'Active' : modelDetails.statut}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Training Data */}
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Training Dataset</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sample Count:</span>
                          <span className="font-semibold text-slate-900">
                            {modelDetails.donnees_entrainement.nombre_echantillons}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Feature Count:</span>
                          <span className="font-semibold text-slate-900">
                            {modelDetails.donnees_entrainement.nombre_features}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Train/Test Split:</span>
                          <span className="font-semibold text-slate-900">
                            {modelDetails.donnees_entrainement.train_test_split}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Training Date:</span>
                          <span className="font-semibold text-slate-900">
                            {new Date(modelDetails.donnees_entrainement.date_entrainement).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Description</h3>
                    <p className="text-blue-800">{modelDetails.description}</p>
                  </div>
                </div>
              )}

              {/* ML Explanation Tab */}
              {activeTab === 'ml-explain' && (
                <div className="space-y-6">
                  {mlStats && (
                    <>
                      {/* Training Data Overview */}
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="text-blue-600" size={24} />
                          <h3 className="text-lg font-bold text-blue-900">Model Training Dataset</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Total Applicants</p>
                            <p className="text-2xl font-bold text-blue-600">{mlStats.training_data.total_etudiants}</p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-green-600">{mlStats.training_data.etudiants_approuves}</p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{mlStats.training_data.etudiants_rejetes}</p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Under Review</p>
                            <p className="text-2xl font-bold text-yellow-600">{mlStats.training_data.etudiants_en_attente}</p>
                          </div>
                        </div>
                        <p className="text-sm text-blue-700 mt-4">{mlStats.training_data.contexte}</p>
                      </div>

                      {/* Model Explanations */}
                      <div className="space-y-4">
                        {Object.entries(mlStats.models).map(([key, model]) => (
                          <div key={key} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                              <Lightbulb className="text-amber-500" size={20} />
                              <h3 className="text-lg font-bold text-slate-900">{model.nom}</h3>
                              <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">{model.type}</span>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="font-semibold text-slate-700">Description:</p>
                                <p className="text-slate-600">{model.description}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-700">How It Learns:</p>
                                <p className="text-slate-600">{model.apprentissage}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-700">Prediction Scope:</p>
                                <p className="text-slate-600">{model.capacite_prediction}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-700">Target Output:</p>
                                <p className="text-slate-600">{model.output}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold text-slate-700 mb-2">Strengths:</p>
                                  <ul className="list-disc list-inside text-slate-600 text-xs space-y-1">
                                    {model.forces && model.forces.map((force, idx) => (
                                      <li key={idx}>{force}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-700 mb-2">Limitations:</p>
                                  <ul className="list-disc list-inside text-slate-600 text-xs space-y-1">
                                    {model.limites && model.limites.map((limite, idx) => (
                                      <li key={idx}>{limite}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Features Explanation */}
                      <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-green-900 mb-4">Feature Explanations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(mlStats.features_explanation).map(([feature, explanation]) => (
                            <div key={feature} className="bg-white p-4 rounded border border-green-100">
                              <p className="font-semibold text-slate-900">{feature}</p>
                              <p className="text-sm text-slate-600 mt-1">{explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ensemble Strategy */}
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-purple-900 mb-4">Ensemble Consensus Strategy</h3>
                        <p className="text-sm text-purple-800 mb-3"><strong>Description:</strong> {mlStats.ensemble_strategy.description}</p>
                        <p className="text-sm text-purple-800 mb-3"><strong>Method:</strong> {mlStats.ensemble_strategy.methode}</p>
                        <p className="text-sm text-purple-800 mb-3"><strong>Consensus:</strong> {mlStats.ensemble_strategy.consensus}</p>
                        <p className="text-sm text-purple-800"><strong>Robustness:</strong> {mlStats.ensemble_strategy.robustesse}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Student Ranking Tab */}
              {activeTab === 'ranking' && (
                <div className="space-y-6">
                  {/* Year Selector */}
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                    <label className="font-semibold text-slate-700">Application Year:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {loadingRanking ? (
                    <div className="flex items-center justify-center h-48">
                      <RefreshCw className="animate-spin text-blue-500" size={32} />
                    </div>
                  ) : rankingData ? (
                    <>
                      {/* Quota Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-semibold">Scholarship Quota</p>
                          <p className="text-3xl font-bold text-blue-700">{rankingData.quota}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-semibold">Pending Applicants</p>
                          <p className="text-3xl font-bold text-green-700">{rankingData.total_etudiants_en_attente}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-semibold">Consensus Matches (All 3 Models)</p>
                          <p className="text-3xl font-bold text-purple-700">{rankingData.consensus.count}</p>
                        </div>
                      </div>

                      {/* Consensus Candidates */}
                      {rankingData.consensus.count > 0 && (
                        <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Award className="text-purple-600" size={20} />
                            Consensus Candidates (Recommended by all 3 models)
                          </h3>
                          <div className="space-y-3">
                            {rankingData.consensus.candidates.slice(0, 5).map((candidate, idx) => (
                              <div key={candidate.idEtudiant} className="bg-white p-3 rounded border border-purple-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-block w-6 h-6 bg-purple-600 text-white rounded-full text-center text-xs font-bold">{idx + 1}</span>
                                  <span className="font-semibold">{candidate.prenom} {candidate.nom}</span>
                                  <span className="ml-auto text-sm font-bold text-purple-600">Score: {candidate.average_score}</span>
                                </div>
                                <div className="text-xs text-gray-600 grid grid-cols-4 gap-2">
                                  <div>GPA: {candidate.gpa.toFixed(2)}/10</div>
                                  <div>Income: ₹{candidate.revenu?.toLocaleString()}</div>
                                  <div>Dependents: {candidate.dependants}</div>
                                  <div className="text-right font-medium">{candidate.type_sponsorship}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Merged Ranking (All models average) */}
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Overall Rankings (Top {rankingData.quota} by Ensemble Consensus)</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-200">
                              <tr>
                                <th className="p-2 text-left">#</th>
                                <th className="p-2 text-left">Candidate Name</th>
                                <th className="p-2 text-right">Consensus Score</th>
                                <th className="p-2 text-right">Regression</th>
                                <th className="p-2 text-right">Decision Tree</th>
                                <th className="p-2 text-right">SVM</th>
                                <th className="p-2 text-right">GPA (0-10)</th>
                                <th className="p-2 text-center">Scholarship Tier</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {rankingData.merged_ranking.top_candidates.map((candidate, idx) => (
                                <tr key={candidate.idEtudiant} className="hover:bg-slate-100">
                                  <td className="p-2 font-bold text-blue-600">{idx + 1}</td>
                                  <td className="p-2">{candidate.prenom} {candidate.nom}</td>
                                  <td className="p-2 text-right font-bold text-green-600">{candidate.average_score}</td>
                                  <td className="p-2 text-right text-blue-600">{candidate.score_regression}</td>
                                  <td className="p-2 text-right text-green-600">{candidate.score_arbre}</td>
                                  <td className="p-2 text-right text-purple-600">{candidate.score_svm}</td>
                                  <td className="p-2 text-right">{candidate.gpa.toFixed(2)}</td>
                                  <td className="p-2 text-center text-xs"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">{candidate.type_sponsorship}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-slate-600 mt-4">✓ These {Math.min(rankingData.quota, rankingData.merged_ranking.top_candidates.length)} students comply with the quota of {rankingData.quota} scholarships for academic year {rankingData.annee}</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      No ranking data available
                    </div>
                  )}
                </div>
              )}

              {/* Student Analysis Tab */}
              {activeTab === 'student-analysis' && (
                <div className="space-y-6">
                  {rankingData && rankingData.merged_ranking.top_candidates.length > 0 ? (
                    <>
                      {/* Student Selection */}
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Select a Candidate for Detailed Explainable AI Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {rankingData.merged_ranking.top_candidates.map((student, idx) => (
                            <button
                              key={student.idEtudiant}
                              onClick={() => setSelectedStudent(student)}
                              className={`p-4 rounded-lg border-2 transition text-left ${
                                selectedStudent?.idEtudiant === student.idEtudiant
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-slate-200 bg-white hover:border-blue-300'
                              }`}
                            >
                              <div className="font-semibold text-slate-900">#{idx + 1} {student.prenom} {student.nom}</div>
                              <div className="text-xs text-slate-600 mt-1">Score: {student.average_score}</div>
                              <div className="text-xs text-slate-500">GPA: {student.gpa.toFixed(2)}/10</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Student Analysis */}
                      {selectedStudent && (
                        <div className="space-y-6">
                          {/* Student Header */}
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">{selectedStudent.prenom} {selectedStudent.nom}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              <div>
                                <p className="text-blue-100 text-sm">Consensus Score</p>
                                <p className="text-2xl font-bold">{selectedStudent.average_score}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">GPA (Scale 0-10)</p>
                                <p className="text-2xl font-bold">{selectedStudent.gpa.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">Linear Regression</p>
                                <p className="text-2xl font-bold">{selectedStudent.score_regression}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">Decision Tree</p>
                                <p className="text-2xl font-bold">{selectedStudent.score_arbre}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">SVM Likelihood</p>
                                <p className="text-2xl font-bold">{selectedStudent.score_svm}</p>
                              </div>
                            </div>
                          </div>

                          {/* Model Performance Comparison */}
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
                                  <p className="text-xs text-slate-600 mt-1">Financial Need Score (0-100)</p>
                                </div>
                                <div className="bg-white p-4 rounded text-sm">
                                  <p className="font-semibold text-slate-900 mb-2">Mathematical Formulation:</p>
                                  <p className="text-slate-700">Calculates continuous financial need as a linear combination:</p>
                                  <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc list-inside">
                                    <li>GPA: {selectedStudent.gpa.toFixed(2)}/10 (Weight: +5.0)</li>
                                    <li>Income: ₹{selectedStudent.revenu?.toLocaleString()} (Weight: -0.0001)</li>
                                    <li>Dependents: {selectedStudent.dependants} (Weight: -3.0)</li>
                                  </ul>
                                  <p className="text-slate-700 mt-3 font-medium">Final Score = Weighted linear sum of features</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded text-sm text-blue-900">
                                  <p className="font-semibold">💡 Interpretation:</p>
                                  <p>Higher score indicates candidate with strong academic merit coupled with significant financial need.</p>
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
                                  <p className="text-xs text-slate-600 mt-1">Scholarship Tier Classification</p>
                                </div>
                                <div className="bg-white p-4 rounded text-sm">
                                  <p className="font-semibold text-slate-900 mb-2">Decision Flow Path:</p>
                                  <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-green-500 text-white px-2 py-1 rounded">1</span>
                                      <span>GPA {selectedStudent.gpa.toFixed(2)} ≥ 7.5? {selectedStudent.gpa >= 7.5 ? 'YES ✓' : 'NO ✗'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="bg-green-500 text-white px-2 py-1 rounded">2</span>
                                      <span>Income ₹{selectedStudent.revenu?.toLocaleString()} ≤ ₹35,000? {selectedStudent.revenu <= 35000 ? 'YES ✓' : 'NO ✗'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="bg-green-500 text-white px-2 py-1 rounded">3</span>
                                      <span>Distance {selectedStudent.distance} km — Locality Factor</span>
                                    </div>
                                  </div>
                                  <p className="text-slate-700 mt-3 font-semibold">Outcome: {selectedStudent.score_arbre > 50 ? 'RECOMMENDED ✓' : 'UNDER REVIEW'}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded text-sm text-green-900">
                                  <p className="font-semibold">💡 Interpretation:</p>
                                  <p>Decision tree partitions feature space hierarchically. This candidate {selectedStudent.score_arbre > 50 ? 'satisfies the criteria for aid' : 'is currently borderline'}.</p>
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
                                  <p className="text-xs text-slate-600 mt-1">Enrollment Likelihood Confidence</p>
                                </div>
                                <div className="bg-white p-4 rounded text-sm">
                                  <p className="font-semibold text-slate-900 mb-2">Hyperplane Position:</p>
                                  <div className="space-y-2 text-xs text-slate-600">
                                    <div>📊 <strong>Academic Dimension:</strong> {((selectedStudent.gpa / 10) * 100).toFixed(0)}% (GPA: {selectedStudent.gpa.toFixed(2)}/10)</div>
                                    <div>💰 <strong>Financial Dimension:</strong> {selectedStudent.revenu > 30000 ? 'Moderate need' : 'High need'}</div>
                                    <div>👥 <strong>Dependents Dimension:</strong> {selectedStudent.dependants} family dependents</div>
                                    <div>📍 <strong>Distance Dimension:</strong> {selectedStudent.distance} km from campus</div>
                                  </div>
                                  <p className="text-slate-700 mt-3 font-semibold">Classification: {selectedStudent.score_svm > 50 ? '✓ HIGH ENROLLMENT' : '✗ MODERATE / LOW'}</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded text-sm text-purple-900">
                                  <p className="font-semibold">💡 Interpretation:</p>
                                  <p>SVM projects candidates across hyperplane boundaries to estimate likelihood of actual enrollment upon acceptance.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Consensus Analysis */}
                          <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4">Multi-Model Consensus Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded">
                                <p className="text-sm text-slate-600 mb-2">Inter-Model Agreement</p>
                                <div className="flex items-center gap-2">
                                  {Math.abs(selectedStudent.score_regression - selectedStudent.score_arbre) < 10 && Math.abs(selectedStudent.score_arbre - selectedStudent.score_svm) < 10 ? (
                                    <>
                                      <span className="text-2xl">✓✓✓</span>
                                      <span className="text-slate-700 font-semibold">Strong Consensus!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-2xl">⚠️</span>
                                      <span className="text-slate-700 font-semibold">Moderate Variance</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded">
                                <p className="text-sm text-slate-600 mb-2">Score Variance</p>
                                <p className="text-2xl font-bold text-indigo-600">
                                  {(Math.max(selectedStudent.score_regression, selectedStudent.score_arbre, selectedStudent.score_svm) - 
                                    Math.min(selectedStudent.score_regression, selectedStudent.score_arbre, selectedStudent.score_svm)).toFixed(1)}
                                </p>
                                <p className="text-xs text-slate-600">Max deviation</p>
                              </div>
                              <div className="bg-white p-4 rounded">
                                <p className="text-sm text-slate-600 mb-2">Recommendation</p>
                                <p className="text-lg font-bold text-indigo-600">
                                  {selectedStudent.average_score > 60 ? '✓ APPROVE' : selectedStudent.average_score > 45 ? '⚠️ REVIEW' : '✗ REJECT'}
                                </p>
                              </div>
                            </div>
                            <div className="bg-indigo-100 p-4 rounded-lg mt-4 text-sm text-indigo-900">
                              <p className="font-semibold mb-2">📊 Consensus Summary:</p>
                              <p>
                                The 3 models produce an average consensus score of <strong>{selectedStudent.average_score}</strong>. 
                                {Math.abs(selectedStudent.score_regression - selectedStudent.score_arbre) < 10 && Math.abs(selectedStudent.score_arbre - selectedStudent.score_svm) < 10
                                  ? " All models demonstrate strong agreement, providing high institutional confidence for scholarship allocation."
                                  : " Minor variance across models; manual review of financial supporting documents recommended."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!selectedStudent && (
                        <div className="bg-slate-100 p-8 rounded-lg text-center text-slate-600">
                          Click on a candidate above to view detailed multi-model explainable AI analysis
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      Please select an academic year and load ranking data in the "Rankings" tab first
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-between items-center">
              <span className="text-sm text-slate-600">
                Generated on {new Date().toLocaleString('en-US')}
              </span>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                  <Download size={18} />
                  Export PDF
                </button>
                <button
                  onClick={fetchModels}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <RefreshCw size={18} />
                  Refresh Models
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsVisualization;
