import { useState, useEffect } from 'react'
import { Check, X, Calendar } from 'lucide-react'
import { isArabic } from '../utils/helpers'
import { formatCurrency } from '../utils/helpers'

const MOIS = [
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

export default function MonthlyTracking({ eleves, paiements, onAddPaiement }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterType, setFilterType] = useState('tous') // tous, payes, nonPayes

  // Obtenir les années disponibles
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  // Vérifier si un élève a un paiement pour un mois donné
  const hasPaiement = (eleveId, mois) => {
    return paiements.some(
      (p) => p.eleveId === eleveId && p.mois === mois
    )
  }

  // Obtenir le paiement pour un élève et un mois
  const getPaiement = (eleveId, mois) => {
    return paiements.find((p) => p.eleveId === eleveId && p.mois === mois)
  }

  // Filtrer les élèves selon le filtre
  const filteredEleves = eleves.filter((eleve) => {
    if (filterType === 'tous') return true
    if (filterType === 'payes') {
      // Au moins un paiement dans l'année
      return MOIS.some((mois) => hasPaiement(eleve.id, mois))
    }
    if (filterType === 'nonPayes') {
      // Aucun paiement dans l'année
      return !MOIS.some((mois) => hasPaiement(eleve.id, mois))
    }
    return true
  })

  // Compter les élèves payés et non payés
  const stats = {
    total: eleves.length,
    payes: eleves.filter((e) =>
      MOIS.some((mois) => hasPaiement(e.id, mois))
    ).length,
    nonPayes: eleves.filter(
      (e) => !MOIS.some((mois) => hasPaiement(e.id, mois))
    ).length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Suivi Mensuel des Paiements
        </h2>
        <p className="text-gray-600">
          Suivez les paiements de tous les élèves pour chaque mois de l'année
        </p>
      </div>

      {/* Filtres et statistiques */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Année:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filtrer:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="tous">Tous les élèves</option>
              <option value="payes">Élèves payés</option>
              <option value="nonPayes">Élèves non payés</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total élèves</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Élèves payés</p>
            <p className="text-2xl font-bold text-green-600">{stats.payes}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Élèves non payés</p>
            <p className="text-2xl font-bold text-red-600">{stats.nonPayes}</p>
          </div>
        </div>
      </div>

      {/* Tableau de suivi */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Élève
                </th>
                {MOIS.map((mois) => (
                  <th
                    key={mois}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]"
                  >
                    {mois.substring(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEleves.length === 0 ? (
                <tr>
                  <td
                    colSpan={MOIS.length + 1}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucun élève trouvé
                  </td>
                </tr>
              ) : (
                filteredEleves.map((eleve) => (
                  <tr
                    key={eleve.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200"
                      dir={isArabic(eleve.nom) ? 'rtl' : 'ltr'}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {eleve.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {eleve.niveau} • {eleve.typeCours === 'classe' ? 'Classe' : 'Particulier'}
                      </div>
                    </td>
                    {MOIS.map((mois) => {
                      const aPaiement = hasPaiement(eleve.id, mois)
                      const paiement = getPaiement(eleve.id, mois)

                      return (
                        <td
                          key={mois}
                          className="px-3 py-3 text-center"
                        >
                          {aPaiement ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              {paiement && (
                                <span className="text-xs text-green-600 font-semibold">
                                  {formatCurrency(paiement.montant)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                              <X className="w-5 h-5 text-red-600" />
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-gray-700">Paiement effectué</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-gray-700">Paiement non effectué</span>
          </div>
        </div>
      </div>
    </div>
  )
}
