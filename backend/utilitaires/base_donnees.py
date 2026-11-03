"""
MongoDB Database Management Module
Manages database connections, connection pooling, and collections lifecycle.
"""
import logging
from pymongo import MongoClient
import os
from config.parametres import URL_MONGODB, NOM_BASE_DONNEES

logger = logging.getLogger(__name__)


class GestionnaireBD:
    """
    Centralized Database Connection Manager.
    Implements the Singleton pattern for shared MongoDB connection pools.
    """
    _client = None
    _base_donnees = None

    @classmethod
    def connecter(cls):
        """
        Establish connection to MongoDB cluster.
        Raises exception if ping verification fails.
        """
        try:
            cls._client = MongoClient(URL_MONGODB)
            cls._base_donnees = cls._client[NOM_BASE_DONNEES]
            cls._base_donnees.command('ping')
            print("[✓] Connected to MongoDB successfully")
            return True
        except Exception as e:
            print(f"[✗] Failed to connect to MongoDB: {e}")
            raise

    @classmethod
    def deconnecter(cls):
        """Close active MongoDB connection pool."""
        if cls._client:
            cls._client.close()
            print("[✓] Disconnected from MongoDB")

    @classmethod
    def obtenir_base_donnees(cls):
        """
        Retrieve database handle.
        Initializes connection if not already active.
        """
        if cls._base_donnees is None:
            cls.connecter()
        return cls._base_donnees

    @classmethod
    def obtenir_collection_etudiants(cls):
        """Retrieve student records collection."""
        bd = cls.obtenir_base_donnees()
        return bd["etudiants"]

    @classmethod
    def obtenir_collection_predictions(cls):
        """Retrieve predictions log collection."""
        bd = cls.obtenir_base_donnees()
        return bd["predictions"]

    @classmethod
    def obtenir_collection_statistiques(cls):
        """Retrieve aggregated statistics collection."""
        bd = cls.obtenir_base_donnees()
        return bd["statistiques"]

    @classmethod
    def obtenir_collection_quotas(cls):
        """Retrieve yearly scholarship quotas collection."""
        bd = cls.obtenir_base_donnees()
        return bd["quotas_bourses"]

    @classmethod
    def initialiser_indices(cls):
        """Create database indexes to optimize lookup queries and guarantee uniqueness."""
        try:
            collection = cls.obtenir_collection_etudiants()
            
            indices_existants = collection.list_indexes()
            for index_info in indices_existants:
                if index_info['name'] != '_id_':
                    try:
                        collection.drop_index(index_info['name'])
                    except Exception as e:
                        logger.warning(f"Could not drop index {index_info['name']}: {e}")
            
            # Compound index on email + academic year (allows same email in separate academic cycles)
            collection.create_index([("email", 1), ("annee", 1)], unique=True)
            
            # Index on creation timestamp
            cls.obtenir_collection_predictions().create_index("dateCreation")
            print("[✓] Database indexes initialized successfully")
        except Exception as e:
            print(f"[⚠] Warning during index initialization: {e}")


def initialiser_bd():
    """Bootstrap database connection and configure indexes."""
    GestionnaireBD.connecter()
    GestionnaireBD.initialiser_indices()


def fermer_bd():
    """Shut down active database connection."""
    GestionnaireBD.deconnecter()
