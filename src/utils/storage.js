// Gestion du stockage localStorage pour simuler les feuilles Google Sheets

const STORAGE_KEYS = {
  ELEVES: 'eleves',
  PAIEMENTS: 'paiements',
  NIVEAUX: 'niveaux',
}

// Niveaux par défaut
const DEFAULT_NIVEAUX = [
  'BAC D',
  'BAC A',
  'BAC C',
  'BAC B',
  'Seconde',
  'Première',
  'Terminale',
]

// Données initiales des élèves
const INITIAL_ELEVES = [
  { id: 1, nom: 'Benine Abdel Aziz', niveau: 'BAC D', dateInscription: '2024-01-15', typeCours: 'classe' },
  { id: 2, nom: 'Boubekar Maham', niveau: 'BAC D', dateInscription: '2024-01-16', typeCours: 'classe' },
  { id: 3, nom: 'Hamoud med babe', niveau: 'BAC D', dateInscription: '2024-01-17', typeCours: 'particulier' },
  { id: 4, nom: 'محمد بوحمادي', niveau: 'BAC D', dateInscription: '2024-01-18', typeCours: 'classe' },
  { id: 5, nom: 'محمد الأمين التراد', niveau: 'BAC D', dateInscription: '2024-01-19', typeCours: 'particulier' },
]

// Fonctions pour les élèves
export const getEleves = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.ELEVES)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(STORAGE_KEYS.ELEVES, JSON.stringify(INITIAL_ELEVES))
  return INITIAL_ELEVES
}

export const saveEleves = (eleves) => {
  try {
    // S'assurer que tous les élèves ont toutes les propriétés nécessaires
    const elevesComplets = eleves.map((eleve) => ({
      id: eleve.id,
      nom: eleve.nom || '',
      niveau: eleve.niveau || '',
      dateInscription: eleve.dateInscription || new Date().toISOString().split('T')[0],
      typeCours: eleve.typeCours || 'classe',
    }))
    localStorage.setItem(STORAGE_KEYS.ELEVES, JSON.stringify(elevesComplets))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des élèves:', error)
  }
}

// Fonctions pour les paiements
export const getPaiements = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.PAIEMENTS)
  return stored ? JSON.parse(stored) : []
}

export const savePaiements = (paiements) => {
  try {
    // S'assurer que tous les paiements ont toutes les propriétés nécessaires
    const paiementsComplets = paiements.map((paiement) => ({
      id: paiement.id,
      eleveId: paiement.eleveId,
      montant: paiement.montant,
      mois: paiement.mois || '',
      dateVersement: paiement.dateVersement || new Date().toISOString().split('T')[0],
    }))
    localStorage.setItem(STORAGE_KEYS.PAIEMENTS, JSON.stringify(paiementsComplets))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paiements:', error)
  }
}

// Fonctions pour les niveaux
export const getNiveaux = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.NIVEAUX)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(STORAGE_KEYS.NIVEAUX, JSON.stringify(DEFAULT_NIVEAUX))
  return DEFAULT_NIVEAUX
}

export const saveNiveaux = (niveaux) => {
  localStorage.setItem(STORAGE_KEYS.NIVEAUX, JSON.stringify(niveaux))
}

// Fonction utilitaire pour générer un ID unique
export const generateId = () => {
  return Date.now() + Math.random()
}
