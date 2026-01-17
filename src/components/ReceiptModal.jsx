import React, { useRef } from 'react'
import { X, Printer, Download } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import jsPDF from 'jspdf'
import { formatCurrency, formatDate } from '../utils/helpers'

const ReceiptModal = ({ isOpen, onClose, paiement, eleve }) => {
  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Recu-${eleve?.nom}-${paiement?.mois}`,
  })

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.html(componentRef.current, {
      callback: function (doc) {
        doc.save(`Recu-${eleve?.nom}.pdf`)
      },
      x: 15,
      y: 15,
      width: 170,
      windowWidth: 650
    })
  }

  if (!isOpen || !paiement || !eleve) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* En-tête de la fenêtre */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Reçu de paiement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* --- ZONE À IMPRIMER (Design Simple Original) --- */}
        <div ref={componentRef} className="p-8 bg-white" id="receipt-content">
          <div className="text-center mb-6 border-b pb-4">
            <h1 className="text-xl font-bold text-gray-900 uppercase">REÇU DE PAIEMENT</h1>
            <p className="text-sm text-gray-500 mt-1">Scolarité / Cours</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Élève :</span>
              <span className="font-bold text-gray-900">{eleve.nom} {eleve.prenom}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Classe :</span>
              <span className="font-medium text-gray-900">{eleve.niveau}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Mois payé :</span>
              <span className="font-medium capitalize text-gray-900">{paiement.mois}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date versement :</span>
              <span className="font-medium text-gray-900">{formatDate(paiement.dateVersement)}</span>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-700">Montant Total</span>
              <span className="text-lg font-bold text-indigo-600">
                {formatCurrency(paiement.montant)}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-400">Signature</p>
            <div className="h-12"></div>
          </div>
        </div>
        {/* --- FIN ZONE À IMPRIMER --- */}

        {/* Boutons d'action */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            <Printer size={18} />
            Imprimer
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceiptModal