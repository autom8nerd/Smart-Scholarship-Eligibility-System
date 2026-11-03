#!/usr/bin/env python3
"""Insert 10 test students with proper data"""

import uuid
from datetime import datetime
from utilitaires.base_donnees import GestionnaireBD
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

students_data = [
    {
        "prenom": "Ahmed",
        "nom": "Hassan",
        "email": "ahmed.hassan@test.com",
        "password": "Ahmed123!",
        "phone": "212612345678",
        "address": "Rue 1 Casablanca",
        "niveau_etude": "Baccalauréat",
        "notes_regionales": 16.5,
        "note_generale": 17.0,
        "option_bac": "Maths",
        "notes_diplome": 0,
        "option_diplome": "",
        "revenu": 35000,
        "dependants": 2,
        "distance": 25.5,
        "type_sponsorship": "Complète",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Fatima",
        "nom": "Benali",
        "email": "fatima.benali@test.com",
        "password": "Fatima123!",
        "phone": "212612345679",
        "address": "Rue 2 Marrakech",
        "niveau_etude": "Bac+2",
        "notes_regionales": 14.5,
        "note_generale": 15.0,
        "option_bac": "Physique",
        "notes_diplome": 16.0,
        "option_diplome": "Commerce",
        "revenu": 28000,
        "dependants": 3,
        "distance": 45.0,
        "type_sponsorship": "Partielle",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Mohammed",
        "nom": "Khalili",
        "email": "mohammed.khalili@test.com",
        "password": "Mohammed123!",
        "phone": "212612345680",
        "address": "Rue 3 Fez",
        "niveau_etude": "Baccalauréat",
        "notes_regionales": 18.5,
        "note_generale": 19.0,
        "option_bac": "SVT",
        "notes_diplome": 0,
        "option_diplome": "",
        "revenu": 45000,
        "dependants": 1,
        "distance": 15.0,
        "type_sponsorship": "Moitié",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Aisha",
        "nom": "Mansouri",
        "email": "aisha.mansouri@test.com",
        "password": "Aisha123!",
        "phone": "212612345681",
        "address": "Rue 4 Rabat",
        "niveau_etude": "Bac+3",
        "notes_regionales": 15.0,
        "note_generale": 15.5,
        "option_bac": "Maths",
        "notes_diplome": 17.5,
        "option_diplome": "Informatique",
        "revenu": 22000,
        "dependants": 4,
        "distance": 55.0,
        "type_sponsorship": "Complète",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Omar",
        "nom": "Diallo",
        "email": "omar.diallo@test.com",
        "password": "Omar123!",
        "phone": "212612345682",
        "address": "Rue 5 Tangier",
        "niveau_etude": "Baccalauréat",
        "notes_regionales": 13.0,
        "note_generale": 13.5,
        "option_bac": "Physique",
        "notes_diplome": 0,
        "option_diplome": "",
        "revenu": 18000,
        "dependants": 5,
        "distance": 75.0,
        "type_sponsorship": "Complète",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Layla",
        "nom": "Messaoudi",
        "email": "layla.messaoudi@test.com",
        "password": "Layla123!",
        "phone": "212612345683",
        "address": "Rue 6 Meknes",
        "niveau_etude": "Bac+2",
        "notes_regionales": 16.0,
        "note_generale": 16.5,
        "option_bac": "SVT",
        "notes_diplome": 15.5,
        "option_diplome": "Biologie",
        "revenu": 32000,
        "dependants": 2,
        "distance": 30.0,
        "type_sponsorship": "Partielle",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Hassan",
        "nom": "Bennani",
        "email": "hassan.bennani@test.com",
        "password": "Hassan123!",
        "phone": "212612345684",
        "address": "Rue 7 Agadir",
        "niveau_etude": "Baccalauréat",
        "notes_regionales": 17.0,
        "note_generale": 17.5,
        "option_bac": "Maths",
        "notes_diplome": 0,
        "option_diplome": "",
        "revenu": 40000,
        "dependants": 1,
        "distance": 20.0,
        "type_sponsorship": "Moitié",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Noor",
        "nom": "Elhassan",
        "email": "noor.elhassan@test.com",
        "password": "Noor123!",
        "phone": "212612345685",
        "address": "Rue 8 Tetuan",
        "niveau_etude": "Bac+3",
        "notes_regionales": 14.0,
        "note_generale": 14.5,
        "option_bac": "Physique",
        "notes_diplome": 16.0,
        "option_diplome": "Électronique",
        "revenu": 25000,
        "dependants": 3,
        "distance": 60.0,
        "type_sponsorship": "Complète",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Karim",
        "nom": "Zaidi",
        "email": "karim.zaidi@test.com",
        "password": "Karim123!",
        "phone": "212612345686",
        "address": "Rue 9 Safi",
        "niveau_etude": "Baccalauréat",
        "notes_regionales": 15.5,
        "note_generale": 16.0,
        "option_bac": "SVT",
        "notes_diplome": 0,
        "option_diplome": "",
        "revenu": 30000,
        "dependants": 2,
        "distance": 35.0,
        "type_sponsorship": "Partielle",
        "annee": 2026,
        "statut": "En attente"
    },
    {
        "prenom": "Sara",
        "nom": "Youssef",
        "email": "sara.youssef@test.com",
        "password": "Sara123!",
        "phone": "212612345687",
        "address": "Rue 10 Essaouira",
        "niveau_etude": "Bac+4",
        "notes_regionales": 18.0,
        "note_generale": 18.5,
        "option_bac": "Maths",
        "notes_diplome": 18.0,
        "option_diplome": "Génie Civil",
        "revenu": 50000,
        "dependants": 0,
        "distance": 10.0,
        "type_sponsorship": "Moitié",
        "annee": 2026,
        "statut": "En attente"
    }
]

def insert_students():
    collection = GestionnaireBD.obtenir_collection_etudiants()
    
    # Clear existing test data
    collection.delete_many({})
    
    for data in students_data:
        # Calculate GPA
        gpa = (data["notes_regionales"] + data["note_generale"]) / 2
        exam_score = data["notes_diplome"] if data["notes_diplome"] > 0 else data["note_generale"]
        
        # Determine scholarship class based on financial need and GPA
        # Class 0: No scholarship needed (high income, good GPA)
        # Class 1: Partial scholarship (25%) - moderate income/GPA
        # Class 2: Half scholarship (50%) - lower income or lower GPA
        # Class 3: Full scholarship (100%) - low income and/or low GPA
        
        revenu = data["revenu"]
        dependants = data["dependants"]
        
        # Calculate financial need (0-100)
        max_revenu = 50000
        financial_need = (max_revenu - revenu) / max_revenu * 100
        financial_need = min(100, financial_need + (dependants * 5))
        
        # Normalize GPA to 0-100
        gpa_score = (gpa / 20) * 100
        
        # Determine class based on financial need and GPA
        if financial_need < 30 and gpa_score > 75:
            scholarship_class = 0  # No scholarship
        elif financial_need < 50 and gpa_score > 60:
            scholarship_class = 1  # Partial (25%)
        elif financial_need < 75 or gpa_score < 50:
            scholarship_class = 2  # Half (50%)
        else:
            scholarship_class = 3  # Full (100%)
        
        # Determine enrollment probability class
        # Based on GPA and distance
        if gpa_score > 80 and data["distance"] < 50:
            enrollment_class = 2  # High probability
        elif gpa_score > 60 or data["distance"] < 30:
            enrollment_class = 1  # Medium probability
        else:
            enrollment_class = 0  # Low probability
        
        doc = {
            "idEtudiant": str(uuid.uuid4()),
            **data,
            "motDePasse": pwd_context.hash(data["password"]),
            "gpa": gpa,
            "exam_score": exam_score,
            "scholarship_class": scholarship_class,
            "enrollment_probability_class": enrollment_class,
            "financial_capacity_score": max(0, 100 - financial_need),
            "source": "test",
            "dateCreation": datetime.utcnow(),
            "dateModification": datetime.utcnow()
        }
        collection.insert_one(doc)
        print(f"✓ Inserted: {data['prenom']} {data['nom']} (Class: {scholarship_class}, Enrollment: {enrollment_class})")
    
    print(f"\n✓ Successfully inserted 10 test students")

if __name__ == "__main__":
    insert_students()
