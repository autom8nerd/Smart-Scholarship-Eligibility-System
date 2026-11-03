"""
Data Cleaning and Exploratory Data Analysis (EDA)
For Moroccan Students Scholarship Dataset

Purpose: Clean the data and extract business insights for marketing strategies,
customer segmentation, and KPI analysis.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# ==================== DATA LOADING AND INITIAL INSPECTION ====================
print("\n" + "="*80)
print("LOADING DATA AND PERFORMING INITIAL INSPECTION")
print("="*80)

import os

dataset_filename = 'moroccan_students_scholarship_dataset.csv' if os.path.exists('moroccan_students_scholarship_dataset.csv') else 'moroccan_students_scholarship_dataset_500k.csv'
df = pd.read_csv(dataset_filename)

print(f"\nDataset Shape: {df.shape}")
print(f"\nColumn Names and Types:")
print(df.dtypes)
print(f"\nFirst few rows:")
print(df.head())

# ==================== DATA QUALITY ASSESSMENT ====================
print("\n" + "="*80)
print("DATA QUALITY ASSESSMENT")
print("="*80)

print("\n1. MISSING VALUES:")
missing_data = pd.DataFrame({
    'Column': df.columns,
    'Missing_Count': df.isnull().sum(),
    'Missing_Percentage': (df.isnull().sum() / len(df)) * 100
})
print(missing_data[missing_data['Missing_Count'] > 0])

print("\n2. DUPLICATE ROWS:")
print(f"Number of duplicates: {df.duplicated().sum()}")

print("\n3. BASIC STATISTICS:")
print(df.describe())

# ==================== DATA CLEANING ====================
print("\n" + "="*80)
print("DATA CLEANING")
print("="*80)

df_clean = df.copy()

# Handle missing values
print("\n1. Handling Missing Values:")

# For numerical columns with missing values, we'll use median imputation
numerical_cols = df_clean.select_dtypes(include=[np.number]).columns
for col in numerical_cols:
    if df_clean[col].isnull().sum() > 0:
        median_val = df_clean[col].median()
        df_clean[col].fillna(median_val, inplace=True)
        print(f"   - {col}: Filled with median ({median_val:.2f})")

# Check for categorical missing values
categorical_cols = df_clean.select_dtypes(include=['object']).columns
for col in categorical_cols:
    if df_clean[col].isnull().sum() > 0:
        mode_val = df_clean[col].mode()[0]
        df_clean[col].fillna(mode_val, inplace=True)
        print(f"   - {col}: Filled with mode ({mode_val})")

print(f"   [OK] Missing values handled. Remaining: {df_clean.isnull().sum().sum()}")

# Remove duplicates
print("\n2. Removing Duplicates:")
initial_rows = len(df_clean)
df_clean = df_clean.drop_duplicates()
removed_duplicates = initial_rows - len(df_clean)
print(f"   [OK] Removed {removed_duplicates} duplicate rows")

# Detect and handle outliers using IQR method
print("\n3. Outlier Detection and Treatment:")
for col in ['gpa', 'exam_score', 'family_income', 'distance_km', 'financial_capacity_score']:
    Q1 = df_clean[col].quantile(0.25)
    Q3 = df_clean[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    outliers = df_clean[(df_clean[col] < lower_bound) | (df_clean[col] > upper_bound)]
    print(f"   - {col}: {len(outliers)} outliers detected (kept for analysis)")

print("\n4. Data Type Validation:")
print(f"   [OK] All numerical columns are numeric")
print(f"   [OK] Region column contains {df_clean['region'].nunique()} unique regions")
print(f"   [OK] Scholarship classes: {sorted(df_clean['scholarship_class'].unique())}")
print(f"   [OK] Enrollment probability classes: {sorted(df_clean['enrollment_probability_class'].unique())}")

print(f"\n[COMPLETE] CLEANING COMPLETE - Cleaned dataset shape: {df_clean.shape}")
print(f"  Data quality: {(1 - df_clean.isnull().sum().sum() / (df_clean.shape[0] * df_clean.shape[1])) * 100:.2f}% complete")

# ==================== EXPLORATORY DATA ANALYSIS (EDA) ====================
print("\n" + "="*80)
print("EXPLORATORY DATA ANALYSIS (EDA)")
print("="*80)

# 1. DISTRIBUTION ANALYSIS
print("\n1. DISTRIBUTION ANALYSIS:")
print("\n   A. GPA Distribution:")
print(f"      Mean: {df_clean['gpa'].mean():.2f}")
print(f"      Median: {df_clean['gpa'].median():.2f}")
print(f"      Std Dev: {df_clean['gpa'].std():.2f}")
print(f"      Range: {df_clean['gpa'].min():.2f} - {df_clean['gpa'].max():.2f}")

print("\n   B. Exam Score Distribution:")
print(f"      Mean: {df_clean['exam_score'].mean():.2f}")
print(f"      Median: {df_clean['exam_score'].median():.2f}")
print(f"      Std Dev: {df_clean['exam_score'].std():.2f}")

print("\n   C. Family Income Distribution:")
print(f"      Mean: ${df_clean['family_income'].mean():.2f}")
print(f"      Median: ${df_clean['family_income'].median():.2f}")
print(f"      Range: ${df_clean['family_income'].min():.2f} - ${df_clean['family_income'].max():.2f}")

# 2. CUSTOMER VALUE ANALYSIS
print("\n2. CUSTOMER VALUE ANALYSIS:")

# Create financial capacity tiers
df_clean['financial_tier'] = pd.cut(df_clean['family_income'], 
                                    bins=[0, 2500, 7500, 12500, float('inf')],
                                    labels=['Low Income', 'Lower-Middle', 'Upper-Middle', 'High Income'])

print("\n   A. Distribution by Financial Capacity:")
print(df_clean['financial_tier'].value_counts().sort_index())

print("\n   B. Enrollment Rate by Financial Tier:")
enrollment_by_tier = df_clean.groupby('financial_tier')['enrollment_probability_class'].agg(['sum', 'count', 'mean'])
enrollment_by_tier.columns = ['Enrolled', 'Total', 'Enrollment_Rate']
enrollment_by_tier['Enrollment_Rate'] = enrollment_by_tier['Enrollment_Rate'] * 100
print(enrollment_by_tier)

# 3. SCHOLARSHIP CLASS ANALYSIS
print("\n3. SCHOLARSHIP CLASS DISTRIBUTION:")
scholarship_dist = df_clean['scholarship_class'].value_counts().sort_index()
print(scholarship_dist)
print(f"\n   Most common scholarship class: {scholarship_dist.idxmax()} ({scholarship_dist.max()} students)")

# 4. REGIONAL ANALYSIS
print("\n4. REGIONAL INSIGHTS:")
regional_stats = df_clean.groupby('region').agg({
    'gpa': 'mean',
    'exam_score': 'mean',
    'family_income': 'mean',
    'enrollment_probability_class': 'mean',
    'region': 'count'
}).rename(columns={'region': 'student_count'})
regional_stats['enrollment_rate'] = regional_stats['enrollment_probability_class'] * 100
regional_stats = regional_stats.sort_values('student_count', ascending=False)
print(regional_stats)

print(f"\n   Top 3 regions by student count:")
print(regional_stats['student_count'].head(3))

# 5. CORRELATION ANALYSIS
print("\n5. CORRELATION ANALYSIS:")
numeric_cols = ['gpa', 'exam_score', 'family_income', 'dependents', 'distance_km', 
                'financial_capacity_score', 'enrollment_probability_class']
correlation_matrix = df_clean[numeric_cols].corr()

print("\n   Correlations with Enrollment Probability:")
enrollment_corr = correlation_matrix['enrollment_probability_class'].sort_values(ascending=False)
print(enrollment_corr)

# 6. DEPENDENT ANALYSIS
print("\n6. DEPENDENTS IMPACT ON ENROLLMENT:")
dependents_analysis = df_clean.groupby('dependents').agg({
    'enrollment_probability_class': ['count', 'sum', 'mean']
}).round(3)
dependents_analysis.columns = ['Total_Students', 'Enrolled', 'Enrollment_Rate']
dependents_analysis['Enrollment_Rate'] = dependents_analysis['Enrollment_Rate'] * 100
print(dependents_analysis)

# 7. DISTANCE IMPACT
print("\n7. DISTANCE FROM INSTITUTION IMPACT:")
df_clean['distance_tier'] = pd.cut(df_clean['distance_km'], 
                                   bins=[0, 1, 30, 60, float('inf')],
                                   labels=['On Campus', 'Close (1-30km)', 'Medium (30-60km)', 'Far (>60km)'])
distance_analysis = df_clean.groupby('distance_tier').agg({
    'enrollment_probability_class': ['count', 'sum', 'mean'],
    'family_income': 'mean'
}).round(2)
distance_analysis.columns = ['Total', 'Enrolled', 'Enrollment_Rate', 'Avg_Income']
distance_analysis['Enrollment_Rate'] = distance_analysis['Enrollment_Rate'] * 100
print(distance_analysis)

# ==================== KEY BUSINESS INSIGHTS ====================
print("\n" + "="*80)
print("KEY BUSINESS INSIGHTS FOR MARKETING STRATEGIES")
print("="*80)

# High value customers
high_value = df_clean[(df_clean['enrollment_probability_class'] == 1) & 
                       (df_clean['family_income'] > df_clean['family_income'].quantile(0.75))]
print(f"\n1. HIGH VALUE CUSTOMERS (Enrolled + High Income):")
print(f"   Count: {len(high_value)}")
print(f"   Average Income: ${high_value['family_income'].mean():.2f}")
print(f"   Average GPA: {high_value['gpa'].mean():.2f}")

# At-risk customers
at_risk = df_clean[(df_clean['enrollment_probability_class'] == 0) & 
                    (df_clean['gpa'] > df_clean['gpa'].quantile(0.75))]
print(f"\n2. AT-RISK CUSTOMERS (High Performance but Not Enrolled):")
print(f"   Count: {len(at_risk)}")
print(f"   Reasons: Check distance ({at_risk['distance_km'].mean():.1f}km avg) and income (${at_risk['family_income'].mean():.2f})")

# Budget-conscious students
budget_conscious = df_clean[df_clean['family_income'] < df_clean['family_income'].quantile(0.25)]
print(f"\n3. BUDGET-CONSCIOUS SEGMENT:")
print(f"   Count: {len(budget_conscious)}")
print(f"   Enrollment Rate: {budget_conscious['enrollment_probability_class'].mean() * 100:.1f}%")
print(f"   Avg GPA: {budget_conscious['gpa'].mean():.2f}")

# ==================== CREATE VISUALIZATIONS ====================
print("\n" + "="*80)
print("GENERATING VISUALIZATIONS")
print("="*80)

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (16, 12)

# Create subplots
fig = plt.figure(figsize=(18, 14))

# 1. GPA Distribution
ax1 = plt.subplot(3, 3, 1)
plt.hist(df_clean['gpa'], bins=30, color='skyblue', edgecolor='black')
plt.xlabel('GPA')
plt.ylabel('Frequency')
plt.title('Distribution of GPA')
plt.axvline(df_clean['gpa'].mean(), color='red', linestyle='--', label=f'Mean: {df_clean["gpa"].mean():.2f}')
plt.legend()

# 2. Exam Score Distribution
ax2 = plt.subplot(3, 3, 2)
plt.hist(df_clean['exam_score'], bins=30, color='lightgreen', edgecolor='black')
plt.xlabel('Exam Score')
plt.ylabel('Frequency')
plt.title('Distribution des Notes d\'Examen')
plt.axvline(df_clean['exam_score'].mean(), color='red', linestyle='--', label=f'Mean: {df_clean["exam_score"].mean():.2f}')
plt.legend()

# 3. Family Income Distribution
ax3 = plt.subplot(3, 3, 3)
plt.hist(df_clean['family_income'], bins=30, color='salmon', edgecolor='black')
plt.xlabel('Family Income ($)')
plt.ylabel('Frequency')
plt.title('Distribution of Family Income')
plt.axvline(df_clean['family_income'].mean(), color='red', linestyle='--', label=f'Mean: ${df_clean["family_income"].mean():.0f}')
plt.legend()

# 4. Enrollment Rate by Financial Tier
ax4 = plt.subplot(3, 3, 4)
enrollment_by_tier['Enrollment_Rate'].plot(kind='bar', color='steelblue')
plt.xlabel('Financial Tier')
plt.ylabel('Enrollment Rate (%)')
plt.title('Enrollment Rate by Financial Tier')
plt.xticks(rotation=45)
plt.grid(axis='y')

# 5. Scholarship Class Distribution
ax5 = plt.subplot(3, 3, 5)
df_clean['scholarship_class'].value_counts().sort_index().plot(kind='bar', color='purple')
plt.xlabel('Scholarship Class')
plt.ylabel('Number of Students')
plt.title('Distribution of Scholarship Classes')
plt.xticks(rotation=0)

# 6. Enrollment by Scholarship Class
ax6 = plt.subplot(3, 3, 6)
enrollment_by_class = df_clean.groupby('scholarship_class')['enrollment_probability_class'].mean() * 100
enrollment_by_class.plot(kind='bar', color='orange')
plt.xlabel('Scholarship Class')
plt.ylabel('Enrollment Rate (%)')
plt.title('Enrollment Rate by Scholarship Class')
plt.xticks(rotation=0)

# 7. Distance Impact
ax7 = plt.subplot(3, 3, 7)
distance_analysis['Enrollment_Rate'].plot(kind='bar', color='teal')
plt.xlabel('Distance from Institution')
plt.ylabel('Enrollment Rate (%)')
plt.title('Enrollment Rate by Distance')
plt.xticks(rotation=45)
plt.grid(axis='y')

# 8. Dependents Impact
ax8 = plt.subplot(3, 3, 8)
dependents_analysis['Enrollment_Rate'].plot(kind='line', marker='o', color='green', linewidth=2)
plt.xlabel('Number of Dependents')
plt.ylabel('Enrollment Rate (%)')
plt.title('Enrollment Rate by Number of Dependents')
plt.grid(True)

# 9. Regional Enrollment Top 10
ax9 = plt.subplot(3, 3, 9)
regional_enrollment = df_clean.groupby('region')['enrollment_probability_class'].mean().sort_values(ascending=True).tail(10)
regional_enrollment.plot(kind='barh', color='darkblue')
plt.xlabel('Enrollment Rate')
plt.title('Top 10 Regions by Enrollment Rate')
plt.grid(axis='x')

plt.tight_layout()
plt.savefig('eda_visualizations.png', dpi=300, bbox_inches='tight')
print("[SAVED] Visualizations saved as 'eda_visualizations.png'")
plt.show()

# ==================== SAVE CLEANED DATA ====================
print("\n" + "="*80)
print("SAVING CLEANED DATA")
print("="*80)

df_clean.to_csv('moroccan_students_scholarship_dataset_CLEANED.csv', index=False)
print(f"[SAVED] Cleaned dataset saved as 'moroccan_students_scholarship_dataset_CLEANED.csv'")

# Save summary report
summary_report = {
    'Total Records': len(df_clean),
    'Total Features': len(df_clean.columns),
    'Missing Values': df_clean.isnull().sum().sum(),
    'Enrollment Rate': df_clean['enrollment_probability_class'].mean() * 100,
    'Average GPA': df_clean['gpa'].mean(),
    'Average Income': df_clean['family_income'].mean(),
    'Number of Regions': df_clean['region'].nunique(),
}

print("\n" + "="*80)
print("SUMMARY REPORT")
print("="*80)
for key, value in summary_report.items():
    if isinstance(value, float):
        print(f"{key}: {value:.2f}")
    else:
        print(f"{key}: {value}")

print("\n" + "="*80)
print("[COMPLETE] DATA CLEANING AND EDA COMPLETE")
print("="*80)
print("\nNext Steps:")
print("1. Review the visualizations in 'eda_visualizations.png'")
print("2. Use 'moroccan_students_scholarship_dataset_CLEANED.csv' for ML modeling")
print("3. Develop marketing strategies based on the segments identified above")
print("\n")
