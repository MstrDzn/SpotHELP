# Manuel de déploiement de SpotHELP

Ce document explique comment mettre en place l'application **SpotHELP** sur un poste de développement ou un petit serveur.

## 1. Prérequis généraux

- **Git** pour cloner le dépôt
- **Node.js** et **npm** (>= 14)
- **Docker** et **Docker Compose** (facultatif mais recommandé pour la base de données)

## 2. Récupération du code

```bash
git clone https://github.com/MstrDzn/SpotHELP
cd SpotHELP
```

## 3. Mise en place de la base de données

### Avec Docker Compose (recommandé)

Lancer uniquement le service PostgreSQL défini dans `docker-compose.yml` :

```bash
docker-compose up -d db
```

Le conteneur expose PostgreSQL sur `localhost:5432` avec l'utilisateur `postgres` et le mot de passe `0604`. Lors du premier lancement, le script SQL présent dans `backend/db/init` crée la table `lieux` automatiquement.

### Sans Docker

1. Installez PostgreSQL localement.
2. Créez la base :

```sql
CREATE DATABASE spothelp OWNER postgres;
```

3. Exécutez le fichier `backend/db/init/01-create-lieux.sql` pour créer la table.

## 4. Configuration du backend

Dans `backend/`, copiez le fichier `.env` suivant et adaptez‑le si besoin :

```env
PGHOST=localhost
PGUSER=postgres
PGDATABASE=spothelp
PGPASSWORD=0604
PGPORT=5432
PORT=3000
```

Installez ensuite les dépendances :

```bash
cd backend
npm install
```

Lancez le serveur :

```bash
npm start
```

L'API est alors disponible sur `http://localhost:3000`.

## 5. Lancement du frontend

Le frontend se compose de fichiers statiques situés dans `frontend/`. Ouvrez directement `index.html` dans un navigateur ou servez le dossier via un serveur HTTP léger :

```bash
npx http-server frontend
```

La carte interactive sera accessible sur `http://localhost:8080` (port par défaut d'`http-server`).

## 6. Déploiement en production léger

Pour un petit serveur (VPS, VM), les étapes sont similaires :

1. Installer Node.js, npm et Docker.
2. Cloner le dépôt sur le serveur.
3. Lancer `docker-compose up -d db` pour la base de données.
4. Installer les dépendances du backend et démarrer le serveur avec `npm start` (ou via un gestionnaire de processus comme PM2).
5. Servir les fichiers du dossier `frontend/` via Nginx ou un autre serveur HTTP.
