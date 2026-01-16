import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ElevesList from './components/ElevesList'
import PaiementsList from './components/PaiementsList'
import MonthlyTracking from './components/MonthlyTracking'
import {
  initDatabase,
  getEleves,
  addEleve,
  updateEleve,
  deleteEleve,
  getPaiements,
  addPaiement,
  updatePaiement,
  deletePaiement,
  getNiveaux,
} from './utils/database'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [eleves, setEleves] = useState([])
  const [paiements, setPaiements] = useState([])
  const [niveaux, setNiveaux] = useState([])
  const [dbReady, setDbReady] = useState(false)
  const [loading, setLoading] = useState(false) // Pour afficher un petit chargement pendant les actions

  // Chargement initial
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        await initDatabase()
        
        // On charge les données depuis Supabase
        const dataEleves = await getEleves()
        const dataPaiements = await getPaiements()
        const dataNiveaux = getNiveaux()

        setEleves(dataEleves)
        setPaiements(dataPaiements)
        setNiveaux(dataNiveaux)
        setDbReady(true)
      } catch (error) {
        console.error("Erreur de connexion:", error)
        alert("Erreur de connexion à la base de données. Vérifiez votre internet.")
      }
    }

    loadDatabase()
  }, [])

  // --- GESTION DES ÉLÈVES (ASYNC) ---

  const handleAddEleve = async (eleve) => {
    setLoading(true)
    try {
      await addEleve(eleve)
      // On recharge la liste pour être sûr d'avoir les bonnes données (dont le bon ID)
      setEleves(await getEleves())
    } catch (error) {
      console.error("Erreur ajout élève:", error)
      alert("Erreur lors de l'ajout.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEleve = async (updatedEleve) => {
    setLoading(true)
    try {
      await updateEleve(updatedEleve.id, updatedEleve)
      setEleves(await getEleves())
    } catch (error) {
      console.error("Erreur maj élève:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEleve = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) return
    
    // Vérifier s'il a des paiements
    const hasPaiements = paiements.some((p) => p.eleveId === id)
    if (hasPaiements) {
      alert('Impossible de supprimer un élève qui a des paiements enregistrés.')
      return
    }

    setLoading(true)
    try {
      await deleteEleve(id)
      setEleves(await getEleves())
    } catch (error) {
      console.error("Erreur suppression:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- GESTION DES PAIEMENTS (ASYNC) ---

  const handleAddPaiement = async (paiement) => {
    setLoading(true)
    try {
      await addPaiement(paiement)
      setPaiements(await getPaiements())
    } catch (error) {
      console.error("Erreur ajout paiement:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePaiement = async (updatedPaiement) => {
    setLoading(true)
    try {
      await updatePaiement(updatedPaiement.id, updatedPaiement)
      setPaiements(await getPaiements())
    } catch (error) {
      console.error("Erreur maj paiement:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePaiement = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) return
    
    setLoading(true)
    try {
      await deletePaiement(id)
      setPaiements(await getPaiements())
    } catch (error) {
      console.error("Erreur suppression paiement:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- RENDU ---

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard eleves={eleves} paiements={paiements} />
      case 'eleves':
        return (
          <ElevesList
            eleves={eleves}
            niveaux={niveaux}
            onAddEleve={handleAddEleve}
            onUpdateEleve={handleUpdateEleve}
            onDeleteEleve={handleDeleteEleve}
          />
        )
      case 'paiements':
        return (
          <PaiementsList
            paiements={paiements}
            onAddPaiement={handleAddPaiement}
            onUpdatePaiement={handleUpdatePaiement}
            onDeletePaiement={handleDeletePaiement}
            onRefresh={async () => setPaiements(await getPaiements())}
            eleves={eleves}
          />
        )
      case 'suivi':
        return (
          <MonthlyTracking
            eleves={eleves}
            paiements={paiements}
            onAddPaiement={handleAddPaiement}
          />
        )
      default:
        return <Dashboard eleves={eleves} paiements={paiements} />
    }
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connexion au Cloud...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="pl-64 transition-all duration-300">
        {loading && (
          <div className="fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Sauvegarde...
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  )
}

export default App