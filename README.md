# Gestion des Élèves - Application Web Complète

Une application web moderne et complète pour la gestion des élèves et des paiements, développée avec React et Tailwind CSS. Cette application simule la structure d'un classeur Google Sheets avec plusieurs feuilles interconnectées.

## 🎯 Fonctionnalités Principales

### 📊 Tableau de Bord
- Vue d'ensemble avec statistiques en temps réel
- Total d'élèves, total encaissé, nombre de paiements
- Répartition par niveau
- Paiements par mois
- Calcul automatique de la moyenne des paiements

### 👥 Gestion des Élèves
- **CRUD complet** : Ajouter, modifier, supprimer et rechercher des élèves
- Colonnes : ID, Nom, Niveau, Date d'inscription
- Support bilingue (français/arabe) avec alignement RTL automatique
- Validation avant suppression (vérifie les paiements liés)

### 💰 Gestion des Paiements
- **Enregistrement de paiements** liés aux élèves
- Colonnes : ID_Paiement, Élève_ID, Montant, Mois, Date_Versement
- Recherche par nom d'élève
- Relation un-à-plusieurs (un élève peut avoir plusieurs paiements)
- Menu déroulant pour les mois

### 🧾 Génération de Reçus
- Interface professionnelle de reçu de paiement
- **Impression** : Utilise `react-to-print` pour imprimer le reçu
- **Export PDF** : Utilise `jspdf` pour télécharger le reçu en PDF
- Numéro de reçu unique généré automatiquement
- Inclut : Nom de l'élève, Niveau, Montant, Date, Numéro de reçu

### 🎨 Interface & Navigation
- **Sidebar responsive** : Menu latéral pour naviguer entre les sections
- Navigation entre : Tableau de Bord, Liste des Élèves, Historique des Paiements
- Design moderne style SaaS avec Tailwind CSS
- Entièrement responsive (mobile et desktop)
- Support parfait du texte bilingue (RTL pour l'arabe)

## 🛠️ Technologies Utilisées

- **React 18** : Composants fonctionnels et hooks
- **Vite** : Build tool moderne et rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **Lucide React** : Bibliothèque d'icônes
- **react-to-print** : Génération de reçus imprimables
- **jspdf** : Génération de fichiers PDF
- **localStorage** : Persistance des données (prêt pour intégration API Google Sheets)

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation latérale
│   ├── Dashboard.jsx        # Tableau de bord avec statistiques
│   ├── ElevesList.jsx       # Gestion des élèves (CRUD)
│   ├── PaiementsList.jsx    # Gestion des paiements
│   └── ReceiptModal.jsx     # Modal de reçu avec impression/PDF
├── utils/
│   ├── storage.js           # Gestion localStorage (simule Google Sheets)
│   └── helpers.js           # Fonctions utilitaires
├── App.jsx                  # Composant principal
├── main.jsx                 # Point d'entrée
└── index.css                # Styles globaux
```

## 🚀 Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Ouvrir votre navigateur** à l'adresse indiquée (généralement http://localhost:5173)

## 📦 Build pour Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist`.

## 📋 Structure des Données

### Feuille "Élèves"
- `id` : Identifiant unique
- `nom` : Nom de l'élève (support français/arabe)
- `niveau` : Niveau scolaire (ex: BAC D, Seconde, etc.)
- `dateInscription` : Date d'inscription

### Feuille "Paiements"
- `id` : Identifiant unique du paiement
- `eleveId` : ID de l'élève (relation)
- `montant` : Montant du paiement
- `mois` : Mois concerné
- `dateVersement` : Date de versement

### Feuille "Niveaux/Classes"
- Liste des niveaux disponibles pour les menus déroulants

## ✨ Caractéristiques Techniques

- **Gestion d'état** : `useState` et `useEffect` pour la gestion des données
- **Stockage persistant** : localStorage pour simuler la persistance (prêt pour API Google Sheets)
- **Relations de données** : Gestion des relations entre élèves et paiements
- **Validation** : Empêche la suppression d'élèves avec paiements enregistrés
- **Support RTL** : Détection automatique de l'arabe et alignement approprié
- **Responsive Design** : Interface adaptative pour tous les écrans

## 🎨 Design

- Style moderne et épuré (inspiration SaaS)
- Cartes avec ombres et bordures subtiles
- Tableaux bien espacés et lisibles
- Icônes Lucide React pour une meilleure UX
- Couleurs cohérentes (indigo pour les actions principales)
- Animations et transitions fluides

## 📝 Notes

- Les données sont stockées dans le localStorage du navigateur
- Les données persistent après rafraîchissement de la page
- L'application est prête pour une future intégration avec Google Sheets API
- Support complet du texte bilingue (français/arabe)

## 🔄 Prochaines Étapes Possibles

- Intégration avec Google Sheets API
- Export des données en Excel/CSV
- Graphiques avancés pour les statistiques
- Système d'authentification
- Historique des modifications
- Notifications et rappels