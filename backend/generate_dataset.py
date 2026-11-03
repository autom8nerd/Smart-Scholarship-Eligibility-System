"""
Synthetic Dataset Generator for Students

Generates a reproducible synthetic dataset of students for training
the 3 machine learning models (Linear Regression, Decision Tree, SGD/SVM).

Features and targets are calibrated with Gaussian noise to simulate real-world
predictive modeling challenges (imperfect realistic signal rather than artificial
deterministic rules).
"""
import os
import sys

import numpy as np
import pandas as pd

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SEED = 42

REGIONS = [
    "Casablanca-Settat",
    "Rabat-Salé-Kénitra",
    "Marrakech-Safi",
    "Fès-Meknès",
    "Tanger-Tétouan-Al Hoceïma",
    "Souss-Massa",
    "Béni Mellal-Khénifra",
    "Oriental",
    "Drâa-Tafilalet",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
]
# Approximate regional population distribution weights for Morocco
REGION_WEIGHTS = [0.20, 0.13, 0.11, 0.11, 0.10, 0.08, 0.07, 0.06, 0.05, 0.03, 0.03, 0.03]


def generer_dataset(n_lignes: int = 30_000, seed: int = SEED) -> pd.DataFrame:
    """
    Generate n_lignes synthetic student records with academic, financial,
    and geographic features, plus 3 noisy learning targets.
    """
    rng = np.random.default_rng(seed)

    # ------------------------------------------------------------------
    # Features
    # ------------------------------------------------------------------
    gpa = np.clip(rng.normal(7.2, 1.4, n_lignes), 2.0, 10.0)

    # Correlated with GPA but containing unique noise (two distinct exams)
    exam_score = np.clip(
        0.5 * (gpa / 10.0 * 100.0) + 0.5 * rng.normal(55, 18, n_lignes),
        0.0, 100.0,
    )

    # Monthly household income in INR (₹): log-normal distribution
    family_income = np.clip(rng.lognormal(mean=np.log(25000), sigma=0.65, size=n_lignes), 5000, 300_000)

    dependents = np.clip(rng.poisson(2.2, n_lignes), 0, 8)

    distance_km = np.clip(rng.exponential(scale=25, size=n_lignes), 0.5, 250.0)

    region = rng.choice(REGIONS, size=n_lignes, p=REGION_WEIGHTS)

    # ------------------------------------------------------------------
    # Target 1 — financial_capacity_score (regression, 0-100)
    # Household financial capacity index combining income, family burden, and merit
    # ------------------------------------------------------------------
    signal_financier = (
        20.0
        + 2.4 * gpa
        + 0.15 * exam_score
        + 0.25 * (family_income / 1000.0)
        - 3.0 * dependents
    )
    bruit_financier = rng.normal(0, 12, n_lignes)
    financial_capacity_score = np.clip(signal_financier + bruit_financier, 0.0, 100.0)

    # ------------------------------------------------------------------
    # Target 2 — scholarship_class (classification, 0-3)
    # Composite merit (GPA) + financial need (income, dependents)
    # ------------------------------------------------------------------
    facteur_revenu = np.clip((80_000 - family_income) / 80_000 * 100.0, 0.0, 100.0)
    facteur_dependants = np.clip(dependents * 12.0, 0.0, 100.0)
    composite_bourse = (
        0.5 * (gpa / 10.0 * 100.0)
        + 0.3 * facteur_revenu
        + 0.2 * facteur_dependants
        + rng.normal(0, 15, n_lignes)
    )
    scholarship_class = np.select(
        [composite_bourse >= 75, composite_bourse >= 55, composite_bourse >= 35],
        [3, 2, 1],
        default=0,
    )

    # ------------------------------------------------------------------
    # Target 3 — enrollment_probability_class (classification, 0-2)
    # Academic confidence + financial viability minus geographic distance friction
    # ------------------------------------------------------------------
    facteur_revenu_inscription = np.clip(family_income / 100_000 * 100.0, 0.0, 100.0)
    facteur_distance = np.clip(distance_km / 150.0 * 100.0, 0.0, 100.0)
    composite_inscription = (
        0.30 * (gpa / 10.0 * 100.0)
        + 0.30 * exam_score
        + 0.20 * facteur_revenu_inscription
        - 0.20 * facteur_distance
        + rng.normal(0, 15, n_lignes)
    )
    enrollment_probability_class = np.select(
        [composite_inscription >= 45, composite_inscription >= 25],
        [2, 1],
        default=0,
    )

    return pd.DataFrame({
        "gpa": gpa.round(2),
        "exam_score": exam_score.round(2),
        "family_income": family_income.round(2),
        "dependents": dependents.astype(int),
        "distance_km": distance_km.round(2),
        "region": region,
        "financial_capacity_score": financial_capacity_score.round(2),
        "scholarship_class": scholarship_class.astype(int),
        "enrollment_probability_class": enrollment_probability_class.astype(int),
    })


def main():
    n_lignes = int(os.environ.get("N_LIGNES_DATASET", 30_000))
    print(f"[*] Generating {n_lignes:,} synthetic student records (seed={SEED})...")
    df = generer_dataset(n_lignes, SEED)

    chemin_env = os.environ.get("CHEMIN_DATASET")
    if chemin_env:
        chemin_csv = os.path.abspath(chemin_env)
    else:
        chemin_parent = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "moroccan_students_scholarship_dataset.csv"))
        try:
            if os.path.isdir(os.path.dirname(chemin_parent)):
                chemin_csv = chemin_parent
            else:
                chemin_csv = os.path.abspath(os.path.join(os.path.dirname(__file__), "moroccan_students_scholarship_dataset.csv"))
        except Exception:
            chemin_csv = os.path.abspath(os.path.join(os.path.dirname(__file__), "moroccan_students_scholarship_dataset.csv"))

    df.to_csv(chemin_csv, index=False)

    print(f"[✓] Dataset successfully written to: {chemin_csv}")
    print(f"    {len(df):,} rows, {len(df.columns)} columns")
    print("\nClass distribution for scholarship_class:")
    print(df["scholarship_class"].value_counts(normalize=True).sort_index().round(3))
    print("\nClass distribution for enrollment_probability_class:")
    print(df["enrollment_probability_class"].value_counts(normalize=True).sort_index().round(3))


if __name__ == "__main__":
    main()
