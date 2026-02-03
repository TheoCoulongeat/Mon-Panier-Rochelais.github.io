import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ShoppingBasket, Plus, Minus, Check, Loader } from 'lucide-react';
import Papa from 'papaparse';

// ============================================================================
// 🔗 URL DU FICHIER CSV sur GitHub (raw)
// Remplacez par votre URL une fois le repo créé :
// https://raw.githubusercontent.com/VOTRE_PSEUDO/VOTRE_REPO/main/composition.csv
// ============================================================================
const CSV_URL = 'https://raw.githubusercontent.com/TheoCoulongeat/Mon-Panier-Rochelais.github.io/refs/heads/main/composition.csv';

// ============================================================================
// 🖼️  IMAGE DU LOGO/HEADER
// Remplacez par l'URL de votre image une fois uploadée sur GitHub :
// https://raw.githubusercontent.com/VOTRE_PSEUDO/VOTRE_REPO/main/logo.jpg
// ============================================================================
const LOGO_URL = 'https://github.com/TheoCoulongeat/Mon-Panier-Rochelais.github.io/blob/main/Logo.png?raw=true';

// ============================================================================
// ⚙️  CONFIGURATION STATIQUE (ne change pas souvent)
// ============================================================================
const WEEKLY_CONFIG = {
  panierPrice: 31.90,

  extras: [
    { id: 1, name: "Œufs (x6)",        price: 3.50 },
    { id: 2, name: "Miel (250g)",       price: 6.00 },
    { id: 3, name: "Confiture (pot)",   price: 5.50 },
    { id: 4, name: "Pain bio",          price: 4.20 },
    { id: 5, name: "Fromage de chèvre", price: 7.80 }
  ],

  pickupDays: [
    {
      id: 'mercredi', label: 'Mercredi', deadline: '2026-02-04T12:00',
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
      id: 'jeudi', label: 'Jeudi', deadline: '2026-02-05T12:00',
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
      id: 'vendredi', label: 'Vendredi', deadline: '2026-02-06T12:00',
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
      id: 'samedi', label: 'Samedi', deadline: '2026-02-07T10:00',
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

// ============================================================================
// DONNÉES PAR DÉFAUT (utilisées si le CSV ne chargé pas — preview / fallback)
// ============================================================================
const COMPOSITION_FALLBACK = [
  { nom: "Épinard",   quantite: "500g" },
  { nom: "Pommes",    quantite: "1 kg" },
  { nom: "Carottes",  quantite: "800g" },
  { nom: "Poireaux",  quantite: "3 pièces" },
  { nom: "Oignons",   quantite: "500g" },
  { nom: "Salade",    quantite: "1 pièce" },
  { nom: "Butternut", quantite: "1 pièce" }
];

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================
export default function MonPanierRochelais() {
  // ── État global ────────────────────────────────────────────────
  const [composition, setComposition]     = useState([]);
  const [csvLoading, setCsvLoading]       = useState(true);
  const [csvError,   setCsvError]         = useState(false);
  const [showComposition, setShowComposition] = useState(false);
  const [selectedDay, setSelectedDay]     = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '',
    location: '', basketCount: 1,
    replacement: '', extras: {}, comment: ''
  });

  // ── Récupération du CSV depuis GitHub ──────────────────────────
  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // Nettoyer les headers (trim des espaces)
          const cleaned = results.data.map(row => ({
            nom:      (row['nom'] || row['Nom'] || '').trim(),
            quantite: (row['quantite'] || row['Quantité'] || row['quantité'] || '').trim()
          })).filter(r => r.nom !== '');

          setComposition(cleaned);
          setCsvLoading(false);
        } else {
          // Pas de données valides → on use le fallback
          setComposition(COMPOSITION_FALLBACK);
          setCsvLoading(false);
          setCsvError(true);
        }
      },
      error: () => {
        // Erreur réseau / URL invalide → fallback
        setComposition(COMPOSITION_FALLBACK);
        setCsvLoading(false);
        setCsvError(true);
      }
    });
  }, []);

  // ── Helpers ────────────────────────────────────────────────────
  const isDayAvailable = (deadline) => new Date() < new Date(deadline);

  const calculateTotal = () => {
    let total = WEEKLY_CONFIG.panierPrice * formData.basketCount;
    Object.entries(formData.extras).forEach(([id, qty]) => {
      if (qty > 0) {
        const extra = WEEKLY_CONFIG.extras.find(e => e.id === parseInt(id));
        if (extra) total += extra.price * qty;
      }
    });
    return total.toFixed(2);
  };

  const updateExtraQty = (id, delta) => {
    setFormData(prev => ({
      ...prev,
      extras: { ...prev.extras, [id]: Math.max(0, (prev.extras[id] || 0) + delta) }
    }));
  };

  // ── Soumission ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.location) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const orderData = {
      date: new Date().toLocaleString('fr-FR'),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      pickupDay: WEEKLY_CONFIG.pickupDays.find(d => d.id === selectedDay)?.label,
      location: formData.location,
      basketCount: formData.basketCount,
      extras: Object.entries(formData.extras)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => `${WEEKLY_CONFIG.extras.find(e => e.id === parseInt(id))?.name} x${qty}`)
        .join(', '),
      total: calculateTotal(),
      replacement: formData.replacement,
      comment: formData.comment
    };
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgzJlHyAP1vg8iwzV1W_doPPqNlPhCnDPldU181H5btayBObGQgcABa3xok17MLSMnpw/exec';
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      setOrderConfirmed(true);
    } catch (err) {
      console.error(err);
      setOrderConfirmed(true);
    }
  };

  // ── ÉCRAN DE CONFIRMATION ──────────────────────────────────────
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#0B2822] text-[#F5F1E8] p-4">
        <div className="max-w-md mx-auto pt-20 text-center">
          <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Commande enregistrée !</h2>
          <p className="mb-6">
            En raison d'un grand nombre d'envois, les mails de confirmation ne partent plus systématiquement.
            <strong className="block mt-2">Faites une capture d'écran de cette page.</strong>
          </p>
          <div className="bg-[#1a3d36] p-6 rounded-lg mb-6 text-left space-y-2">
            <p><strong>Retrait :</strong> {WEEKLY_CONFIG.pickupDays.find(d => d.id === selectedDay)?.label}</p>
            <p><strong>Lieu :</strong> {formData.location}</p>
            <p><strong>Paniers :</strong> {formData.basketCount}</p>
            {formData.replacement && <p><strong>Remplacement :</strong> {formData.replacement} → Pommes de terre</p>}
            <p><strong>Total :</strong> {calculateTotal()} €</p>
          </div>
          <p className="text-sm text-[#F5F1E8]/70 mb-4">
            Paiement au retrait : Espèce et chèque (privilégier → 0 frais bancaires), CB accepté
          </p>
          <button onClick={() => window.location.reload()} className="bg-[#F5F1E8] text-[#0B2822] px-6 py-3 rounded-lg font-semibold hover:bg-[#e5e1d8] transition-colors">
            Nouvelle commande
          </button>
        </div>
      </div>
    );
  }

  // ── ÉCRAN PRINCIPAL ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B2822] text-[#F5F1E8] pb-20">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center bg-[#F5F1E8]">
          {LOGO_URL ? (
            <img src={LOGO_URL} alt="Mon Panier Rochelais" className="w-full h-full object-cover" />
          ) : (
            <ShoppingBasket className="w-12 h-12 text-[#0B2822]" />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">Mon Panier Rochelais</h1>
        <p className="text-[#F5F1E8]/80">Bienvenue sur l'espace de réservation</p>
      </div>

      <div className="max-w-md mx-auto px-4">

        {/* Composition de la semaine */}
        <div className="mb-6">
          <button
            onClick={() => setShowComposition(!showComposition)}
            className="w-full bg-[#1a3d36] p-4 rounded-lg flex items-center justify-between hover:bg-[#234d45] transition-colors"
          >
            <span className="font-semibold text-lg">🥬 Composition de la semaine</span>
            {showComposition ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showComposition && (
            <div className="bg-[#1a3d36] mt-2 p-4 rounded-lg">
              <p className="font-semibold mb-3">Panier à {WEEKLY_CONFIG.panierPrice} €</p>

              {/* Loading */}
              {csvLoading && (
                <div className="flex items-center justify-center py-4 text-[#F5F1E8]/60">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Chargement de la composition…
                </div>
              )}

              {/* Erreur CSV → on montre quand même le fallback */}
              {csvError && !csvLoading && (
                <p className="text-yellow-400 text-xs mb-3">
                  ⚠️ Impossible de charger le fichier CSV distant. Données par défaut utilisées.
                </p>
              )}

              {/* Liste des ingrédients */}
              {!csvLoading && (
                <ul className="space-y-2">
                  {composition.map((item, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#F5F1E8] rounded-full mr-3"></span>
                        <span>{item.nom}</span>
                      </div>
                      <span className="text-[#F5F1E8]/70 text-sm">{item.quantite}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Choix du jour de retrait */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">📅 Choisir le jour de retrait</h2>
          <p className="text-sm text-[#F5F1E8]/70 mb-4">Jour non affiché = complet</p>
          <div className="grid grid-cols-2 gap-3">
            {WEEKLY_CONFIG.pickupDays.map(day => {
              if (!isDayAvailable(day.deadline)) return null;
              return (
                <button
                  key={day.id}
                  onClick={() => { setSelectedDay(day.id); setFormData(p => ({...p, location: ''})); }}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    selectedDay === day.id
                      ? 'bg-[#F5F1E8] text-[#0B2822] scale-105 ring-4 ring-[#F5F1E8]/50'
                      : 'bg-[#1a3d36] hover:bg-[#234d45] border-2 border-transparent'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulaire */}
        {selectedDay && (
          <div className="space-y-6">
            {/* Infos personnelles */}
            <div className="bg-[#1a3d36] p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">👤 Vos informations</h3>
              {[
                { key: 'firstName', placeholder: 'Prénom *', type: 'text' },
                { key: 'lastName',  placeholder: 'Nom *',    type: 'text' },
                { key: 'phone',     placeholder: 'Téléphone *', type: 'tel' }
              ].map(f => (
                <input
                  key={f.key} type={f.type} placeholder={f.placeholder}
                  value={formData[f.key]}
                  onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                  className="w-full bg-[#0B2822] p-3 rounded border border-[#F5F1E8]/20 focus:border-[#F5F1E8]/50 outline-none"
                />
              ))}
            </div>

            {/* Point de retrait */}
            <div className="bg-[#1a3d36] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">📍 Point de retrait</h3>
              <select
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-[#0B2822] p-3 rounded border border-[#F5F1E8]/20 focus:border-[#F5F1E8]/50 outline-none"
              >
                <option value="">Sélectionner un lieu</option>
                {WEEKLY_CONFIG.pickupDays.find(d => d.id === selectedDay)?.locations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Nombre de paniers */}
            <div className="bg-[#1a3d36] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">🧺 Nombre de paniers</h3>
              <div className="flex gap-3">
                {[1, 2, 3].map(n => (
                  <button
                    key={n} type="button"
                    onClick={() => setFormData({...formData, basketCount: n})}
                    className={`flex-1 p-3 rounded font-semibold transition-all ${
                      formData.basketCount === n
                        ? 'bg-[#F5F1E8] text-[#0B2822] ring-4 ring-[#F5F1E8]/50'
                        : 'bg-[#0B2822] hover:bg-[#0f3229] border-2 border-transparent'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Remplacement — dépend de la composition chargée */}
            <div className="bg-[#1a3d36] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">🔄 Remplacement</h3>
              <p className="text-sm text-[#F5F1E8]/70 mb-3">
                Choisissez un produit à remplacer par des pommes de terre
              </p>
              <select
                value={formData.replacement}
                onChange={e => setFormData({...formData, replacement: e.target.value})}
                className="w-full bg-[#0B2822] p-3 rounded border border-[#F5F1E8]/20 focus:border-[#F5F1E8]/50 outline-none"
              >
                <option value="">Aucun remplacement</option>
                {composition.map((item, i) => (
                  <option key={i} value={item.nom}>{item.nom} → Pommes de terre</option>
                ))}
              </select>
            </div>

            {/* Extras */}
            <div className="bg-[#1a3d36] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">➕ Ventes complémentaires</h3>
              {WEEKLY_CONFIG.extras.map(extra => (
                <div key={extra.id} className="flex items-center justify-between mb-3 pb-3 border-b border-[#F5F1E8]/10 last:border-0 last:mb-0 last:pb-0">
                  <div>
                    <p className="font-medium">{extra.name}</p>
                    <p className="text-sm text-[#F5F1E8]/70">{extra.price.toFixed(2)} €</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateExtraQty(extra.id, -1)} className="bg-[#0B2822] p-2 rounded hover:bg-[#0f3229] transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{formData.extras[extra.id] || 0}</span>
                    <button type="button" onClick={() => updateExtraQty(extra.id, 1)} className="bg-[#0B2822] p-2 rounded hover:bg-[#0f3229] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Commentaire */}
            <div className="bg-[#1a3d36] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">💬 Commentaire (optionnel)</h3>
              <textarea
                placeholder="Informations supplémentaires..."
                value={formData.comment}
                onChange={e => setFormData({...formData, comment: e.target.value})}
                className="w-full bg-[#0B2822] p-3 rounded border border-[#F5F1E8]/20 focus:border-[#F5F1E8]/50 outline-none resize-none"
                rows="3"
              />
            </div>

            {/* Total + Validation */}
            <div className="bg-[#1a3d36] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">💰 Total estimé</span>
                <span className="text-2xl font-bold">{calculateTotal()} €</span>
              </div>
              <p className="text-sm text-[#F5F1E8]/70 mb-4">
                Paiement au retrait : Espèce et chèque (privilégier → 0 frais bancaires), CB accepté
              </p>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#F5F1E8] text-[#0B2822] py-4 rounded-lg font-bold text-lg hover:bg-[#e5e1d8] transition-colors"
              >
                Valider ma commande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
