# 📚 DOCUMENTATION - Smart Enrollment & Scholarship Decision Support System

**Version**: 1.0  
**Date**: January 2026  
**Language**: English

---

## 📑 Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Data Flow Pipeline](#2-data-flow-pipeline)
3. [Machine Learning Models Deep Dive](#3-machine-learning-models-deep-dive)
4. [Use Case Diagrams](#4-use-case-diagrams)
5. [Sequence Diagrams](#5-sequence-diagrams)
6. [Activity Diagrams](#6-activity-diagrams)
7. [System Reference & Summary Table](#7-system-reference--summary-table)

---

## 1. System Architecture

### Complete System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          COMPLETE SYSTEM                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │   REACT FRONTEND     │         │   FASTAPI BACKEND    │          │
│  │  (Port 3000)         │◄────────│  (Port 8000)         │          │
│  │                      │         │                      │          │
│  │ • Admin Dashboard    │         │ • RESTful API        │          │
│  │ • Student Portal     │         │ • Business Logic     │          │
│  │ • Visualizations     │         │ • ML Ranking Engine  │          │
│  └──────────────────────┘         └──────┬───────────────┘          │
│                                           │                         │
│                                    ┌──────▼────────┐                │
│                                    │   MONGODB     │                │
│                                    │ Database      │                │
│                                    │ (Port 27017)  │                │
│                                    └───────────────┘                │
│                                                                     │
│  ┌─────────────────────────────────────────────────┐                │
│  │         ML ENGINE (3 INDEPENDENT MODELS)        │                │
│  ├─────────────────────────────────────────────────┤                │
│  │ • Linear Regression                             │                │
│  │ • Decision Tree Classifier                      │                │
│  │ • Support Vector Machine (SVM / SGDClassifier)  │                │
│  └─────────────────────────────────────────────────┘                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Pipeline

### Candidate Ranking and Evaluation Process

```
┌──────────────────────────────────────────────────────────────────┐
│                      STUDENT CANDIDATE                           │
│                     (Status = "Pending")                         │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │     FEATURE EXTRACTION   │
         ├──────────────────────────┤
         │ • GPA (Academic Score)   │
         │ • Exam Score             │
         │ • Monthly Income (MAD)   │
         │ • Dependent Count        │
         │ • Commute Distance (km)  │
         └────────┬─────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
    ┌───────┐ ┌────────┐ ┌─────┐
    │Model 1│ │Model 2 │ │Model│
    │LinReg │ │DecTree │ │SVM  │
    └───┬───┘ └───┬────┘ └──┬──┘
        │         │         │
        ▼         ▼         ▼
     Score 1   Score 2   Score 3
     (0-100)   (0-100)   (0-100)
        │         │         │
        └─────────┼─────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │     CONSENSUS EVALUATION    │
    │   (All 3 models in accord?) │
    └─────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    Consensus          Non-Consensus
    (High confidence)  (Mixed scores)
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │       MERGED RANKING        │
    │  (Weighted Consensus Score) │
    │  Enforcing Annual QUOTA     │
    └─────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │   FINAL OUTCOMES   │
         │ • Top N Candidates │
         │ • Consensus List   │
         │ • Full Audit Trail │
         └────────────────────┘
```

---

## 3. Machine Learning Models Deep Dive

### 3.1 Model Learning Principles

#### Training Data Architecture

Each model learns patterns directly from **historical and synthetic student records**:

```
TRAINING DATASET ARCHITECTURE
│
├─ Input Features
│  ├─ Academic GPA (Overall Score out of 20)
│  ├─ Exam Score (Regional & National tests)
│  ├─ Monthly Household Income (MAD)
│  ├─ Number of Dependents (Family members supported)
│  └─ Distance to University Campus (km)
│
└─ Learning Targets
   ├─ Linear Regression → Continuous Financial Capacity Score (0-100)
   ├─ Decision Tree → Scholarship Tier Class (0: None, 1: Partial, 2: Half, 3: Full)
   └─ SVM (SGD Classifier) → Enrollment Likelihood Class (0: Low, 1: Medium, 2: High)
```

#### Generic Training Pipeline

```python
# STEP 1: Load historical training records
records = fetch_student_records()

# STEP 2: Partition into train and validation splits
X_train (80%) = Training features
y_train (80%) = Verified ground truth targets

X_test (20%)  = Validation features
y_test (20%)  = Test ground truth targets

# STEP 3: Feature normalization & scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# STEP 4: Instantiate and train model
model = MachineLearningModel()
model.fit(X_train, y_train)

# STEP 5: Evaluate model performance
metrics = model.evaluate(X_test, y_test)
print(f"Model Evaluation Metrics: {metrics}")

# STEP 6: Serialize trained weights
joblib.dump(model, "backend/modeles_entraines/model.pkl")
```

---

### 3.2 MODEL 1: LINEAR REGRESSION

#### Core Theory

Linear regression models the target as a **linear weighted combination** of input features:

$$\text{Score} = w_1 \cdot \text{GPA} + w_2 \cdot \text{ExamScore} + w_3 \cdot \text{Income} + w_4 \cdot \text{Dependents} + w_5 \cdot \text{Distance} + b$$

Where:
- $w_1, w_2, w_3, w_4, w_5$ = Learned weight parameters
- $b$ = Intercept bias

#### Gradient Descent Optimization Process

```
ITERATION 1:
─────────────
Initial weights: w = [1, 1, 1, 1, 1], b = 50

Student 1: GPA=15, Exam=75, Income=10000, Dependents=2, Distance=30
Prediction = 1×15 + 1×75 + 1×10000 + 1×2 + 1×30 + 50 = 10172 ❌
Actual target = 85 (Admitted with scholarship)
Error Residual = 10172 - 85 = 10087 (Large error)

WEIGHT GRADIENT UPDATE:
Model recognizes severe over-weighting on Income feature.
New w₃ = 0.00001 (substantially scaled down)

ITERATION 2:
─────────────
Re-evaluating student with updated weight vector:
Prediction = 1×15 + 1×75 + 0.00001×10000 + 1×2 + 1×30 + 50 = 172.1
Error = 172.1 - 85 = 87.1 (Significantly reduced error)

ITERATION 3, 4, 5... (Repeated across epochs until convergence)
Iterative gradient step updates minimize Mean Squared Error (MSE).
```

#### Learned Parameters Representation

```
Score = w₁·GPA + w₂·ExamScore + w₃·Income + w₄·Dependents + w₅·Distance + b

Sample Learned Weights:
- w₁ (GPA) = 5.0          → Strong positive academic impact (+5 per point)
- w₂ (ExamScore) = 0.3    → Moderate positive academic impact
- w₃ (Income) = -0.0001   → Negative coefficient: Higher income reduces financial assistance priority
- w₄ (Dependents) = -3.0  → More dependents increases financial burden/scholarship need
- w₅ (Distance) = -0.05   → Geographic proximity adjustment
- b (Bias) = 40.0         → Base baseline offset

Prediction Example for an applicant:
GPA=16, Exam=80, Income=8000 MAD, Dependents=3, Distance=40km

Score = (5.0×16) + (0.3×80) + (-0.0001×8000) + (-3.0×3) + (-0.05×40) + 40
      = 80 + 24 + (-0.8) + (-9) + (-2) + 40
      = 132.2 → Clamped to 100 (Maximum score bound)
```

#### Strengths & Trade-offs

```
✓ STRENGTHS:
  • Near instantaneous training and inference (< 5ms)
  • Highly interpretable coefficients and direct explainability
  • Excellent baseline for continuous financial indexing
  • Resistant to overfitting with L2 regularization

✗ TRADE-OFFS:
  • Assumes linear relationship across all variables
  • Sensitive to extreme outlier values without scaling
  • Cannot capture complex non-linear feature interactions
```

---

### 3.3 MODEL 2: DECISION TREE CLASSIFIER

#### Core Theory

The Decision Tree segments the feature space via recursive **hierarchical condition splits**:

```
                    ┌─────────────────┐
                    │   GPA > 14?     │
                    └────┬────┬───────┘
                    YES /      \ NO
                       /        \
             ┌────────▼───┐  ┌───▼────────┐
             │Income <    │  │Distance >  │
             │8,000 MAD?  │  │50 km?      │
             └──┬─────┬───┘  └──┬─────┬───┘
               /       \       /       \
             YES       NO    YES       NO
             /           \     /         \
         ┌──▼──┐     ┌────▼─┐┌──▼──┐   ┌──▼──┐
         │ 100%│     │ 50%  ││ 75% │   │ 25% │
         │ Full│     │ Half ││Part │   │None │
         └─────┘     └──────┘└─────┘   └─────┘
```

#### Split Selection & Information Gain

```
STEP 1: FEATURE SPLIT EVALUATION
────────────────────────────────
The algorithm calculates Information Gain (or Gini impurity reduction) across all features:

Candidate Split: GPA > 14
   Subsets: Node Left [3 approved, 0 rejected], Node Right [0 approved, 2 rejected]
   Information Gain = High ✓ (Optimal purity)

Candidate Split: ExamScore > 70
   Subsets: Node Left [2 approved, 1 rejected], Node Right [1 approved, 1 rejected]
   Information Gain = Low

→ GPA is selected as root node split criterion.

STEP 2: RECURSIVE SUBTREE GENERATION
────────────────────────────────────
Branches are split recursively until:
- Max depth threshold is satisfied (`max_depth = 5`)
- Minimum samples per leaf criteria is reached (`min_samples_leaf = 5`)
- Node reaches complete class purity
```

#### Information Gain Formulation

$$\text{Entropy}(S) = - \sum_{i=1}^{c} p_i \log_2(p_i)$$

$$\text{Information Gain}(S, A) = \text{Entropy}(S) - \sum_{v \in \text{Values}(A)} \frac{|S_v|}{|S|} \text{Entropy}(S_v)$$

#### Strengths & Trade-offs

```
✓ STRENGTHS:
  • Naturally captures non-linear relationships and thresholds
  • High human interpretability with transparent if-else decision rules
  • Robust to monotonic scaling and outlier presence
  • Evaluates multi-class categorical targets directly

✗ TRADE-OFFS:
  • Susceptible to high variance / overfitting if unpruned
  • Slight data variations can produce structural tree alterations
  • Axis-aligned splits approximate diagonal boundaries inefficiently
```

---

### 3.4 MODEL 3: SUPPORT VECTOR MACHINE (SVM / SGD CLASSIFIER)

#### Core Theory

The Support Vector Machine constructs an **optimal maximum-margin hyperplane** maximizing separation between applicant classes:

```
FEATURE HYPERSPACE (GPA vs. Income):

       GPA
        │
        │ Class: Admitted / High Priority (●)
        │  ●●
        │ ●●  ╱─ Optimal Hyperplane Boundary
        │ ●  ╱
    ────┼────────── Maximum Margin (d)
        │ ╲ ○○
        │  ╲○○  Class: Needs Review (○)
        │   ○
        └──────────── Family Income

→ Maximizes the margin separation between closest data instances
→ Guarantees robust generalization on unobserved applicants
```

#### Optimization Principle & Support Vectors

```
STEP 1: FEATURE SCALING & MAPPING
Our 5 features: [GPA, Exam Score, Income, Dependents, Distance]
Features undergo StandardScaler transformation:
  z = (x - mean) / std_dev

STEP 2: MAXIMUM MARGIN SEPARATION
SVM solves the quadratic optimization problem:
  min (1/2) ||w||² + C ∑ ξᵢ
  subject to: yᵢ (w·xᵢ + b) ≥ 1 - ξᵢ

STEP 3: SUPPORT VECTORS IDENTIFICATION
Only the data points located directly on or inside the margin margins dictate the decision boundary.
Outlying points distant from the margin exert zero influence on boundary geometry.
```

#### Strengths & Trade-offs

```
✓ STRENGTHS:
  • Effective in multi-dimensional vector spaces
  • Robust generalization due to structural risk minimization
  • Immune to points located outside the support margin
  • High discriminative precision for enrollment classification

✗ TRADE-OFFS:
  • Requires disciplined feature scaling (StandardScaler)
  • Less directly interpretable than decision tree rules
  • Probability outputs require Platt scaling / sigmoid calibration
```

---

### 3.5 Comparative Analysis Matrix

| Evaluation Dimension | Linear Regression | Decision Tree Classifier | Support Vector Machine |
| :--- | :--- | :--- | :--- |
| **Training Speed** | Ultra-Fast (~10ms) | Fast (~50ms) | Moderate (~150ms) |
| **Complexity** | Linear Dot Product | Conditional Tree Traversal | Convex Optimization / Hyperplane |
| **Required Sample Size** | Moderate (1,000+) | Moderate (2,000+) | Moderate to High (5,000+) |
| **Interpretability** | High (Weights & Bias) | High (Visual Tree Rules) | Moderate (Feature Weights & Distance) |
| **Overfitting Susceptibility** | Low | High (Mitigated via `max_depth`) | Low (Regularized with C) |
| **Non-Linear Dynamics** | Limited | High | High |
| **Primary System Role** | Financial Capacity Index | Scholarship Tier Allocation | Enrollment Probability Estimator |

---

## 4. Use Case Diagrams

The platform addresses two primary user roles with isolated permission boundaries:

### Student Applicant Role
- ✅ Self-register via multi-step application form (Personal, Academic, Financial)
- ✅ Secure JWT-authenticated login
- ✅ Consult student profile and real-time application status
- ✅ Inspect AI recommendations (Financial score, Scholarship tier, Enrollment likelihood)
- ✅ Download official admission/scholarship verification certificate

### System Administrator Role
- ✅ Authenticate via admin credentials
- ✅ Inspect system analytics and global performance indicators
- ✅ Manage student records (Full CRUD: View, Filter, Edit, Approve, Reject)
- ✅ Configure and update annual scholarship quotas
- ✅ Execute tri-model consensus ranking on demand
- ✅ Export reports in CSV, PDF, and PNG formats

---

## 5. Sequence Diagrams

### Scenario: Candidate Login & Profile Retrieval

```
Student User            React Frontend              FastAPI Backend              MongoDB
     │                         │                            │                       │
     │── 1. Enter Credentials ─►│                            │                       │
     │                         │── 2. POST /etudiants/conn──►│                       │
     │                         │                            │── 3. Find By Email ──►│
     │                         │                            │◄── 4. Student Hash ───│
     │                         │                            │                       │
     │                         │                            │── 5. Verify Bcrypt ───┐
     │                         │                            │   Password Check      │
     │                         │                            │◄──────────────────────┘
     │                         │                            │                       │
     │                         │◄── 6. Return JWT Token ────│                       │
     │◄── 7. Redirect Profile ─│                            │                       │
     │                         │                            │                       │
     │── 8. Request Profile ──►│                            │                       │
     │                         │── 9. GET /etudiants/{id} ──►│                       │
     │                         │      [Auth: Bearer Token]  │── 10. Query Record ──►│
     │                         │                            │◄── 11. Profile Data ──│
     │                         │◄── 12. Profile JSON ───────│                       │
     │◄── 13. Render Dashboard │                            │                       │
```

---

## 6. Activity Diagrams

### End-to-End Admission & Quota Evaluation Workflow

```
             Start Admission Evaluation Workflow
                             │
                             ▼
                  Applicant Submits Dossier
                             │
                             ▼
                Initial Status: "En attente"
                             │
                             ▼
              Admin Triggers Batch ML Ranking
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
      Extract Feature Vector     Verify Annual Quota Limit
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
              Execute 3 ML Prediction Models
              (LinReg, Decision Tree, SVM)
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        Tri-Model Consensus         Mixed Score Profile
        (Unanimous Approval)       (Weighted Score Average)
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
            Merge Scores & Enforce Annual Quota Cap
                             │
                             ▼
              Generate Candidate Rank Order
                             │
                             ▼
                 Auto-Approve Top N Candidates
                 (Set Remaining to "Pending")
                             │
                             ▼
             Completed Admission Evaluation Cycle
```

---

## 7. System Reference & Summary Table

### Technical Specifications Summary

| Component | Technical Specification |
| :--- | :--- |
| **Client Tier** | React 18, Tailwind CSS, Lucide React, Recharts, Framer Motion |
| **Backend Tier** | Python 3.11+, FastAPI, Pydantic v2, Uvicorn |
| **Data Persistence** | MongoDB 7.0 (Local / Containerized via PyMongo) |
| **Machine Learning** | Scikit-learn, Joblib, NumPy, Pandas |
| **Security & Auth** | OAuth2 Bearer JWT (HS256), Bcrypt password hashing |
| **Containerization** | Docker, Docker Compose, Multi-stage builds, Nginx reverse proxy |
| **Standard Ports** | Frontend: `3000`, Backend API: `8000`, MongoDB: `27017` |

---

**📞 System Administration**: Antigravity Operations Team  
**📅 Last Verification**: January 2026
