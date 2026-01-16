import { Users, DollarSign, BarChart3, CreditCard } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function Dashboard({ eleves, paiements }) {
  // Calculer les statistiques
  const totalEleves = eleves.length
  const totalPaiements = paiements.length
  const totalEncaisse = paiements.reduce((sum, p) => sum + (parseFloat(p.montant) || 0), 0)

  // Répartition par niveau
  const repartitionNiveau = eleves.reduce((acc, eleve) => {
    acc[eleve.niveau] = (acc[eleve.niveau] || 0) + 1
    return acc
  }, {})

  // Paiements par mois
  const paiementsParMois = paiements.reduce((acc, paiement) => {
    const mois = paiement.mois || 'Non spécifié'
    acc[mois] = (acc[mois] || 0) + (parseFloat(paiement.montant) || 0)
    return acc
  }, {})


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h2>
        <p className="text-gray-600">Vue d'ensemble de votre activité</p>
      </div>

      {/* Cartes statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Élèves</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {totalEleves}
              </p>
            </div>
            <Users className="w-12 h-12 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Encaissé</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(totalEncaisse)}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paiements</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {totalPaiements}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Répartition par niveau */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Répartition par Niveau
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(repartitionNiveau).map(([niveau, count]) => (
            <div
              key={niveau}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700">{niveau}</span>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                {count} élève(s)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Paiements par mois */}
      {Object.keys(paiementsParMois).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Paiements par Mois
          </h3>
          <div className="space-y-3">
            {Object.entries(paiementsParMois).map(([mois, montant]) => (
              <div
                key={mois}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700">{mois}</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(montant)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
