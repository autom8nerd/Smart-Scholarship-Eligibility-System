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
                Modèles Machine Learning
              </h1>
              <p className="text-slate-600">Gestion et analyse des modèles prédictifs</p>
            </div>
            <button
              onClick={fetchModels}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <RefreshCw size={18} />
              Actualiser
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
                    model.statut === 'actif'
                      ? selectedModel === model.id ? 'bg-blue-300' : 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {model.statut}
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
                    <div className={`text-xs ${selectedModel === model.id ? 'text-blue-200' : 'text-slate-500'}`}>Prédictions</div>
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
                  {tab === 'overview' && '📊 Aperçu'}
                  {tab === 'metrics' && '📈 Métriques'}
                  {tab === 'features' && '🎯 Features'}
                  {tab === 'info' && 'ℹ️ Infos'}
                  {tab === 'ml-explain' && '🧠 ML Explication'}
                  {tab === 'ranking' && '🏆 Classement'}
                  {tab === 'student-analysis' && '👤 Analyse Étudiants'}
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
                      <p className="text-xs text-blue-700 mt-1">Performance globale</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="text-emerald-600" size={24} />
                        <span className="text-2xl font-bold text-emerald-600">
                          {modelDetails.total_predictions}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-900">Prédictions</p>
                      <p className="text-xs text-emerald-700 mt-1">Total effectuées</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="text-purple-600" size={24} />
                        <span className="text-2xl font-bold text-purple-600">
                          {(modelDetails.metriques.precision * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-purple-900">Précision</p>
                      <p className="text-xs text-purple-700 mt-1">Exactitude positive</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-orange-600" size={24} />
                        <span className="text-2xl font-bold text-orange-600">
                          {(modelDetails.metriques.rappel * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-orange-900">Recall</p>
                      <p className="text-xs text-orange-700 mt-1">Couverture des positifs</p>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Résumé des Métriques</h3>
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
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Métriques Détaillées</h3>
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
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Distribution des Métriques</h3>
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
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => (value * 100).toFixed(1) + '%'} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Feature Importance Bar Chart */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Importance des Features</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={featureData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip
                            formatter={(value) => value.toFixed(1) + '%'}
                            contentStyle={{ backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px' }}
                          />
                          <Bar dataKey="importance" fill="#10b981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Feature List */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Liste des Features</h3>
                      <div className="space-y-2">
                        {featureData.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              <span className="font-semibold text-slate-900">{feature.name}</span>
                            </div>
                            <span className="text-emerald-600 font-bold text-lg">{feature.importance.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Model Info */}
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Informations du Modèle</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Nom:</span>
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
                          <span className="text-slate-600">Statut:</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {modelDetails.statut}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Training Data */}
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Données d'Entraînement</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Échantillons:</span>
                          <span className="font-semibold text-slate-900">
                            {modelDetails.donnees_entrainement.nombre_echantillons}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Features:</span>
                          <span className="font-semibold text-slate-900">
                            {modelDetails.donnees_entrainement.nombre_features}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Split:</span>
                          <span className="font-semibold text-slate-900">
                            {modelDetails.donnees_entrainement.train_test_split}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date d'entraînement:</span>
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
                          <h3 className="text-lg font-bold text-blue-900">Données d'Entraînement des Modèles</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Total Étudiants</p>
                            <p className="text-2xl font-bold text-blue-600">{mlStats.training_data.total_etudiants}</p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Approuvés</p>
                            <p className="text-2xl font-bold text-green-600">{mlStats.training_data.etudiants_approuves}</p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">Rejetés</p>
                            <p className="text-2xl font-bold text-red-600">{mlStats.training_data.etudiants_rejetes}</p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600">En Attente</p>
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
                                <p className="font-semibold text-slate-700">Comment ça apprend:</p>
                                <p className="text-slate-600">{model.apprentissage}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-700">Capacité de prédiction:</p>
                                <p className="text-slate-600">{model.capacite_prediction}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-700">Output:</p>
                                <p className="text-slate-600">{model.output}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold text-slate-700 mb-2">Forces:</p>
                                  <ul className="list-disc list-inside text-slate-600 text-xs space-y-1">
                                    {model.forces && model.forces.map((force, idx) => (
                                      <li key={idx}>{force}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-700 mb-2">Limites:</p>
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
                        <h3 className="text-lg font-bold text-green-900 mb-4">Explications des Features</h3>
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
                        <h3 className="text-lg font-bold text-purple-900 mb-4">Stratégie d'Ensemble</h3>
                        <p className="text-sm text-purple-800 mb-3"><strong>Description:</strong> {mlStats.ensemble_strategy.description}</p>
                        <p className="text-sm text-purple-800 mb-3"><strong>Méthode:</strong> {mlStats.ensemble_strategy.methode}</p>
                        <p className="text-sm text-purple-800 mb-3"><strong>Consensus:</strong> {mlStats.ensemble_strategy.consensus}</p>
                        <p className="text-sm text-purple-800"><strong>Robustesse:</strong> {mlStats.ensemble_strategy.robustesse}</p>
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
                    <label className="font-semibold text-slate-700">Année:</label>
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
                          <p className="text-sm text-blue-600 font-semibold">Quota Bourses</p>
                          <p className="text-3xl font-bold text-blue-700">{rankingData.quota}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-semibold">Étudiants en Attente</p>
                          <p className="text-3xl font-bold text-green-700">{rankingData.total_etudiants_en_attente}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-semibold">Consensus (Tous les 3 modèles)</p>
                          <p className="text-3xl font-bold text-purple-700">{rankingData.consensus.count}</p>
                        </div>
                      </div>

                      {/* Consensus Candidates */}
                      {rankingData.consensus.count > 0 && (
                        <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Award className="text-purple-600" size={20} />
                            Candidates Consensus (Recommandés par les 3 modèles)
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
                                  <div>GPA: {candidate.gpa.toFixed(2)}</div>
                                  <div>Revenu: {candidate.revenu}</div>
                                  <div>Dépendants: {candidate.dependants}</div>
                                  <div className="text-right">{candidate.type_sponsorship}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Merged Ranking (All models average) */}
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Classement Global (Top {rankingData.quota} par Moyenne des 3 Modèles)</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-200">
                              <tr>
                                <th className="p-2 text-left">#</th>
                                <th className="p-2 text-left">Nom</th>
                                <th className="p-2 text-right">Score Moyen</th>
                                <th className="p-2 text-right">Régression</th>
                                <th className="p-2 text-right">Arbre</th>
                                <th className="p-2 text-right">SVM</th>
                                <th className="p-2 text-right">GPA</th>
                                <th className="p-2 text-center">Type Bourse</th>
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
                                  <td className="p-2 text-center text-xs"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{candidate.type_sponsorship}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-slate-600 mt-4">✓ These {Math.min(rankingData.quota, rankingData.merged_ranking.top_candidates.length)} students comply with the quota of {rankingData.quota} scholarships for year {rankingData.annee}</p>
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
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Sélectionnez un Étudiant pour l'Analyse Détaillée</h3>
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
                              <div className="text-xs text-slate-500">GPA: {student.gpa.toFixed(2)}</div>
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
                                <p className="text-blue-100 text-sm">Score Moyen</p>
                                <p className="text-2xl font-bold">{selectedStudent.average_score}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">GPA</p>
                                <p className="text-2xl font-bold">{selectedStudent.gpa.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">Régression</p>
                                <p className="text-2xl font-bold">{selectedStudent.score_regression}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">Arbre</p>
                                <p className="text-2xl font-bold">{selectedStudent.score_arbre}</p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-sm">SVM</p>
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
                                Régression Linéaire
                              </h3>
                              <div className="space-y-3">
                                <div className="bg-white p-4 rounded">
                                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.score_regression}</p>
                                  <p className="text-xs text-slate-600 mt-1">Score Prédiction</p>
                                </div>
                                <div className="bg-white p-4 rounded text-sm">
                                  <p className="font-semibold text-slate-900 mb-2">Explication:</p>
                                  <p className="text-slate-700">Le modèle calcule une relation linéaire entre les features:</p>
                                  <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc list-inside">
                                    <li>GPA: {selectedStudent.gpa.toFixed(2)} (Poids: +5.0)</li>
                                    <li>Revenu: {selectedStudent.revenu} (Poids: -0.0001)</li>
                                    <li>Dépendants: {selectedStudent.dependants} (Poids: -3.0)</li>
                                  </ul>
                                  <p className="text-slate-700 mt-3">Score Final = Combinaison linéaire des features</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded text-sm text-blue-900">
                                  <p className="font-semibold">💡 Interprétation:</p>
                                  <p>Score élevé = Bon candidat selon relation linéaire. Le modèle suppose une relation proportionnelle.</p>
                                </div>
                              </div>
                            </div>

                            {/* Decision Tree Analysis */}
                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                                <Activity className="text-green-600" size={20} />
                                Arbre de Décision
                              </h3>
                              <div className="space-y-3">
                                <div className="bg-white p-4 rounded">
                                  <p className="text-2xl font-bold text-green-600">{selectedStudent.score_arbre}</p>
                                  <p className="text-xs text-slate-600 mt-1">Classification</p>
                                </div>
                                <div className="bg-white p-4 rounded text-sm">
                                  <p className="font-semibold text-slate-900 mb-2">Flux Décision:</p>
                                  <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-green-500 text-white px-2 py-1 rounded">1</span>
                                      <span>GPA {selectedStudent.gpa.toFixed(2)} ≥ 15.0? OUI ✓</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="bg-green-500 text-white px-2 py-1 rounded">2</span>
                                      <span>Revenu {selectedStudent.revenu} ≤ 25000? {selectedStudent.revenu <= 25000 ? 'OUI ✓' : 'NON'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="bg-green-500 text-white px-2 py-1 rounded">3</span>
                                      <span>Distance {selectedStudent.distance} km - Facteur important</span>
                                    </div>
                                  </div>
                                  <p className="text-slate-700 mt-3 font-semibold">Résultat: {selectedStudent.score_arbre > 50 ? 'RECOMMANDÉ ✓' : 'À ÉTUDIER'}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded text-sm text-green-900">
                                  <p className="font-semibold">💡 Interprétation:</p>
                                  <p>L'arbre pose des questions progressives. Cet étudiant {selectedStudent.score_arbre > 50 ? 'satisfait les critères' : 'ne satisfait pas tous les critères'}.</p>
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
                                  <p className="text-xs text-slate-600 mt-1">Confiance Classement</p>
                                </div>
                                <div className="bg-white p-4 rounded text-sm">
                                  <p className="font-semibold text-slate-900 mb-2">Position dans l'Espace:</p>
                                  <div className="space-y-2 text-xs text-slate-600">
                                    <div>📊 <strong>Dimension 1 (Académique):</strong> {((selectedStudent.gpa / 20) * 100).toFixed(0)}% - GPA élevé</div>
                                    <div>💰 <strong>Dimension 2 (Financier):</strong> {selectedStudent.revenu > 30000 ? 'Faible besoin' : 'Fort besoin'}</div>
                                    <div>👥 <strong>Dimension 3 (Dépendants):</strong> {selectedStudent.dependants} personnes à charge</div>
                                    <div>📍 <strong>Dimension 4 (Distance):</strong> {selectedStudent.distance} km</div>
                                  </div>
                                  <p className="text-slate-700 mt-3 font-semibold">Classification: {selectedStudent.score_svm > 50 ? '✓ POSITIF' : '✗ NÉGATIF'}</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded text-sm text-purple-900">
                                  <p className="font-semibold">💡 Interprétation:</p>
                                  <p>SVM crée un hyperplan de séparation. Cet étudiant est {selectedStudent.score_svm > 50 ? 'du côté positif (recommandé)' : 'près de la limite'}.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Consensus Analysis */}
                          <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4">Analyse Consensus (3 Modèles)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded">
                                <p className="text-sm text-slate-600 mb-2">Accord entre Modèles</p>
                                <div className="flex items-center gap-2">
                                  {Math.abs(selectedStudent.score_regression - selectedStudent.score_arbre) < 10 && Math.abs(selectedStudent.score_arbre - selectedStudent.score_svm) < 10 ? (
                                    <>
                                      <span className="text-2xl">✓✓✓</span>
                                      <span className="text-slate-700 font-semibold">Consensus Fort!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-2xl">⚠️</span>
                                      <span className="text-slate-700 font-semibold">Divergence</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded">
                                <p className="text-sm text-slate-600 mb-2">Variance des Scores</p>
                                <p className="text-2xl font-bold text-indigo-600">
                                  {(Math.max(selectedStudent.score_regression, selectedStudent.score_arbre, selectedStudent.score_svm) - 
                                    Math.min(selectedStudent.score_regression, selectedStudent.score_arbre, selectedStudent.score_svm)).toFixed(1)}
                                </p>
                                <p className="text-xs text-slate-600">Écart max</p>
                              </div>
                              <div className="bg-white p-4 rounded">
                                <p className="text-sm text-slate-600 mb-2">Recommandation</p>
                                <p className="text-lg font-bold text-indigo-600">
                                  {selectedStudent.average_score > 60 ? '✓ APPROUVER' : selectedStudent.average_score > 45 ? '⚠️ RÉVISER' : '✗ REJETER'}
                                </p>
                              </div>
                            </div>
                            <div className="bg-indigo-100 p-4 rounded-lg mt-4 text-sm text-indigo-900">
                              <p className="font-semibold mb-2">📊 Synthèse:</p>
                              <p>
                                Les 3 modèles donnent un score moyen de <strong>{selectedStudent.average_score}</strong>. 
                                {Math.abs(selectedStudent.score_regression - selectedStudent.score_arbre) < 10 && Math.abs(selectedStudent.score_arbre - selectedStudent.score_svm) < 10
                                  ? " Les modèles s'accordent fortement, offrant une grande confiance dans cette prédiction."
                                  : " Les modèles divergent légèrement, suggérant une analyse plus approfondie."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!selectedStudent && (
                        <div className="bg-slate-100 p-8 rounded-lg text-center text-slate-600">
                          Cliquez sur un étudiant ci-dessus pour voir l'analyse détaillée des 3 modèles
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      Veuillez d'abord charger les données de classement dans l'onglet "Classement"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-between items-center">
              <span className="text-sm text-slate-600">
                Généré le {new Date().toLocaleString('fr-FR')}
              </span>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                  <Download size={18} />
                  Rapport PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  <RefreshCw size={18} />
                  Réentraîner
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
