# Backend SpotHELP – Guide d’utilisation

## 1. Prérequis

* **Node.js & npm** installés (> v14)
* **PostgreSQL** installé (> v12)
* Avoir créé la base `spothelp` et la table `lieux` (cf. plus bas)

---

## 2. Installation

1. **Cloner le repo** et se placer dans le dossier backend

   ```bash
   git clone https://github.com/<tonUser>/SpotHELP.git
   cd SpotHELP/backend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d’environnement**
   Créez un fichier `.env` à la racine de `backend/` contenant :

   ```env
   PGHOST=localhost
   PGUSER=postgres
   PGDATABASE=spothelp
   PGPASSWORD=0604
   PGPORT=5432
   PORT=3000
   ```

4. **Ignorer `.env`**
   Vérifiez que `.gitignore` contient bien :

   ```
   /backend/.env
   ```

---

## 3. Structure du code

```
backend/
├── db/
│   └── index.js      ← Configuration du pool PostgreSQL
├── routes/
│   └── lieux.js      ← Routes CRUD pour /lieux
├── server.js         ← Point d’entrée : Express + middleware
├── package.json      ← Dépendances & scripts
└── .env              ← Variables sensibles (non versionnées)
```

---

## 4. Mise en place de la base de données

### 4.1 Création de la base

Dans pgAdmin ou `psql` :

```sql
CREATE DATABASE spothelp OWNER postgres;
```

### 4.2 Création de la table `lieux`

```sql
CREATE TABLE lieux (
  id SERIAL PRIMARY KEY,
  nom TEXT     NOT NULL,
  type TEXT    NOT NULL,
  adresse TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);
```

---

## 5. Démarrage du serveur

Dans `backend/` :

```bash
node server.js
```

Le serveur écoute par défaut sur **[http://localhost:3000](http://localhost:3000)**

---

## 6. Endpoints disponibles

| Méthode    | URL          | Description                 | Exemple `curl` (Windows cmd)                                                                                                                                                |
| ---------- | ------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**    | `/lieux`     | Liste tous les lieux        | `curl http://localhost:3000/lieux`                                                                                                                                          |
| **POST**   | `/lieux`     | Crée un nouveau lieu        | `curl -X POST http://localhost:3000/lieux -H "Content-Type: application/json" -d '{"nom":"Restos du Coeur","type":"nourriture","adresse":"10 rue","lat":48.85,"lng":2.35}'` |
| **PUT**    | `/lieux/:id` | Met à jour un lieu existant | `curl -X PUT http://localhost:3000/lieux/1 -H "Content-Type: application/json" -d '{"nom":"Restos MAJ","type":"nourriture","adresse":"12 rue","lat":48.85,"lng":2.35}'`     |
| **DELETE** | `/lieux/:id` | Supprime un lieu            | `curl -X DELETE http://localhost:3000/lieux/1`                                                                                                                              |

---

## 7. Tests manuels

1. **GET vide** → doit renvoyer `[]`
2. **POST** un nouveau lieu → renvoie l’objet créé (avec son `id`)
3. **GET** → le lieu apparaît dans la liste
4. **PUT** pour modifier `id=1` → renvoie l’objet mis à jour
5. **GET** → vérifie la mise à jour
6. **DELETE** `id=1` → renvoie confirmation et supprime
7. **GET** → liste à nouveau vide

---

## 8. Prochaines étapes

* **Intégration frontend** (Leaflet) : consommer `/lieux` pour afficher la carte.
* **Ajout d’authentification** et **routes signalement** (Release 2).
* **Mise en place de tests automatiques** et d’un pipeline CI.
