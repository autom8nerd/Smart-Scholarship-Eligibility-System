"""
Decision Tree Model for Scholarship Recommendation

Classifies candidates into 4 distinct scholarship allocation tiers (0-3)
based on academic achievements and financial need criteria.
"""
import logging
import os
import pickle
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from config.parametres import CHEMIN_MODELES_ENTRAINES

logger = logging.getLogger(__name__)


class ModeleArbreDecision:
    """
    Decision Tree Classifier Model Manager.
    Recommends scholarship coverage tier (0-3) based on learned conditional thresholds.
    """
    
    def __init__(self):
        """Initialize model wrapper and load weights."""
        self.modele = None
        self.nom_fichier = "modele_arbre_decision.pkl"
        self.chemin_complet = os.path.join(CHEMIN_MODELES_ENTRAINES, self.nom_fichier)
        self._charger_modele()
    
    def _charger_modele(self):
        """Load persisted model weights from disk."""
        try:
            if os.path.exists(self.chemin_complet):
                with open(self.chemin_complet, 'rb') as f:
                    self.modele = pickle.load(f)
                print(f"[✓] Decision Tree model loaded successfully")
            else:
                print(f"[⚠] Model artifact not found: {self.chemin_complet}")
                self._creer_modele_par_defaut()
        except Exception as e:
            print(f"[✗] Error loading decision tree model: {e}")
            self._creer_modele_par_defaut()
    
    def _creer_modele_par_defaut(self):
        """Instantiate default decision tree fitted on minimal calibration dataset."""
        self.modele = DecisionTreeClassifier(max_depth=3, random_state=42)
        X_dummy = np.array([
            [10, 50, 10000, 0, 20],
            [18, 80, 5000, 3, 50],
            [12, 60, 50000, 2, 10],
            [15, 70, 15000, 1, 60]
        ])
        y_dummy = np.array([1, 3, 0, 2])
        try:
            self.modele.fit(X_dummy, y_dummy)
        except Exception as e:
            logger.warning(f"Failed to initialize fallback decision tree: {e}")
    
    def entraîner(self, X_train, y_train):
        """
        Fit decision tree on training dataset.
        
        Args:
            X_train: Input feature matrix [GPA, Income, Dependents]
            y_train: Scholarship tier classes [0, 1, 2, 3]
        """
        try:
            self.modele = DecisionTreeClassifier(max_depth=5, min_samples_split=10, min_samples_leaf=5)
            self.modele.fit(X_train, y_train)
            self._sauvegarder_modele()
            print("[✓] Decision Tree model trained successfully")
        except Exception as e:
            print(f"[✗] Error during decision tree training: {e}")
    
    def predire(self, caracteristiques):
        """
        Predict recommended scholarship tier.
        
        Args:
            caracteristiques: Feature vector [GPA, Exam Score, Income, Dependents, Distance]
            
        Returns:
            int: Scholarship tier class (0=None, 1=25%, 2=50%, 3=100%)
        """
        try:
            if self.modele is None:
                self._creer_modele_par_defaut()
            
            X = np.array(caracteristiques).reshape(1, -1)
            prediction = int(self.modele.predict(X)[0])
            
            return max(0, min(3, prediction))
        except Exception as e:
            print(f"[✗] Error during decision tree prediction: {e}")
            try:
                if len(caracteristiques) >= 5:
                    gpa, note_examen, revenu, dependants, distance = caracteristiques[:5]
                elif len(caracteristiques) >= 3:
                    gpa = caracteristiques[0]
                    revenu = caracteristiques[1]
                    dependants = caracteristiques[2]
                    note_examen = 75
                    distance = 50
                else:
                    return 0
            except Exception as ex:
                logger.warning(f"Unable to extract fallback heuristic features: {ex}")
                return 0
            
            gpa_score = (gpa / 20.0) * 100
            financial_factor = max(0, (50000 - revenu) / 50000 * 100)
            dependant_factor = min(dependants * 15, 60)
            
            composite_score = (gpa_score * 0.50) + (financial_factor * 0.30) + (dependant_factor * 0.20)
            
            if composite_score >= 80:
                return 3  # Full scholarship (100%)
            elif composite_score >= 60:
                return 2  # Half scholarship (50%)
            elif composite_score >= 40:
                return 1  # Partial scholarship (25%)
            else:
                return 0  # No scholarship
    
    def _sauvegarder_modele(self):
        """Serialize and persist trained model weights."""
        try:
            with open(self.chemin_complet, 'wb') as f:
                pickle.dump(self.modele, f)
            print(f"[✓] Model artifact saved: {self.chemin_complet}")
        except Exception as e:
            print(f"[✗] Error saving model artifact: {e}")
    
    def obtenir_regles(self):
        """Export text representation of learned tree decision path."""
        try:
            from sklearn.tree import export_text
            if self.modele:
                return export_text(self.modele)
        except Exception as e:
            logger.warning(f"Unable to export decision tree rules: {e}")
            return None


# Global model instance
modele_arbre = ModeleArbreDecision()
