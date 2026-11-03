"""
PNG Diagram Generator for Technical Documentation
Generates visual architectural and UML diagrams in PNG format using Matplotlib.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Circle
import numpy as np
import os

# Style configuration
plt.style.use('seaborn-v0_8-darkgrid')
OUTPUT_DIR = "diagrammes"


def save_figure(filename, fig, dpi=300):
    """Save figure to PNG file."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, filename)
    fig.savefig(filepath, dpi=dpi, bbox_inches='tight', facecolor='white')
    print(f"✓ Diagram generated: {filename}")
    plt.close(fig)


# ============================================================================
# 1. COMPLETE SYSTEM ARCHITECTURE
# ============================================================================
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Title
    ax.text(5, 9.5, 'Complete System Architecture', 
            fontsize=20, fontweight='bold', ha='center')
    
    # Frontend
    frontend_box = FancyBboxPatch((0.5, 6.5), 2.5, 1.5, 
                                  boxstyle="round,pad=0.1", 
                                  edgecolor='#2E86AB', facecolor='#A7C6DA', linewidth=2)
    ax.add_patch(frontend_box)
    ax.text(1.75, 7.5, 'React Frontend', fontsize=12, fontweight='bold', ha='center')
    ax.text(1.75, 7.15, 'Port 3000', fontsize=10, ha='center')
    ax.text(1.75, 6.85, '• Admin Dashboard\n• Student Portal', fontsize=8, ha='center')
    
    # Backend
    backend_box = FancyBboxPatch((4, 6.5), 2.5, 1.5, 
                                 boxstyle="round,pad=0.1", 
                                 edgecolor='#A23B72', facecolor='#F18F01', linewidth=2)
    ax.add_patch(backend_box)
    ax.text(5.25, 7.5, 'FastAPI Backend', fontsize=12, fontweight='bold', ha='center')
    ax.text(5.25, 7.15, 'Port 8000', fontsize=10, ha='center')
    ax.text(5.25, 6.85, '• RESTful API\n• ML Ranking Engine', fontsize=8, ha='center')
    
    # MongoDB
    db_box = FancyBboxPatch((7.5, 6.5), 2, 1.5, 
                           boxstyle="round,pad=0.1", 
                           edgecolor='#13A538', facecolor='#90EE90', linewidth=2)
    ax.add_patch(db_box)
    ax.text(8.5, 7.5, 'MongoDB', fontsize=12, fontweight='bold', ha='center')
    ax.text(8.5, 7.15, 'Database (27017)', fontsize=10, ha='center')
    ax.text(8.5, 6.85, '• Students\n• Quotas & Logs', fontsize=8, ha='center')
    
    # Connection Arrows
    arrow1 = FancyArrowPatch((3, 7.25), (4, 7.25), 
                            arrowstyle='<->', mutation_scale=30, 
                            color='black', linewidth=2)
    ax.add_patch(arrow1)
    
    arrow2 = FancyArrowPatch((6.5, 7.25), (7.5, 7.25), 
                            arrowstyle='<->', mutation_scale=30, 
                            color='black', linewidth=2)
    ax.add_patch(arrow2)
    
    # ML Models Engine
    ml_box = FancyBboxPatch((1.5, 4), 7, 1.8, 
                           boxstyle="round,pad=0.1", 
                           edgecolor='#6A4C93', facecolor='#D7BFF4', linewidth=2)
    ax.add_patch(ml_box)
    ax.text(5, 5.4, 'ML Engine (3 Independent Models)', fontsize=12, fontweight='bold', ha='center')
    ax.text(5, 4.9, 'Linear Regression  •  Decision Tree  •  SGD / SVM', 
            fontsize=9, ha='center')
    ax.text(5, 4.5, 'Multi-Model Consensus & Ranking', fontsize=9, ha='center', style='italic')
    
    arrow3 = FancyArrowPatch((5.25, 6.5), (5.25, 5.8), 
                            arrowstyle='<->', mutation_scale=25, 
                            color='black', linewidth=2)
    ax.add_patch(arrow3)
    
    # Processing pipeline
    ax.text(5, 3.2, 'Data Processing Pipeline', fontsize=11, fontweight='bold', ha='center')
    
    steps = [
        '1. Extract Candidate Feature Vector',
        '2. Tri-Model Parallel Scoring',
        '3. Consensus Agreement Verification',
        '4. Merged Priority Score Calculation',
        '5. Enforce Annual Quota Limit'
    ]
    
    y_pos = 2.8
    for step in steps:
        ax.text(5, y_pos, step, fontsize=9, ha='center', 
               bbox=dict(boxstyle='round', facecolor='#FFE5B4', alpha=0.7))
        y_pos -= 0.35
    
    save_figure('01_architecture_system.png', fig)


# ============================================================================
# 2. DATA FLOW - CANDIDATE RANKING
# ============================================================================
def create_data_flow_diagram():
    fig, ax = plt.subplots(figsize=(12, 14))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis('off')
    
    ax.text(5, 13.5, 'Data Flow — Candidate Evaluation & Ranking', 
            fontsize=16, fontweight='bold', ha='center')
    
    boxes = [
        (5, 12.5, 'Applicant Record\n(Status = Pending)', '#FFB6C1'),
        (5, 11.3, 'Feature Extraction\n(GPA, Exam, Income, Dependents, Distance)', '#FFE5B4'),
        (2, 10, 'Model 1\nLinear Regression', '#A7C6DA'),
        (5, 10, 'Model 2\nDecision Tree', '#F18F01'),
        (8, 10, 'Model 3\nSGD / SVM', '#D7BFF4'),
        (2, 8.5, 'Score 1\n(0-100)', '#A7C6DA'),
        (5, 8.5, 'Score 2\n(0-100)', '#F18F01'),
        (8, 8.5, 'Score 3\n(0-100)', '#D7BFF4'),
        (5, 7.2, 'Consensus Evaluation\n(All 3 Models in Accord?)', '#FFE5B4'),
        (3, 5.8, 'Consensus\n(High Confidence)', '#90EE90'),
        (7, 5.8, 'Non-Consensus\n(Weighted Average)', '#FFA07A'),
        (5, 4.5, 'Merged Priority Ranking\nEnforcing Annual Quota', '#FFE5B4'),
        (5, 2.8, 'Final Decision Allocations\nTop N Recommended Candidates', '#90EE90'),
    ]
    
    for x, y, label, color in boxes:
        width = 2.5 if len(label) < 15 else 3.2
        height = 0.8
        box = FancyBboxPatch((x-width/2, y-height/2), width, height, 
                            boxstyle="round,pad=0.05", 
                            edgecolor='black', facecolor=color, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, fontsize=9, ha='center', va='center', fontweight='bold')
    
    arrows = [
        (5, 12.1, 5, 11.7),
        (5, 10.9, 2, 10.4),
        (5, 10.9, 5, 10.4),
        (5, 10.9, 8, 10.4),
        (2, 9.6, 2, 8.9),
        (5, 9.6, 5, 8.9),
        (8, 9.6, 8, 8.9),
        (2, 8.1, 4, 7.6),
        (5, 8.1, 5, 7.6),
        (8, 8.1, 6, 7.6),
        (4, 6.8, 3, 6.2),
        (6, 6.8, 7, 6.2),
        (3, 5.4, 5, 4.9),
        (7, 5.4, 5, 4.9),
        (5, 4.1, 5, 3.2),
    ]
    
    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2), 
                               arrowstyle='->', mutation_scale=20, 
                               color='black', linewidth=1.5)
        ax.add_patch(arrow)
    
    save_figure('02_flux_donnees.png', fig)


# ============================================================================
# 3. LINEAR REGRESSION
# ============================================================================
def create_linear_regression_diagram():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    ax.text(7, 9.5, 'Model 1: Linear Regression', 
            fontsize=16, fontweight='bold', ha='center')
    
    features = ['GPA', 'Exam\nScore', 'Income', 'Dependents', 'Distance']
    x_start = 1
    for i, feature in enumerate(features):
        circle = Circle((x_start + i*2, 8), 0.4, color='#A7C6DA', ec='black', linewidth=2)
        ax.add_patch(circle)
        ax.text(x_start + i*2, 8, feature, fontsize=8, ha='center', va='center', fontweight='bold')
    
    process_box = FancyBboxPatch((2, 5.5), 10, 1.5, 
                                 boxstyle="round,pad=0.1", 
                                 edgecolor='#6A4C93', facecolor='#D7BFF4', linewidth=2)
    ax.add_patch(process_box)
    ax.text(7, 6.5, 'Learned Parameter Weights', fontsize=11, fontweight='bold', ha='center')
    ax.text(7, 6.05, 'w₁=5.0  w₂=0.3  w₃=-0.0001  w₄=-3.0  w₅=-0.05  b=40.0', 
            fontsize=9, ha='center', family='monospace')
    
    for i in range(5):
        arrow = FancyArrowPatch((x_start + i*2, 7.6), (7, 7), 
                               arrowstyle='->', mutation_scale=15, 
                               color='gray', linewidth=1.5)
        ax.add_patch(arrow)
    
    formula_box = FancyBboxPatch((1, 3.8), 12, 1.2, 
                                 boxstyle="round,pad=0.1", 
                                 edgecolor='black', facecolor='#FFE5B4', linewidth=2)
    ax.add_patch(formula_box)
    ax.text(7, 4.7, 'Score = w₁·GPA + w₂·ExamScore + w₃·Income + w₄·Dependents + w₅·Distance + b', 
            fontsize=10, ha='center', family='monospace', fontweight='bold')
    ax.text(7, 4.1, 'Score = 5×GPA + 0.3×Exam - 0.0001×Income - 3×Dependents - 0.05×Distance + 40', 
            fontsize=9, ha='center', family='monospace')
    
    example_box = FancyBboxPatch((1, 1.8), 12, 1.5, 
                                 boxstyle="round,pad=0.1", 
                                 edgecolor='#13A538', facecolor='#90EE90', linewidth=2)
    ax.add_patch(example_box)
    ax.text(7, 3, 'Sample Calculation: GPA=16, Exam=80, Income=8000 MAD, Dependents=3, Distance=40km', 
            fontsize=9, ha='center', family='monospace')
    ax.text(7, 2.5, 'Score = 5×16 + 0.3×80 - 0.0001×8000 - 3×3 - 0.05×40 + 40', 
            fontsize=9, ha='center', family='monospace')
    ax.text(7, 2, 'Score = 80 + 24 - 0.8 - 9 - 2 + 40 = 132.2 → CLAMPED to 100', 
            fontsize=9, ha='center', family='monospace', fontweight='bold')
    
    arrow_output = FancyArrowPatch((7, 3.8), (7, 3.3), 
                                  arrowstyle='->', mutation_scale=20, 
                                  color='black', linewidth=2)
    ax.add_patch(arrow_output)
    
    output_circle = Circle((7, 0.5), 0.5, color='#90EE90', ec='black', linewidth=2)
    ax.add_patch(output_circle)
    ax.text(7, 0.5, 'Score\n(0-100)', fontsize=9, ha='center', va='center', fontweight='bold')
    
    ax.text(2, 0.1, '✓ Fast  ✓ Interpretable  ✗ Assumes Linearity  ✗ Outlier Sensitive', 
            fontsize=8, ha='left', style='italic')
    
    save_figure('03_regression_lineaire.png', fig)


# ============================================================================
# 4. DECISION TREE
# ============================================================================
def create_decision_tree_diagram():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    ax.text(7, 9.5, 'Model 2: Decision Tree Classifier', 
            fontsize=16, fontweight='bold', ha='center')
    
    root = FancyBboxPatch((6, 8), 2, 0.6, boxstyle="round,pad=0.05", 
                          edgecolor='black', facecolor='#FFE5B4', linewidth=2)
    ax.add_patch(root)
    ax.text(7, 8.3, 'GPA > 14?', fontsize=10, ha='center', fontweight='bold')
    
    left_node = FancyBboxPatch((1.5, 6.2), 2, 0.6, boxstyle="round,pad=0.05", 
                               edgecolor='black', facecolor='#FFE5B4', linewidth=2)
    ax.add_patch(left_node)
    ax.text(2.5, 6.5, 'Income < 8000 MAD?', fontsize=9, ha='center', fontweight='bold')
    
    right_node = FancyBboxPatch((10.5, 6.2), 2, 0.6, boxstyle="round,pad=0.05", 
                                edgecolor='black', facecolor='#FFE5B4', linewidth=2)
    ax.add_patch(right_node)
    ax.text(11.5, 6.5, 'Distance > 50km?', fontsize=9, ha='center', fontweight='bold')
    
    arrow_left = FancyArrowPatch((6.5, 8), (3.5, 6.8), 
                                arrowstyle='->', mutation_scale=20, color='black', linewidth=1.5)
    ax.add_patch(arrow_left)
    ax.text(4.5, 7.5, 'YES', fontsize=9, ha='center', fontweight='bold', color='green')
    
    arrow_right = FancyArrowPatch((7.5, 8), (10.5, 6.8), 
                                 arrowstyle='->', mutation_scale=20, color='black', linewidth=1.5)
    ax.add_patch(arrow_right)
    ax.text(9.5, 7.5, 'NO', fontsize=9, ha='center', fontweight='bold', color='red')
    
    leaves_left = [
        (0.5, 4, '100% Full', '#90EE90'),
        (4.5, 4, '50% Half', '#FFB6C1'),
    ]
    
    for i, (x, y, label, color) in enumerate(leaves_left):
        box = FancyBboxPatch((x-0.6, y-0.3), 1.2, 0.6, boxstyle="round,pad=0.05", 
                            edgecolor='black', facecolor=color, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, label, fontsize=9, ha='center', va='center', fontweight='bold')
        
        if i == 0:
            arrow = FancyArrowPatch((1.5, 6.2), (0.5, 4.3), 
                                   arrowstyle='->', mutation_scale=15, color='green', linewidth=1.5)
            ax.text(0.8, 5.2, 'YES', fontsize=8, fontweight='bold', color='green')
        else:
            arrow = FancyArrowPatch((3.5, 6.2), (4.5, 4.3), 
                                   arrowstyle='->', mutation_scale=15, color='red', linewidth=1.5)
            ax.text(4.2, 5.2, 'NO', fontsize=8, fontweight='bold', color='red')
        ax.add_patch(arrow)
    
    leaves_right = [
        (10, 4, '25% Partial', '#FFE5B4'),
        (13, 4, '0% None', '#FFA07A'),
    ]
    
    for i, (x, y, label, color) in enumerate(leaves_right):
        box = FancyBboxPatch((x-0.6, y-0.3), 1.2, 0.6, boxstyle="round,pad=0.05", 
                            edgecolor='black', facecolor=color, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, label, fontsize=9, ha='center', va='center', fontweight='bold')
        
        if i == 0:
            arrow = FancyArrowPatch((10.5, 6.2), (10, 4.3), 
                                   arrowstyle='->', mutation_scale=15, color='green', linewidth=1.5)
            ax.text(10.8, 5.2, 'YES', fontsize=8, fontweight='bold', color='green')
        else:
            arrow = FancyArrowPatch((12.5, 6.2), (13, 4.3), 
                                   arrowstyle='->', mutation_scale=15, color='red', linewidth=1.5)
            ax.text(12.2, 5.2, 'NO', fontsize=8, fontweight='bold', color='red')
        ax.add_patch(arrow)
    
    info_text = 'Advantages: Non-linear, Robust to Outliers, Interpretable\nLimitations: Prone to Overfitting if Unpruned'
    ax.text(7, 0.5, info_text, fontsize=9, ha='center', 
           bbox=dict(boxstyle='round', facecolor='#D7BFF4', alpha=0.8))
    
    save_figure('04_arbre_decision.png', fig)


# ============================================================================
# 5. SUPPORT VECTOR MACHINE (SVM)
# ============================================================================
def create_svm_diagram():
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    ax.text(6, 9.5, 'Model 3: Support Vector Machine (SVM)', 
            fontsize=16, fontweight='bold', ha='center')
    
    ax.set_xlim(1, 11)
    ax.set_ylim(2, 8)
    
    np.random.seed(42)
    class1_x = np.random.normal(3, 0.8, 15)
    class1_y = np.random.normal(6, 0.8, 15)
    ax.scatter(class1_x, class1_y, c='green', s=150, marker='o', 
              edgecolors='darkgreen', linewidth=2, label='Approved / High Priority', zorder=3)
    
    class2_x = np.random.normal(9, 0.8, 15)
    class2_y = np.random.normal(4, 0.8, 15)
    ax.scatter(class2_x, class2_y, c='red', s=150, marker='x', 
              linewidth=2, label='Rejected / Needs Review', zorder=3)
    
    x_line = np.array([1, 11])
    y_line = -0.6 * x_line + 10.5
    ax.plot(x_line, y_line, 'b-', linewidth=3, label='Optimal Separating Hyperplane', zorder=2)
    
    y_line_up = -0.6 * x_line + 11.5
    y_line_down = -0.6 * x_line + 9.5
    ax.plot(x_line, y_line_up, 'b--', linewidth=1.5, alpha=0.5, label='Maximum Margin Boundary')
    ax.plot(x_line, y_line_down, 'b--', linewidth=1.5, alpha=0.5)
    
    ax.fill_between(x_line, y_line_down, y_line_up, alpha=0.1, color='blue')
    
    ax.text(1.5, 3, 'Class:\nNeeds Review', fontsize=10, fontweight='bold', 
           bbox=dict(boxstyle='round', facecolor='#FFA07A', alpha=0.7))
    ax.text(9.5, 7, 'Class:\nApproved', fontsize=10, fontweight='bold',
           bbox=dict(boxstyle='round', facecolor='#90EE90', alpha=0.7))
    
    ax.text(6, 1.3, 'Maximum Margin = Optimal Generalization', 
           fontsize=11, ha='center', fontweight='bold', style='italic')
    
    ax.legend(loc='upper left', fontsize=9)
    ax.set_xlabel('Feature 1 (GPA Normalized)', fontsize=10)
    ax.set_ylabel('Feature 2 (Income Normalized)', fontsize=10)
    
    info_text = 'Advantages: Effective in High Dimensions, Strong Regularization\nLimitations: Requires Strict Feature Scaling (StandardScaler)'
    ax.text(6, 0.5, info_text, fontsize=9, ha='center',
           bbox=dict(boxstyle='round', facecolor='#D7BFF4', alpha=0.8))
    
    save_figure('05_svm.png', fig)


# ============================================================================
# 6. USE CASE DIAGRAM
# ============================================================================
def create_usecase_diagram():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    ax.text(7, 9.5, 'Use Case Diagram', 
            fontsize=16, fontweight='bold', ha='center')
    
    student_circle = Circle((1.5, 5), 0.4, color='#FFE5B4', ec='black', linewidth=2)
    ax.add_patch(student_circle)
    ax.text(1.5, 4.3, 'Student Applicant', fontsize=10, ha='center', fontweight='bold')
    
    admin_circle = Circle((12.5, 5), 0.4, color='#FFE5B4', ec='black', linewidth=2)
    ax.add_patch(admin_circle)
    ax.text(12.5, 4.3, 'Administrator', fontsize=10, ha='center', fontweight='bold')
    
    boundary = FancyBboxPatch((3, 1), 8.5, 8, boxstyle="round,pad=0.1", 
                             edgecolor='black', facecolor='#E6F3FF', 
                             linewidth=2, linestyle='dashed')
    ax.add_patch(boundary)
    ax.text(7, 8.7, 'Decision Support System', 
           fontsize=11, ha='center', fontweight='bold')
    
    student_usecases = [
        (4, 7, 'Login & Authenticate'),
        (4, 6, 'View Profile & Status'),
        (4, 5, 'Submit Registration Form'),
    ]
    
    for x, y, label in student_usecases:
        oval = FancyBboxPatch((x-0.7, y-0.25), 1.6, 0.5, boxstyle="round,pad=0.05", 
                             edgecolor='black', facecolor='#FFE5B4', linewidth=1.5)
        ax.add_patch(oval)
        ax.text(x, y, label, fontsize=8, ha='center', va='center')
        
        arrow = FancyArrowPatch((2, 5), (x-0.7, y), 
                               arrowstyle='->', mutation_scale=15, color='gray', linewidth=1)
        ax.add_patch(arrow)
    
    admin_usecases = [
        (10, 7.5, 'Manage Student CRUD'),
        (10, 6.5, 'Inspect ML Rankings'),
        (10, 5.5, 'Configure Yearly Quotas'),
        (10, 4.5, 'Export Analytics & CSV'),
    ]
    
    for x, y, label in admin_usecases:
        oval = FancyBboxPatch((x-0.7, y-0.25), 1.6, 0.5, boxstyle="round,pad=0.05", 
                             edgecolor='black', facecolor='#FFE5B4', linewidth=1.5)
        ax.add_patch(oval)
        ax.text(x, y, label, fontsize=8, ha='center', va='center')
        
        arrow = FancyArrowPatch((12, 5), (x+0.7, y), 
                               arrowstyle='->', mutation_scale=15, color='gray', linewidth=1)
        ax.add_patch(arrow)
    
    save_figure('06_cas_utilisation.png', fig)


# ============================================================================
# 7. SEQUENCE DIAGRAM - LOGIN
# ============================================================================
def create_sequence_login_diagram():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    ax.text(7, 9.5, 'Sequence Diagram — Student Authentication Flow', 
            fontsize=14, fontweight='bold', ha='center')
    
    actors = ['Student Client', 'React Frontend', 'FastAPI Backend', 'MongoDB Cluster']
    actor_x = [2, 5.5, 9, 12.5]
    
    for x, actor in zip(actor_x, actors):
        box = FancyBboxPatch((x-0.8, 8.5), 1.6, 0.4, boxstyle="round,pad=0.05", 
                            edgecolor='black', facecolor='#A7C6DA', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, 8.7, actor, fontsize=9, ha='center', fontweight='bold')
        
        ax.plot([x, x], [8.5, 1], 'k--', linewidth=1, alpha=0.5)
    
    interactions = [
        (2, 7.8, 5.5, 7.6, 'Click Login'),
        (5.5, 7.4, 9, 7.2, 'POST /etudiants/connexion'),
        (9, 6.8, 12.5, 6.6, 'Query By Email'),
        (12.5, 6.2, 9, 6, 'Return User Record'),
        (9, 5.6, 5.5, 5.4, 'Return Auth Token'),
        (5.5, 5, 2, 4.8, 'Redirect to Dashboard'),
        (2, 4.4, 5.5, 4.2, 'GET /etudiants/{id}'),
        (5.5, 3.8, 9, 3.6, 'Fetch Fresh Data [Bearer Token]'),
        (9, 3.2, 12.5, 3, 'Find One Query'),
        (12.5, 2.6, 9, 2.4, 'Return Record JSON'),
        (9, 2, 5.5, 1.8, 'Profile DTO'),
        (5.5, 1.4, 2, 1.2, 'Render Dashboard Profile'),
    ]
    
    for x1, y1, x2, y2, label in interactions:
        if x1 < x2:
            arrow = FancyArrowPatch((x1, y1), (x2, y2), 
                                   arrowstyle='->', mutation_scale=15, 
                                   color='black', linewidth=1.5)
        else:
            arrow = FancyArrowPatch((x1, y1), (x2, y2), 
                                   arrowstyle='<-', mutation_scale=15, 
                                   color='black', linewidth=1.5)
        ax.add_patch(arrow)
        
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y + 0.15, label, fontsize=8, ha='center', style='italic')
    
    save_figure('07_sequence_login.png', fig)


# ============================================================================
# 8. ACTIVITY DIAGRAM - ADMISSION WORKFLOW
# ============================================================================
def create_activity_admission_diagram():
    fig, ax = plt.subplots(figsize=(12, 14))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis('off')
    
    ax.text(5, 13.5, 'Activity Diagram — End-to-End Admission Workflow', 
            fontsize=14, fontweight='bold', ha='center')
    
    activities = [
        (5, 12.5, 'Start\nAdmission Process', '#FFE5B4'),
        (5, 11.5, 'Student Submits\nRegistration Form', '#A7C6DA'),
        (5, 10.3, 'Status Set to\n"Pending"', '#FFE5B4'),
        (5, 9.1, 'Admin Triggers\nML Ranking', '#A7C6DA'),
        (2.5, 7.5, 'Compute Feature\nVectors', '#A7C6DA'),
        (7.5, 7.5, 'Check Annual\nQuota Cap', '#A7C6DA'),
        (5, 5.8, 'ML Ranking Engine\n(3 Models)', '#F18F01'),
        (2.5, 4.2, 'Consensus\n(All 3 agree)', '#90EE90'),
        (7.5, 4.2, 'Non-Consensus\n(Weighted Average)', '#FFA07A'),
        (5, 2.7, 'Merge Scores &\nEnforce Quotas', '#FFE5B4'),
        (5, 1.3, 'Final Decisions\nCycle Complete', '#90EE90'),
    ]
    
    for x, y, label, color in activities:
        if 'Start' in label or 'Complete' in label:
            circle = Circle((x, y), 0.35, color=color, ec='black', linewidth=2)
            ax.add_patch(circle)
        else:
            box = FancyBboxPatch((x-0.8, y-0.35), 1.6, 0.7, boxstyle="round,pad=0.05", 
                                edgecolor='black', facecolor=color, linewidth=1.5)
            ax.add_patch(box)
        ax.text(x, y, label, fontsize=8, ha='center', va='center', fontweight='bold')
    
    arrow_sequence = [
        (5, 12.15, 5, 11.85),
        (5, 11.15, 5, 10.65),
        (5, 9.95, 5, 9.45),
        (5, 8.75, 3.5, 7.85),
        (5, 8.75, 6.5, 7.85),
        (2.5, 7.15, 4, 6.2),
        (7.5, 7.15, 6, 6.2),
        (5, 5.45, 3.5, 4.55),
        (5, 5.45, 6.5, 4.55),
        (3.5, 3.9, 4.5, 3.05),
        (6.5, 3.9, 5.5, 3.05),
        (5, 2.35, 5, 1.65),
    ]
    
    for x1, y1, x2, y2 in arrow_sequence:
        arrow = FancyArrowPatch((x1, y1), (x2, y2), 
                               arrowstyle='->', mutation_scale=18, 
                               color='black', linewidth=1.5)
        ax.add_patch(arrow)
    
    save_figure('08_activite_admission.png', fig)


# ============================================================================
# 9. CROSS-MODEL BENCHMARK COMPARISON
# ============================================================================
def create_models_comparison():
    fig, ax = plt.subplots(figsize=(14, 8))
    
    models = ['Linear\nRegression', 'Decision\nTree', 'SGD / SVM']
    train_time = [10, 50, 200]
    complexity = [1, 3, 5]
    data_needed = [30, 70, 120]
    interpretability = [9, 7, 5]
    overfitting_risk = [2, 8, 3]
    
    x = np.arange(len(models))
    width = 0.15
    
    bars1 = ax.bar(x - 2*width, train_time, width, label='Training Time (ms)', color='#A7C6DA')
    bars2 = ax.bar(x - width, complexity, width, label='Complexity (1-5)', color='#F18F01')
    bars3 = ax.bar(x, data_needed, width, label='Data Requirements', color='#D7BFF4')
    bars4 = ax.bar(x + width, interpretability, width, label='Interpretability (0-10)', color='#90EE90')
    bars5 = ax.bar(x + 2*width, overfitting_risk, width, label='Overfitting Risk (1-10)', color='#FFA07A')
    
    ax.set_ylabel('Normalized Metric Value', fontsize=12, fontweight='bold')
    ax.set_title('Cross-Model Architectural Benchmark Comparison', fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=11, fontweight='bold')
    ax.legend(fontsize=10, loc='upper left')
    ax.grid(axis='y', alpha=0.3)
    
    for bars in [bars1, bars2, bars3, bars4, bars5]:
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(height)}', ha='center', va='bottom', fontsize=8)
    
    save_figure('09_comparaison_modeles.png', fig)


# ============================================================================
# MAIN EXECUTION ENTRYPOINT
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("Generating Documentation PNG Diagrams")
    print("=" * 60)
    
    create_architecture_diagram()
    create_data_flow_diagram()
    create_linear_regression_diagram()
    create_decision_tree_diagram()
    create_svm_diagram()
    create_usecase_diagram()
    create_sequence_login_diagram()
    create_activity_admission_diagram()
    create_models_comparison()
    
    print("=" * 60)
    print("✓ All diagrams generated successfully!")
    print(f"✓ Output directory: {OUTPUT_DIR}/")
    print("=" * 60)
