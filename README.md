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

Ce site est une démonstration volontairement défaillante (le bouton de paiement affiche une erreur).

---

## Accès direct via URL

J'ai ajouté un workflow GitHub Actions qui publie le contenu du dépôt sur la branche `gh-pages` à chaque `push` sur `main`. Une fois le premier déploiement terminé, le site sera accessible directement à l'URL suivante :

- https://Thimerle.github.io/Faux-site-internet/

Remarques :

- Le déploiement démarre automatiquement après chaque `push` sur `main`. Vous pouvez voir l'état dans l'onglet "Actions" du dépôt.
- Si l'URL ne fonctionne pas immédiatement, attendez une minute puis rechargez — GitHub Pages met parfois quelques instants pour activer le site.
- Si vous préférez ne pas utiliser Actions, vous pouvez activer GitHub Pages manuellement depuis les réglages du dépôt (Pages -> Source -> `gh-pages` branche ou `main`/root).

