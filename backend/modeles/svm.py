"""
SGD Classifier (SVM surrogate) for Enrollment Probability Estimation

Classifies candidates into 3 matriculation likelihood categories:
- Low (0): Probability 0-33%
- Medium (1): Probability 33-67%
- High (2): Probability 67-100%

Applies a fitted StandardScaler to normalize feature scale variances.
"""
import logging
import os
import pickle
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from config.parametres import CHEMIN_MODELES_ENTRAINES

logger = logging.getLogger(__name__)


class ModeleSVM:
    """
    Support Vector Machine (SGDClassifier) Model Manager.
    Predicts student enrollment probability using convex linear classification.
    """

    def __init__(self):
        """Initialize model wrapper and load weights."""
        self.modele = None
        self.scaler = None
        self.nom_fichier = "modele_svm.pkl"
        self.chemin_complet = os.path.join(CHEMIN_MODELES_ENTRAINES, self.nom_fichier)
        self._charger_modele()

    def _charger_modele(self):
        """Load persisted model and fitted scaler from disk."""
        try:
            if os.path.exists(self.chemin_complet):
                with open(self.chemin_complet, 'rb') as f:
                    donnees = pickle.load(f)
                if isinstance(donnees, dict):
                    self.modele = donnees['modele']
                    self.scaler = donnees['scaler']
                else:
                    self.modele = donnees
                    self.scaler = None
                print(f"[✓] SGD / SVM model loaded successfully")
            else:
                print(f"[⚠] Model artifact not found: {self.chemin_complet}")
                self._creer_modele_par_defaut()
        except Exception as e:
            print(f"[✗] Error loading SVM model: {e}")
            self._creer_modele_par_defaut()

    def _creer_modele_par_defaut(self):
        """Instantiate default model with baseline calibration data."""
        self.modele = SGDClassifier(loss='hinge', n_jobs=-1, random_state=42, n_iter_no_change=10, warm_start=False)
        X_dummy = np.array([
            [9.0, 90, 20000, 10],
            [8.5, 85, 25000, 20],
            [7.0, 70, 45000, 50],
            [5.5, 60, 60000, 80],
            [5.0, 50, 100000, 100]
        ])
        y_dummy = np.array([2, 2, 1, 0, 0])
        try:
            self.scaler = StandardScaler().fit(X_dummy)
            self.modele.fit(self.scaler.transform(X_dummy), y_dummy)
        except Exception as e:
            logger.warning(f"Failed to initialize fallback SVM model: {e}")

    def entraîner(self, X_train, y_train):
        """
        Fit SGDClassifier on training features with standardized scaling.

        Args:
            X_train: Features [GPA, Exam Score, Income, Distance]
            y_train: Probability class targets [0, 1, 2]
        """
        try:
            self.scaler = StandardScaler().fit(X_train)
            self.modele = SGDClassifier(
                loss='hinge',
                n_jobs=-1,
                random_state=42,
                n_iter_no_change=10,
                warm_start=False
            )
            self.modele.fit(self.scaler.transform(X_train), y_train)
            self._sauvegarder_modele()
            print("[✓] SGD / SVM model trained successfully")
        except Exception as e:
            print(f"[✗] Error during SGD / SVM training: {e}")

    def predire(self, caracteristiques):
        """
        Predict candidate enrollment probability class.
        
        Args:
            caracteristiques: Input feature vector
            
        Returns:
            dict: {'classe': int, 'confiance': float}
                - classe: 0=Low, 1=Medium, 2=High
                - confiance: Confidence margin rating (0-1)
        """
        try:
            if self.modele is None:
                self._creer_modele_par_defaut()
            
            X = np.array(caracteristiques).reshape(1, -1)
            if self.scaler is not None:
                X = self.scaler.transform(X)
            classe = int(self.modele.predict(X)[0])
            
            if hasattr(self.modele, 'predict_proba'):
                probabilites = self.modele.predict_proba(X)[0]
                confiance = float(np.max(probabilites))
            else:
                confiance = 0.6
            
            return {
                'classe': max(0, min(2, classe)),
                'confiance': min(1.0, confiance)
            }
        except Exception as e:
            print(f"[✗] Error during SVM prediction: {e}")
            try:
                if len(caracteristiques) >= 5:
                    gpa, note_exam, revenu, dependants, distance = caracteristiques[:5]
                elif len(caracteristiques) >= 4:
                    gpa, note_exam, revenu, distance = caracteristiques[:4]
                    dependants = 1
                else:
                    return {'classe': 1, 'confiance': 0.5}
            except Exception as ex:
                logger.warning(f"Unable to extract fallback SVM features: {ex}")
                return {'classe': 1, 'confiance': 0.5}
            
            score_complet = (gpa/10) * 40 + (note_exam/100) * 30 - (revenu/100000) * 20 - (distance/200) * 10
            
            if score_complet >= 60:
                return {'classe': 2, 'confiance': 0.8}
            elif score_complet >= 40:
                return {'classe': 1, 'confiance': 0.65}
            else:
                return {'classe': 0, 'confiance': 0.5}
    
    def _sauvegarder_modele(self):
        """Serialize and persist trained model and fitted scaler."""
        try:
            with open(self.chemin_complet, 'wb') as f:
                pickle.dump({'modele': self.modele, 'scaler': self.scaler}, f)
            print(f"[✓] Model artifact saved: {self.chemin_complet}")
        except Exception as e:
            print(f"[✗] Error saving SVM artifact: {e}")
    
    def obtenir_vecteurs_support(self):
        """Retrieve count of active support vectors if available."""
        if self.modele and hasattr(self.modele, 'n_support_'):
            return int(np.sum(self.modele.n_support_))
        return None


# Global model instance
modele_svm = ModeleSVM()
