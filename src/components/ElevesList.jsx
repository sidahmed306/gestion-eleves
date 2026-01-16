import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import { isArabic } from '../utils/helpers'
import { formatDate } from '../utils/helpers'

export default function ElevesList({ eleves, onAddEleve, onUpdateEleve, onDeleteEleve, onRefresh, niveaux, paiements }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEleve, setEditingEleve] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    niveau: '',
    dateInscription: new Date().toISOString().split('T')[0],
    typeCours: 'classe',
  })

  // Filtrer les élèves
  const filteredEleves = eleves.filter((eleve) => {
    const searchLower = searchTerm.toLowerCase()
    const nomLower = eleve.nom.toLowerCase()
    return nomLower.includes(searchLower) || eleve.nom.includes(searchTerm)
  })

  // Gérer l'ajout/modification
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nom.trim() || !formData.niveau.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    if (editingEleve) {
      onUpdateEleve(editingEleve.id, formData)
      setEditingEleve(null)
    } else {
      onAddEleve(formData)
    }

    setFormData({
      nom: '',
      niveau: '',
      dateInscription: new Date().toISOString().split('T')[0],
      typeCours: 'classe',
    })
    setShowForm(false)
  }

  const handleEdit = (eleve) => {
    console.log('Editing eleve:', eleve) // Debug
    setEditingEleve(eleve)
    setFormData({
      nom: eleve.nom || '',
      niveau: eleve.niveau || '',
      dateInscription: eleve.dateInscription || new Date().toISOString().split('T')[0],
      typeCours: eleve.typeCours || 'classe',
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    // Vérifier si l'élève a des paiements
    const hasPaiements = paiements.some((p) => p.eleveId === id)
    if (hasPaiements) {
      alert(
        "Cet élève a des paiements enregistrés. Veuillez d'abord supprimer ses paiements."
      )
      return
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      onDeleteEleve(id)
    }
  }

  const handleCancel = () => {
    setFormData({
      nom: '',
      niveau: '',
      dateInscription: new Date().toISOString().split('T')[0],
      typeCours: 'classe',
    })
    setEditingEleve(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Liste des Élèves
        </h2>
        <p className="text-gray-600">Gérez vos élèves</p>
      </div>

      {/* Barre de recherche et bouton d'ajout */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
            <button
              onClick={() => {
                setEditingEleve(null)
                setFormData({
                  nom: '',
                  niveau: '',
                  dateInscription: new Date().toISOString().split('T')[0],
                  typeCours: 'classe',
                })
                setShowForm(true)
              }}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Ajouter un élève
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingEleve ? 'Modifier un élève' : 'Ajouter un élève'}
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
                Nom de l'élève
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Entrez le nom"
                dir="auto"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <select
                value={formData.niveau}
                onChange={(e) =>
                  setFormData({ ...formData, niveau: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez un niveau</option>
                {niveaux.map((niveau) => (
                  <option key={niveau} value={niveau}>
                    {niveau}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'inscription
              </label>
              <input
                type="date"
                value={formData.dateInscription}
                onChange={(e) =>
                  setFormData({ ...formData, dateInscription: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de cours
              </label>
              <select
                value={formData.typeCours}
                onChange={(e) =>
                  setFormData({ ...formData, typeCours: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="classe">En classe</option>
                <option value="particulier">Particulier</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {editingEleve ? 'Modifier' : 'Ajouter'}
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
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de cours
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEleves.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Aucun élève trouvé pour cette recherche"
                      : "Aucun élève dans la liste"}
                  </td>
                </tr>
              ) : (
                filteredEleves.map((eleve) => (
                  <tr
                    key={eleve.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      dir={isArabic(eleve.nom) ? 'rtl' : 'ltr'}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {eleve.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {eleve.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(eleve.dateInscription)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        eleve.typeCours === 'classe' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {eleve.typeCours === 'classe' ? 'En classe' : 'Particulier'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(eleve)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(eleve.id)}
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
    </div>
  )
}
