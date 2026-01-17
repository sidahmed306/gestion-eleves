import { supabase } from './supabaseClient'

// Fonction factice pour compatibilité
export const initDatabase = async () => {
  console.log('Connexion Supabase active')
  return true
}

// --- ÉLÈVES ---

export const getEleves = async () => {
  const { data, error } = await supabase
    .from('eleves')
    .select('*')
    .order('nom', { ascending: true })
  
  if (error) {
    console.error('Erreur getEleves:', error)
    return []
  }
  return data
}

export const addEleve = async (eleve) => {
  const { id, ...eleveSansId } = eleve
  const { data, error } = await supabase
    .from('eleves')
    .insert([eleveSansId])
    .select()

  if (error) throw error
  return data[0].id
}

export const updateEleve = async (id, eleve) => {
  const { error } = await supabase
    .from('eleves')
    .update(eleve)
    .eq('id', id)
  if (error) throw error
}

export const deleteEleve = async (id) => {
  const { error } = await supabase
    .from('eleves')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// --- PAIEMENTS ---

export const getPaiements = async () => {
  const { data, error } = await supabase
    .from('paiements')
    .select('*')
    .order('id', { ascending: false }) 

  if (error) {
    console.error('Erreur getPaiements:', error)
    return []
  }
  return data
}

export const addPaiement = async (paiement) => {
  const { id, ...paiementSansId } = paiement
  const { data, error } = await supabase
    .from('paiements')
    .insert([paiementSansId])
    .select()

  if (error) throw error
  return data[0].id
}

export const updatePaiement = async (id, paiement) => {
  const { error } = await supabase
    .from('paiements')
    .update(paiement)
    .eq('id', id)
  if (error) throw error
}

export const deletePaiement = async (id) => {
  const { error } = await supabase
    .from('paiements')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// --- NIVEAUX (Remis comme tu voulais) ---
export const getNiveaux = () => {
  // C'est ici qu'on remet tes classes exactes
  return ['BAC D', 'BAC C', 'BAC A', 'BAC B', 'Seconde', 'Première', 'Terminale', 'Autre']
}