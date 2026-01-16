import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X, FileText, Download } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/helpers'
import ReceiptModal from './ReceiptModal'

export default function PaiementsList({
  paiements,
  onAddPaiement,
  onUpdatePaiement,
  onDeletePaiement,
  onRefresh,
  eleves,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPaiement, setEditingPaiement] = useState(null)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [formData, setFormData] = useState({
    eleveId: '',
    montant: '',
    mois: '',
    dateVersement: new Date().toISOString().split('T')[0],
  })

  // Filtrer les paiements
  const filteredPaiements = paiements.filter((paiement) => {
    const eleve = eleves.find((e) => e.id === paiement.eleveId)
    if (!eleve) return false
    const searchLower = searchTerm.toLowerCase()
    const nomLower = eleve.nom.toLowerCase()
    return nomLower.includes(searchLower) || eleve.nom.includes(searchTerm)
  })

  // Obtenir le nom de l'élève
  const getEleveName = (eleveId) => {
    const eleve = eleves.find((e) => e.id === eleveId)
    return eleve ? eleve.nom : 'Élève supprimé'
  }

  // Obtenir le niveau de l'élève
  const getEleveNiveau = (eleveId) => {
    const eleve = eleves.find((e) => e.id === eleveId)
    return eleve ? eleve.niveau : ''
  }

  // Gérer l'ajout/modification
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.eleveId || !formData.montant || !formData.mois) {
      alert('Veuillez remplir tous les champs')
      return
    }

    let newPaiement = null

    if (editingPaiement) {
      onUpdatePaiement(editingPaiement.id, {
        eleveId: parseInt(formData.eleveId),
        montant: parseFloat(formData.montant),
        mois: formData.mois,
        dateVersement: formData.dateVersement,
      })
      setEditingPaiement(null)
    } else {
      newPaiement = {
        eleveId: parseInt(formData.eleveId),
        montant: parseFloat(formData.montant),
        mois: formData.mois,
        dateVersement: formData.dateVersement,
      }
      const addedPaiement = onAddPaiement(newPaiement)
      newPaiement = addedPaiement || newPaiement
    }

    setFormData({
      eleveId: '',
      montant: '',
      mois: '',
      dateVersement: new Date().toISOString().split('T')[0],
    })
    setShowForm(false)

    // Si c'est un nouveau paiement, ouvrir directement le reçu
    if (newPaiement && newPaiement.id) {
      setSelectedReceipt(newPaiement)
    }
  }

  const handleEdit = (paiement) => {
    setEditingPaiement(paiement)
    setFormData({
      eleveId: paiement.eleveId.toString(),
      montant: paiement.montant.toString(),
      mois: paiement.mois,
      dateVersement: paiement.dateVersement || new Date().toISOString().split('T')[0],
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      onDeletePaiement(id)
    }
  }

  const handleCancel = () => {
    setFormData({
      eleveId: '',
      montant: '',
      mois: '',
      dateVersement: new Date().toISOString().split('T')[0],
    })
    setEditingPaiement(null)
    setShowForm(false)
  }

  // Mois disponibles
  const moisOptions = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Historique des Paiements
        </h2>
        <p className="text-gray-600">Gérez les paiements des élèves</p>
      </div>

      {/* Barre de recherche et bouton d'ajout */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom d'élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingPaiement(null)
              setFormData({
                eleveId: '',
                montant: '',
                mois: '',
                dateVersement: new Date().toISOString().split('T')[0],
              })
              setShowForm(true)
            }}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Enregistrer un paiement
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingPaiement
                ? 'Modifier un paiement'
                : 'Enregistrer un paiement'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Élève
              </label>
              <select
                value={formData.eleveId}
                onChange={(e) =>
                  setFormData({ ...formData, eleveId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez un élève</option>
                {eleves.map((eleve) => (
                  <option key={eleve.id} value={eleve.id}>
                    {eleve.nom} - {eleve.niveau}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.montant}
                onChange={(e) =>
                  setFormData({ ...formData, montant: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois
              </label>
              <select
                value={formData.mois}
                onChange={(e) =>
                  setFormData({ ...formData, mois: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez un mois</option>
                {moisOptions.map((mois) => (
                  <option key={mois} value={mois}>
                    {mois}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de versement
              </label>
              <input
                type="date"
                value={formData.dateVersement}
                onChange={(e) =>
                  setFormData({ ...formData, dateVersement: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {editingPaiement ? 'Modifier' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mois
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de versement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPaiements.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Aucun paiement trouvé pour cette recherche"
                      : "Aucun paiement enregistré"}
                  </td>
                </tr>
              ) : (
                filteredPaiements.map((paiement) => (
                  <tr
                    key={paiement.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getEleveName(paiement.eleveId)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getEleveNiveau(paiement.eleveId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(paiement.montant)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.mois}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(paiement.dateVersement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedReceipt(paiement)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Voir le reçu"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(paiement)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(paiement.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de reçu */}
      {selectedReceipt && (
        <ReceiptModal
          paiement={selectedReceipt}
          eleve={eleves.find((e) => e.id === selectedReceipt.eleveId)}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  )
}
