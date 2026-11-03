import api from './api';

// Helper function to flatten nested student data
const flattenStudent = (student) => {
  if (!student) return student;
  
  return {
    idEtudiant: student.idEtudiant,
    prenom: student.prenom || '',
    nom: student.nom || '',
    email: student.email || '',
    annee: student.annee || 2024,
    gpa: student.donnees_academiques?.gpa || student.gpa || '',
    notes_examen: student.donnees_academiques?.noteExamen || student.notes_examen || '',
    revenu: student.donnees_financieres?.revenu || student.revenu || '',
    dependants: student.donnees_financieres?.dependants || student.dependants || '',
    distance: student.donnees_contextuelles?.distance || student.distance || '',
    type_bourse: student.type_bourse || 'Partiel',
    montant_bourse: student.montant_bourse || '',
    statut: student.statut || 'En attente',
    dateCreation: student.dateCreation,
    dateModification: student.dateModification
  };
};

const studentService = {
  // Get all students
  getAllStudents: async (skip = 0, limit = 10000) => {
    try {
      const response = await api.get('/etudiants/', {
        params: { saut: skip, limite: limit }
      });
      // Return students with complete nested structure
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single student
  getStudent: async (id) => {
    try {
      const response = await api.get(`/etudiants/${id}`);
      // Return the complete nested structure, not flattened
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register student with new Moroccan education system
  registerStudent: async (data) => {
    try {
      // Build the request payload with the new schema
      const payload = {
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        annee: data.annee || 2024,
        niveau_etude: data.niveau_etude || 'Baccalauréat',
        donnees_baccalaureat: {
          notes_regionales: parseFloat(data.donnees_baccalaureat?.notes_regionales) || 0,
          note_generale: parseFloat(data.donnees_baccalaureat?.note_generale) || 0,
          option: data.donnees_baccalaureat?.option || 'Maths',
        },
        donnees_financieres: {
          revenu: parseFloat(data.donnees_financieres?.revenu) || 0,
          dependants: parseInt(data.donnees_financieres?.dependants) || 0,
        },
        donnees_contextuelles: {
          distance: parseFloat(data.donnees_contextuelles?.distance) || 0,
        },
        type_sponsorship: data.type_sponsorship || 'Complète',
      };
      
      // Add diplôme data if provided (for Bac+2 and above)
      if (data.donnees_diplome) {
        payload.donnees_diplome = {
          notes_diplome: parseFloat(data.donnees_diplome.notes_diplome) || 0,
          option: data.donnees_diplome.option || '',
        };
      } else {
        payload.donnees_diplome = null;
      }
      
      const response = await api.post('/etudiants/enregistrer', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update student
  updateStudent: async (id, data) => {
    try {
      const response = await api.put(`/etudiants/${id}`, data);
      // Return the complete nested structure, not flattened
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/etudiants/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve student
  approveStudent: async (id) => {
    try {
      const response = await api.patch(`/etudiants/${id}/approuver`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reject student
  rejectStudent: async (id) => {
    try {
      const response = await api.patch(`/etudiants/${id}/rejeter`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login student
  loginStudent: async (email, password) => {
    try {
      const response = await api.post('/etudiants/connexion', {
        email: email,
        password: password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default studentService;
