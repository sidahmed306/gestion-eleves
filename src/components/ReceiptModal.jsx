import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { X, Download, Printer, Mail } from 'lucide-react'
import jsPDF from 'jspdf'
import { generateReceiptNumber, formatCurrency, formatDate } from '../utils/helpers'

export default function ReceiptModal({ paiement, eleve, onClose }) {
  const receiptRef = useRef()

  // Impression
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Reçu_${generateReceiptNumber(paiement.id)}`,
  })

  // Génération PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const receiptNumber = generateReceiptNumber(paiement.id)

    // En-tête
    doc.setFontSize(18)
    doc.setTextColor(79, 70, 229) // Indigo
    doc.text('Centre Abdelkader', 105, 20, { align: 'center' })
    
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0) // Noir
    doc.text('REÇU DE PAIEMENT', 105, 30, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text(`N°: ${receiptNumber}`, 105, 40, { align: 'center' })
    
    // Ligne de séparation
    doc.line(20, 45, 190, 45)

    // Informations
    let yPos = 55
    doc.setFontSize(12)
    doc.text('Informations de l\'élève:', 20, yPos)
    yPos += 10
    
    doc.setFontSize(11)
    doc.text(`Nom: ${eleve?.nom || 'N/A'}`, 25, yPos)
    yPos += 7
    doc.text(`Niveau: ${eleve?.niveau || 'N/A'}`, 25, yPos)
    if (eleve?.typeCours) {
      yPos += 7
      doc.text(`Type de cours: ${eleve.typeCours === 'classe' ? 'En classe' : 'Particulier'}`, 25, yPos)
    }
    yPos += 15

    doc.setFontSize(12)
    doc.text('Détails du paiement:', 20, yPos)
    yPos += 10
    
    doc.setFontSize(11)
    doc.text(`Montant: ${formatCurrency(paiement.montant)}`, 25, yPos)
    yPos += 7
    doc.text(`Mois: ${paiement.mois}`, 25, yPos)
    yPos += 7
    doc.text(`Date de versement: ${formatDate(paiement.dateVersement)}`, 25, yPos)
    yPos += 15

    // Date d'émission
    doc.setFontSize(10)
    doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 120, yPos)

    // Sauvegarder
    doc.save(`Reçu_${receiptNumber}.pdf`)
  }

  // Envoyer le PDF par email (simulation - ouvre le client email)
  const handleSendEmail = () => {
    const receiptNumber = generateReceiptNumber(paiement.id)
    const subject = encodeURIComponent(`Reçu de paiement - ${receiptNumber}`)
    const body = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver ci-joint le reçu de paiement pour ${eleve?.nom || 'l\'élève'}.\n\n` +
      `Montant: ${formatCurrency(paiement.montant)}\n` +
      `Mois: ${paiement.mois}\n` +
      `Date: ${formatDate(paiement.dateVersement)}\n\n` +
      `Cordialement`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    
    // Télécharger aussi le PDF
    setTimeout(() => {
      handleDownloadPDF()
    }, 500)
  }

  if (!eleve) return null

  const receiptNumber = generateReceiptNumber(paiement.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Reçu de Paiement</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Imprimer"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Télécharger PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendEmail}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
              title="Envoyer par email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu du reçu */}
        <div ref={receiptRef} className="p-8">
          <div className="max-w-lg mx-auto">
            {/* En-tête du reçu */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-600 mb-2">
                Centre Abdelkader
              </h2>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                REÇU DE PAIEMENT
              </h1>
              <div className="border-t-2 border-gray-300 pt-4">
                <p className="text-sm text-gray-600">
                  N° de reçu: <span className="font-semibold">{receiptNumber}</span>
                </p>
              </div>
            </div>

            {/* Informations de l'élève */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations de l'élève
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium text-gray-900">{eleve.nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Niveau:</span>
                  <span className="font-medium text-gray-900">{eleve.niveau}</span>
                </div>
              </div>
            </div>

            {/* Détails du paiement */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Détails du paiement
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(paiement.montant)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mois:</span>
                  <span className="font-medium text-gray-900">{paiement.mois}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de versement:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(paiement.dateVersement)}
                  </span>
                </div>
              </div>
            </div>

            {/* Date d'émission */}
            <div className="mt-12 pt-8 border-t-2 border-gray-300">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Date d'émission:
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date().toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
