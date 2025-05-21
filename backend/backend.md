📘 Backend SpotHELP – Guide d’utilisation
1. Prérequis

    Node.js & npm installés (> v14)

    PostgreSQL installé (> v12)

    Avoir créé la base spothelp et la table lieux (cf. plus bas)

2. Installation

    Cloner le repo et se placer dans le dossier backend

git clone https://github.com/<tonUser>/SpotHELP.git
cd SpotHELP/backend

Installer les dépendances

npm install

Configurer les variables d’environnement
Créez un fichier .env à la racine de backend/ contenant :

PGHOST=localhost
PGUSER=postgres
PGDATABASE=spothelp
PGPASSWORD=0604
PGPORT=5432
PORT=3000

Ignorer .env
Vérifiez que .gitignore contient bien la ligne

    /backend/.env

3. Structure du code

backend/
├── db/
│   └── index.js      ← Configuration du pool PostgreSQL
├── routes/
│   └── lieux.js      ← Routes CRUD pour /lieux
├── server.js         ← Point d’entrée : Express + middleware
├── package.json      ← Dépendances & scripts
└── .env              ← Variables sensibles (non versionnées)

4. Mise en place de la base de données
4.1 Création de la base

Dans pgAdmin ou psql :

CREATE DATABASE spothelp OWNER postgres;

4.2 Création de la table lieux

CREATE TABLE lieux (
  id SERIAL PRIMARY KEY,
  nom TEXT     NOT NULL,
  type TEXT    NOT NULL,
  adresse TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);

5. Démarrage du serveur

Dans backend/ :

node server.js

Le serveur écoute par défaut sur http://localhost:3000
6. Endpoints disponibles
Méthode	URL	Description	Exemple curl (Windows cmd)
GET	/lieux	Liste tous les lieux	curl http://localhost:3000/lieux
POST	/lieux	Crée un nouveau lieu	curl -X POST http://localhost:3000/lieux -H "Content-Type: application/json" -d "{\"nom\":\"Restos\",\"type\":\"nourriture\",\"adresse\":\"10 rue\",\"lat\":48.85,\"lng\":2.35}"
PUT	/lieux/:id	Met à jour un lieu existant	curl -X PUT http://localhost:3000/lieux/1 -H "Content-Type: application/json" -d "{\"nom\":\"Restos MAJ\",\"type\":\"nourriture\",\"adresse\":\"12 rue\",\"lat\":48.85,\"lng\":2.35}"
DELETE	/lieux/:id	Supprime un lieu	curl -X DELETE http://localhost:3000/lieux/1
7. Tests manuels

    GET vide → devrait renvoyer []

    POST un nouveau lieu → renvoie l’objet créé (avec son id)

    GET → le lieu apparaît dans la liste

    PUT pour modifier id=1 → renvoie l’objet mis à jour

    GET → vérifie la mise à jour

    DELETE id=1 → renvoie confirmation et supprime

    GET → liste à nouveau vide

8. Prochaine étape

    Intégration frontend (Leaflet) : consommer /lieux pour afficher la carte.

    Ajout d’authentification et routes signalement (Release 2).

    Mise en place de tests automatiques et d’un pipeline CI.