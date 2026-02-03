// ============================================================================
// 📝 FICHIER DE CONFIGURATION HEBDOMADAIRE
// ============================================================================
// C'est ICI que vous modifiez chaque semaine :
//   • La composition du panier (nom + quantité)
//   • Le prix du panier
//   • Les extras disponibles
//   • Les dates/heures de retrait et les points de retrait
// ============================================================================

export const WEEKLY_CONFIG = {
  // ---------------------------------------------------------------
  // 💰 Prix du panier standard
  // ---------------------------------------------------------------
  panierPrice: 31.90,

  // ---------------------------------------------------------------
  // 🥬 Composition du panier de la semaine
  // Format : { name: "Nom du produit", quantity: "Quantité" }
  // ---------------------------------------------------------------
  composition: [
    { name: "Épinard",   quantity: "500g" },
    { name: "Pommes",    quantity: "1 kg" },
    { name: "Carottes",  quantity: "800g" },
    { name: "Poireaux",  quantity: "3 pièces" },
    { name: "Oignons",   quantity: "500g" },
    { name: "Salade",    quantity: "1 pièce" },
    { name: "Butternut", quantity: "1 pièce" }
  ],

  // ---------------------------------------------------------------
  // ➕ Produits complémentaires (extras)
  // Format : { id: (unique), name: "Nom", price: prix en euros }
  // ---------------------------------------------------------------
  extras: [
    { id: 1, name: "Œufs (x6)",          price: 3.50 },
    { id: 2, name: "Miel (250g)",         price: 6.00 },
    { id: 3, name: "Confiture (pot)",     price: 5.50 },
    { id: 4, name: "Pain bio",            price: 4.20 },
    { id: 5, name: "Fromage de chèvre",   price: 7.80 }
  ],

  // ---------------------------------------------------------------
  // 📅 Jours de retrait
  // • deadline : date + heure limite de commande (format ISO)
  //     Exemple : '2026-02-04T12:00' = Mercredi 4 février à 12h00
  //     ⚠️  À METTRE À JOUR CHAQUE SEMAINE (ajoutez 7 jours)
  // • locations : liste des points de retrait disponibles ce jour-là
  // ---------------------------------------------------------------
  pickupDays: [
    {
      id: 'mercredi',
      label: 'Mercredi',
      deadline: '2026-02-04T12:00',
      locations: [
        '12h00 — Parking de la salle L\'Agora (proche médiathèque Saint-Xandre)',
        '12h45 — Parking école Jean de La Fontaine, rue du Chemin Bas, Marsilly',
        '13h15 — Centre bourg, 17 rue Léonce Vieljeux, Nieul-sur-Mer',
        '13h45 — Parking espace Saint-Exupéry, L\'Houmeau',
        '16h30 — Parking du Belvédère, Île de Ré',
        '17h10 — Parking collège de Beauregard, Sautel',
        '17h45 — Esplanade des parcs, La Rochelle (près salle de basket)',
        '18h30 — Parking face à Palmilud, Périgny (école maternelle)',
        '19h00 — Parking face à la pharmacie, proche Intermarché, Villeneuve',
        '19h30 — Parking salle Giraudeau, Mireuil'
      ]
    },
    {
      id: 'jeudi',
      label: 'Jeudi',
      deadline: '2026-02-05T12:00',
      locations: [
        '12h00 — Parking du bowling des Minimes',
        '12h30 — Parking du SUAPSE, face Carrefour Market, Tasdon/Aytré',
        '15h30 — Gymnase municipal, rue Pierre de Coubertin, Dompierre-sur-Mer',
        '16h00 — Salle des fêtes, 1 rue de l\'Aunis, Sainte-Soulle',
        '16h30 — Place de la mairie, La Jarrie',
        '17h00 — Parking de la mairie, La Jarne',
        '17h30 — Centre municipal de rencontre, Saint-Rogatien',
        '18h00 — Salle polyvalente Jean Fillipi, Puilboreau'
      ]
    },
    {
      id: 'vendredi',
      label: 'Vendredi',
      deadline: '2026-02-06T12:00',
      locations: [
        '12h00 — Salle polyvalente, Lagord',
        '12h30 — Ruines de l\'église, Laleu',
        '13h00 — Face au stade Rochelais, Port Neuf (place de l\'Île de France)',
        '13h35 — Parc municipal, Salles-sur-Mer',
        '14h30 — Fond de l\'impasse rue de la Marne (près du commissariat) La Rochelle',
        '16h45 - 17h20 — École de Villedoux',
        '18h00 — Salle polyvalente, Saint-Vivien',
        '18h30 — Parking du stade, Châtelaillon-Plage',
        '19h15 — Entrée du parking, avenue Marie-François Sadi Carnot, Rochefort'
      ]
    },
    {
      id: 'samedi',
      label: 'Samedi',
      deadline: '2026-02-07T10:00',
      locations: [
        '12h00 — Face à l\'école Marie Eustelle, Marans',
        '12h30 — Parking face à l\'église, Andilly',
        '13h00 — Face à la mairie, Vérines',
        '13h30 — Parking de la mairie, Saint-Sauveur-d\'Aunis',
        '14h10 — Parking du collège, Aigrefeuille-d\'Aunis',
        '14h45 — Monument aux morts, Surgères',
        '15h40 — Salles municipales de Lafond, 48 avenue Antoine de Saint-Exupéry, La Rochelle'
      ]
    }
  ]
};
