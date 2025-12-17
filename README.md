# Faux-site-internet
Démonstration pour le 12 décembre

---

## Site de démonstration

Le fichier `index.html` a été ajouté. Pour lancer le site localement :

- Ouvrir [index.html](index.html) directement dans un navigateur.
- Ou lancer un serveur HTTP simple depuis la racine du projet :

```bash
python -m http.server 8000
# puis ouvrir http://localhost:8000/index.html
```

---
---

## Accès direct




- https://Thimerle.github.io/Faux-site-internet/

Note : le site imite le style d'un grand marketplace pour la présentation de produits, mais n'utilise aucune marque déposée ni contenu protégé.

## Fonctionnalités ajoutées

- Recherche et tri des produits.
- Fiches produit (modal), panier et suppression d'articles.
- Promotions et ventes flash : bannière avec compte à rebours et produits en promotion.
- Champ code promo dans le panier : exemples de codes valides `PROMO10` (10%) et `DEAL20` (20%).

## Backend local (optionnel)

J'ai ajouté un backend minimal Node.js dans le dossier `server/` :

- Endpoints : `GET /api/products`, `POST /api/register`, `POST /api/login`, `GET /api/me` (JWT).
- Stockage : fichier `server/db.json` (file-based, pas de base externe).

Pour lancer le backend localement :

```bash
cd server
npm install
npm start
# ensuite ouvrir http://localhost:3000/index.html
```

Attention : ce backend est une simulation pour développement local uniquement — ne pas l'utiliser en production tel quel (stockage en clair, secrets par défaut).

## Déploiement sur GitHub Pages

Pour publier la partie frontend (fichiers statiques à la racine) sur `gh-pages` :

```bash
# installer les dépendances (depuis la racine du repo)
npm install

# puis déployer (le package `gh-pages` est listé en devDependencies)
npm run deploy
```

L'URL de publication est configurée dans `package.json` racine (`homepage`). Mettez-la à jour si votre dépôt ou votre compte change.



