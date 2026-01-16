// Fonctions utilitaires

// Détecter si le texte contient de l'arabe
export const isArabic = (text) => {
  if (!text) return false
  return /[\u0600-\u06FF]/.test(text)
}

// Formater un montant en devise (MRU - Ouguiya mauritanien)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' MRU'
}

// Formater une date
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Générer un numéro de reçu unique
export const generateReceiptNumber = (paiementId) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `REC-${year}${month}${day}-${String(paiementId).slice(-6)}`
}
