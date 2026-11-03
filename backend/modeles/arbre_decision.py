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
            [8.5, 20000, 3],
            [9.0, 40000, 1],
            [6.5, 30000, 2],
            [5.0, 60000, 0]
        ])
        y_dummy = np.array([3, 2, 1, 0])
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
            caracteristiques: Feature vector [GPA, Income, Dependents] or [GPA, Exam Score, Income, Dependents, Distance]
            
        Returns:
            int: Scholarship tier class (0=None, 1=25%, 2=50%, 3=100%)
        """
        try:
            if self.modele is None:
                self._creer_modele_par_defaut()
            
            caract_arr = np.array(caracteristiques, dtype=float).flatten()
            expected = getattr(self.modele, 'n_features_in_', None)
            if expected is None:
                expected = 3
                
            if expected == 3:
                # Expects [gpa, revenu, dependants]
                if len(caract_arr) >= 5:
                    caract_arr = np.array([caract_arr[0], caract_arr[2], caract_arr[3]])
                elif len(caract_arr) == 4:
                    caract_arr = np.array([caract_arr[0], caract_arr[2], caract_arr[3]])
            elif expected == 4:
                if len(caract_arr) >= 5:
                    caract_arr = caract_arr[:4]
                elif len(caract_arr) == 3:
                    exam_sc = caract_arr[0] * 10.0 if caract_arr[0] <= 10.0 else caract_arr[0]
                    caract_arr = np.array([caract_arr[0], exam_sc, caract_arr[1], caract_arr[2]])
            elif expected == 5:
                if len(caract_arr) == 3:
                    exam_sc = caract_arr[0] * 10.0 if caract_arr[0] <= 10.0 else caract_arr[0]
                    caract_arr = np.array([caract_arr[0], exam_sc, caract_arr[1], caract_arr[2], 25.0])
                elif len(caract_arr) == 4:
                    caract_arr = np.append(caract_arr, 25.0)

            X = caract_arr.reshape(1, -1)
            prediction = int(self.modele.predict(X)[0])
            
            return max(0, min(3, prediction))
        except Exception as e:
            print(f"[✗] Error during decision tree prediction: {e}")
            try:
                gpa = float(caracteristiques[0]) if len(caracteristiques) > 0 else 7.0
                if len(caracteristiques) >= 5:
                    revenu = float(caracteristiques[2])
                    dependants = float(caracteristiques[3])
                elif len(caracteristiques) == 4:
                    revenu = float(caracteristiques[2])
                    dependants = float(caracteristiques[3])
                elif len(caracteristiques) >= 3:
                    revenu = float(caracteristiques[1])
                    dependants = float(caracteristiques[2])
                else:
                    return 0
            except Exception as ex:
                logger.warning(f"Unable to extract fallback heuristic features: {ex}")
                return 0
            
            gpa_score = (gpa / 10.0) * 100
            financial_factor = max(0, min(100, (80000 - revenu) / 80000 * 100))
            dependant_factor = min(dependants * 12, 60)
            
            composite_score = (gpa_score * 0.50) + (financial_factor * 0.30) + (dependant_factor * 0.20)
            
            if composite_score >= 75:
                return 3  # Full scholarship (100%)
            elif composite_score >= 55:
                return 2  # Half scholarship (50%)
            elif composite_score >= 35:
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
