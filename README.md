# 🥦 Mon Panier Rochelais - Système de Commande

Une application web légère et automatisée permettant la réservation de paniers de légumes hebdomadaires en circuit court.

Le système repose sur une architecture "Serverless" utilisant **GitHub Pages** pour le site vitrine et **Google Sheets/Apps Script** pour la gestion des commandes et la logistique.

## ✨ Fonctionnalités

### Côté Client (Site Web)
* affichage des produits de la semaine (Légumes, Prix, Extras).
* Formulaire de commande simple (sans création de compte).
* Choix du lieu et de l'heure de retrait.
* Calcul automatique du total.

### Côté Gestionnaire (Back-office)
* **Base de données :** Toutes les commandes arrivent dans un Google Sheet (`Feuille 1`).
* **Planning Automatisé :** Un onglet `PLANNING` se met à jour automatiquement, trié par jour et par lieu, prêt à être imprimé (format PDF) pour la distribution.
* **Emailing :** Envoi automatique d'un email de confirmation au client (via Gmail).
* **Nettoyage :** Suppression automatique des lignes vides et gestion des erreurs.

---

## ⚙️ Architecture Technique

1.  **Frontend (Site Web) :**
    * Hébergé sur **GitHub Pages**.
    * Fichiers : `index.html` (Structure & Logique), `style.css` (Design).
    * Données : `donnees.csv` (Contient le menu de la semaine).

2.  **Backend (Traitement) :**
    * **Google Apps Script** relié au Google Sheet.
    * Reçoit les données du formulaire (`doPost`).
    * Gère le verrouillage (`LockService`) pour éviter les conflits de commandes simultanées.

---

## 📅 Mise à jour Hebdomadaire (Menu)

Pour changer les légumes et les prix chaque semaine :

1.  Aller sur le fichier **`donnees.csv`** dans ce dépôt GitHub.
2.  Cliquer sur le crayon ✏️ (Edit).
3.  Modifier les sections :
    * `[CONFIG]` : Prix du panier.
    * `[PANIER]` : Liste des légumes.
    * `[EXTRAS]` : Produits additionnels.
    * `[DEADLINES]` : Dates limites de commande.
4.  Cliquer sur **"Commit changes"**.
5.  *Le site se met à jour automatiquement sous 1 à 2 minutes.*

---

## 🛠️ Installation & Déploiement

### 1. Google Sheets & Apps Script
Le script gère trois fonctions principales :
* `doPost(e)` : Réception des données du site.
* `genererPlanning()` : Création du tableau de distribution (Tri par Jour/Lieu).
* `sendConfirmationEmail(data)` : Envoi du mail via le quota Gmail.

**Déclencheur (Trigger) :**
* Fonction : `genererPlanning`
* Événement : `Lors d'un changement` (Permet de rafraîchir le planning si on supprime une ligne manuellement).

### 2. GitHub Pages
* Le site pointe vers l'URL du script Google (Web App URL) définie dans `index.html` (variable `scriptURL`).
* En cas de modification du Script Google, penser à **Redéployer** : *Gérer les déploiements > Nouvelle version*.

---

## ⚠️ Quotas et Limites

* **Emails :** Le système utilise un compte Gmail standard.
    * Limite : **100 emails/jour** (24h glissantes).
    * *Solution si dépassement :* Passer à un compte Google Workspace (~6€/mois) pour monter à 1500 emails/jour.
* **Concurrence :** Le script inclut un verrou (`LockService`) de 10 secondes pour gérer les commandes simultanées.

---

## 📞 Support

Pour toute question technique sur le code ou le déploiement :
**[Ton Nom / Ton Agence]**
