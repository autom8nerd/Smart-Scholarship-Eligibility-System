"""
Machine Learning Visualization Module
Generates Matplotlib statistical charts for analysis of model performances and predictions.
"""
import matplotlib.pyplot as plt
import numpy as np
from typing import List, Dict, Any
import os
from datetime import datetime
from config.parametres import CHEMIN_DONNEES


class VisualiseurModeles:
    """
    Visualization Utility Class for ML Models and Distributions.
    """
    
    def __init__(self):
        """Initialize visualization manager and destination directory."""
        self.chemin_graphiques = os.path.join(CHEMIN_DONNEES, "graphiques")
        os.makedirs(self.chemin_graphiques, exist_ok=True)
        plt.style.use('seaborn-v0_8-darkgrid')
    
    def visualiser_distribution_capacite_financiere(self, scores: List[float], nom_fichier: str = None) -> str:
        """
        Plot distribution of financial capacity scores.
        
        Args:
            scores: List of continuous financial capacity scores (0-100)
            nom_fichier: Optional output file name
            
        Returns:
            str: Output file path
        """
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        
        # Histogram
        ax1.hist(scores, bins=20, color='steelblue', edgecolor='black', alpha=0.7)
        ax1.set_xlabel('Financial Capacity Score', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Number of Students', fontsize=12, fontweight='bold')
        ax1.set_title('Financial Capacity Score Distribution', fontsize=14, fontweight='bold')
        ax1.axvline(np.mean(scores), color='red', linestyle='--', linewidth=2, label=f'Mean: {np.mean(scores):.2f}')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Box plot
        ax2.boxplot(scores, vert=True)
        ax2.set_ylabel('Financial Capacity Score', fontsize=12, fontweight='bold')
        ax2.set_title('Box Plot — Financial Capacity', fontsize=14, fontweight='bold')
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if nom_fichier is None:
            nom_fichier = f"capacite_financiere_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        chemin_fichier = os.path.join(self.chemin_graphiques, nom_fichier)
        plt.savefig(chemin_fichier, dpi=300, bbox_inches='tight')
        plt.close()
        
        return chemin_fichier
    
    def visualiser_distribution_bourses(self, recommandations: Dict[str, int], nom_fichier: str = None) -> str:
        """
        Plot distribution of scholarship tier allocations.
        
        Args:
            recommandations: Dictionary of scholarship types and counts
            nom_fichier: Optional output file name
            
        Returns:
            str: Output file path
        """
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        types = list(recommandations.keys())
        counts = list(recommandations.values())
        couleurs = ['#ff9999', '#ffcc99', '#99ccff', '#99ff99']
        
        # Pie chart
        ax1.pie(counts, labels=types, autopct='%1.1f%%', startangle=90,
                colors=couleurs[:len(types)], explode=[0.05]*len(types))
        ax1.set_title('Scholarship Recommendations Distribution', fontsize=14, fontweight='bold')
        
        # Bar chart
        ax2.bar(types, counts, color=couleurs[:len(types)], edgecolor='black', alpha=0.7)
        ax2.set_xlabel('Scholarship Type', fontsize=12, fontweight='bold')
        ax2.set_ylabel('Number of Students', fontsize=12, fontweight='bold')
        ax2.set_title('Student Count by Scholarship Tier', fontsize=14, fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='y')
        plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45, ha='right')
        
        plt.tight_layout()
        
        if nom_fichier is None:
            nom_fichier = f"distribution_bourses_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        chemin_fichier = os.path.join(self.chemin_graphiques, nom_fichier)
        plt.savefig(chemin_fichier, dpi=300, bbox_inches='tight')
        plt.close()
        
        return chemin_fichier
    
    def visualiser_probabilites_inscription(self, probabilites: Dict[str, int], nom_fichier: str = None) -> str:
        """
        Plot distribution of enrollment likelihood tiers.
        
        Args:
            probabilites: Dictionary of probability tiers (Low/Medium/High) and counts
            nom_fichier: Optional output file name
            
        Returns:
            str: Output file path
        """
        fig, ax = plt.subplots(figsize=(10, 6))
        
        niveaux = list(probabilites.keys())
        counts = list(probabilites.values())
        couleurs = ['#ff6b6b', '#ffd93d', '#6bcf7f']
        
        bars = ax.bar(niveaux, counts, color=couleurs, edgecolor='black', alpha=0.8, linewidth=2)
        
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(height)}',
                   ha='center', va='bottom', fontweight='bold', fontsize=12)
        
        ax.set_xlabel('Enrollment Probability Tier', fontsize=12, fontweight='bold')
        ax.set_ylabel('Number of Students', fontsize=12, fontweight='bold')
        ax.set_title('Enrollment Probability Distribution', fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3, axis='y')
        
        plt.tight_layout()
        
        if nom_fichier is None:
            nom_fichier = f"probabilites_inscription_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        chemin_fichier = os.path.join(self.chemin_graphiques, nom_fichier)
        plt.savefig(chemin_fichier, dpi=300, bbox_inches='tight')
        plt.close()
        
        return chemin_fichier
    
    def visualiser_correlation_variables(self, donnees: List[Dict[str, float]], nom_fichier: str = None) -> str:
        """
        Plot scatter correlation grid across academic and financial attributes.
        
        Args:
            donnees: List of student attribute dictionaries
            nom_fichier: Optional output file name
            
        Returns:
            str: Output file path
        """
        if not donnees:
            return None
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        gpa_list = [d.get('gpa', 0) for d in donnees]
        notes_list = [d.get('noteExamen', 0) for d in donnees]
        revenu_list = [d.get('revenu', 0) for d in donnees]
        dependants_list = [d.get('dependants', 0) for d in donnees]
        
        # GPA vs Exam Score
        axes[0, 0].scatter(gpa_list, notes_list, alpha=0.6, s=50, color='steelblue')
        axes[0, 0].set_xlabel('GPA', fontweight='bold')
        axes[0, 0].set_ylabel('Exam Score', fontweight='bold')
        axes[0, 0].set_title('GPA vs. Exam Score', fontweight='bold')
        axes[0, 0].grid(True, alpha=0.3)
        
        # GPA vs Income
        axes[0, 1].scatter(gpa_list, revenu_list, alpha=0.6, s=50, color='coral')
        axes[0, 1].set_xlabel('GPA', fontweight='bold')
        axes[0, 1].set_ylabel('Income (MAD)', fontweight='bold')
        axes[0, 1].set_title('GPA vs. Income', fontweight='bold')
        axes[0, 1].grid(True, alpha=0.3)
        
        # Income vs Dependents
        axes[1, 0].scatter(revenu_list, dependants_list, alpha=0.6, s=50, color='mediumseagreen')
        axes[1, 0].set_xlabel('Income (MAD)', fontweight='bold')
        axes[1, 0].set_ylabel('Number of Dependents', fontweight='bold')
        axes[1, 0].set_title('Income vs. Dependents', fontweight='bold')
        axes[1, 0].grid(True, alpha=0.3)
        
        # Income Distribution
        axes[1, 1].hist(revenu_list, bins=15, color='mediumpurple', edgecolor='black', alpha=0.7)
        axes[1, 1].set_xlabel('Income (MAD)', fontweight='bold')
        axes[1, 1].set_ylabel('Frequency', fontweight='bold')
        axes[1, 1].set_title('Household Income Distribution', fontweight='bold')
        axes[1, 1].grid(True, alpha=0.3, axis='y')
        
        plt.tight_layout()
        
        if nom_fichier is None:
            nom_fichier = f"correlation_variables_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        chemin_fichier = os.path.join(self.chemin_graphiques, nom_fichier)
        plt.savefig(chemin_fichier, dpi=300, bbox_inches='tight')
        plt.close()
        
        return chemin_fichier
    
    def visualiser_performance_modele(self, metriques: Dict[str, float], nom_modele: str, nom_fichier: str = None) -> str:
        """
        Plot horizontal bar chart of evaluation metrics for a specific model.
        
        Args:
            metriques: Metric names and numeric values dictionary
            nom_modele: Model name label
            nom_fichier: Optional output file name
            
        Returns:
            str: Output file path
        """
        fig, ax = plt.subplots(figsize=(10, 6))
        
        noms = list(metriques.keys())
        valeurs = list(metriques.values())
        couleurs = plt.cm.viridis(np.linspace(0, 1, len(noms)))
        
        bars = ax.barh(noms, valeurs, color=couleurs, edgecolor='black', alpha=0.8)
        
        for i, bar in enumerate(bars):
            ax.text(valeurs[i], bar.get_y() + bar.get_height()/2.,
                   f'{valeurs[i]:.3f}',
                   ha='left', va='center', fontweight='bold', fontsize=10, 
                   bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.7))
        
        ax.set_xlabel('Score', fontsize=12, fontweight='bold')
        ax.set_title(f'Performance Metrics — {nom_modele}', fontsize=14, fontweight='bold')
        ax.set_xlim(0, 1.1)
        ax.grid(True, alpha=0.3, axis='x')
        
        plt.tight_layout()
        
        if nom_fichier is None:
            nom_fichier = f"performance_{nom_modele.lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        chemin_fichier = os.path.join(self.chemin_graphiques, nom_fichier)
        plt.savefig(chemin_fichier, dpi=300, bbox_inches='tight')
        plt.close()
        
        return chemin_fichier


# Global visualizer instance
visualiseur = VisualiseurModeles()
