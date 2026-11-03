"""
Linear Regression Model for Financial Capacity Scoring

Predicts a continuous numeric index (0-100) representing the candidate's
financial capacity based on academic and socioeconomic vectors.
"""
import os
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression
from config.parametres import CHEMIN_MODELES_ENTRAINES


class ModeleRegressionLineaire:
    """
    Linear Regression Model Manager.
    Handles training, serialization, and financial capacity scoring inference.
    """
    
    def __init__(self):
        """Initialize model wrapper and load weights."""
        self.modele = None
        self.nom_fichier = "modele_regression_lineaire.pkl"
        self.chemin_complet = os.path.join(CHEMIN_MODELES_ENTRAINES, self.nom_fichier)
        self._charger_modele()
    
    def _charger_modele(self):
        """
        Load persisted model weights from disk.
        If artifact does not exist, initialize calibrated fallback weights.
        """
        try:
            if os.path.exists(self.chemin_complet):
                with open(self.chemin_complet, 'rb') as f:
                    self.modele = pickle.load(f)
                print(f"[✓] Linear Regression model loaded successfully")
            else:
                print(f"[⚠] Model artifact not found: {self.chemin_complet}")
                self._creer_modele_par_defaut()
        except Exception as e:
            print(f"[✗] Error loading linear regression model: {e}")
            self._creer_modele_par_defaut()
    
    def _creer_modele_par_defaut(self):
        """Instantiate default model with baseline coefficients."""
        self.modele = LinearRegression()
        self.modele.coef_ = np.array([5.0, 0.3, -0.0001, -3.0, -0.05])
        self.modele.intercept_ = 40.0
    
    def entraîner(self, X_train, y_train):
        """
        Fit linear regression model on training dataset.
        
        Args:
            X_train: Training features matrix
            y_train: Continuous target capacity scores
        """
        try:
            self.modele = LinearRegression()
            self.modele.fit(X_train, y_train)
            self._sauvegarder_modele()
            print("[✓] Linear Regression model trained successfully")
        except Exception as e:
            print(f"[✗] Error during linear regression training: {e}")
    
    def predire(self, caracteristiques):
        """
        Predict financial capacity continuous score.
        
        Args:
            caracteristiques: Input feature vector
            
        Returns:
            float: Score bounded between 0 and 100
        """
        try:
            if self.modele is None:
                self._creer_modele_par_defaut()
            
            X = np.array(caracteristiques).reshape(1, -1)
            prediction = self.modele.predict(X)[0]
            
            return max(0.0, min(100.0, float(prediction)))
        except Exception as e:
            print(f"[✗] Error during prediction: {e}")
            return 50.0
    
    def _sauvegarder_modele(self):
        """Serialize and persist trained model weights."""
        try:
            with open(self.chemin_complet, 'wb') as f:
                pickle.dump(self.modele, f)
            print(f"[✓] Model artifact saved: {self.chemin_complet}")
        except Exception as e:
            print(f"[✗] Error saving model artifact: {e}")
    
    def obtenir_coefficients(self):
        """Retrieve model coefficients and bias intercept."""
        if self.modele:
            return {
                "coefficients": self.modele.coef_.tolist(),
                "intercept": float(self.modele.intercept_)
            }
        return None


# Global model instance
modele_regression = ModeleRegressionLineaire()
