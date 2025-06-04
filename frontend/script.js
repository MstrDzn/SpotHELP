// frontend/script.js

// 1. Initialisation de la carte Leaflet
const map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

// 2. Objet pour stocker tous les marqueurs par type
//    Clé = type (ex : "nourriture"), Valeur = tableau de L.marker
const markersByType = {};

// 3. Fonction pour charger tous les lieux depuis le backend et créer les marqueurs
function loadMarkers() {
  fetch('http://localhost:3000/lieux')
    .then((response) => response.json())
    .then((data) => {
      // 3.1. Si on réappelle loadMarkers, on enlève d'abord les anciens marqueurs
      for (let t in markersByType) {
        markersByType[t].forEach((m) => {
          map.removeLayer(m);
        });
      }
      // Réinitialiser l’objet markersByType
      Object.keys(markersByType).forEach((key) => delete markersByType[key]);

      // 3.2. Pour chaque lieu renvoyé par le backend, on crée et stocke un marqueur
      data.forEach((lieu) => {
        const { nom, type, adresse, lat, lng } = lieu;

        // Créer le marqueur à [lat, lng]
        const m = L.marker([lat, lng]);

        // Lier un popup avec les infos complètes
        m.bindPopup(`
          <div style="min-width:180px">
            <strong>${nom}</strong><br>
            <em>Type&nbsp;:</em> ${type}<br>
            <em>Adresse&nbsp;:</em> ${adresse}
          </div>
        `);

        // Ajouter ce marqueur dans le tableau de son type
        if (!markersByType[type]) {
          markersByType[type] = [];
        }
        markersByType[type].push(m);
      });

      // 3.3. Après avoir construit markersByType, afficher ceux cochés
      applyFilters();
    })
    .catch((err) => {
      console.error('Erreur lors du chargement des marqueurs :', err);
    });
}

// 4. Fonction pour afficher/masquer les marqueurs selon les cases cochées
function applyFilters() {
  // 4.1. Récupérer toutes les checkboxes
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  // 4.2. Construire un tableau des types autorisés
  const allowedTypes = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  // 4.3. Pour chaque type dans markersByType, on affiche ou masque les marqueurs
  for (let type in markersByType) {
    const arrayMarkers = markersByType[type];
    arrayMarkers.forEach((marker) => {
      if (allowedTypes.includes(type)) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  }
}

// 5. Au chargement du DOM : lier les events et charger les marqueurs
document.addEventListener('DOMContentLoaded', () => {
  // 5.1. Ajouter un listener "change" sur chaque checkbox pour ré-appliquer les filtres
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      applyFilters();
    });
  });

  // 5.2. Charger tous les marqueurs depuis le backend
  loadMarkers();
});
