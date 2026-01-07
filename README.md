# SAE 303 - Visualisation de Données : Données et Analyse ( D/A ).

Ce projet a pour objectif de visualiser les résultats d'une campagne de tests de solveurs SAT (problèmes de satisfaction de contraintes). L'application prend la forme d'un tableau de bord web interactif permettant d'analyser les performances, les temps de résolution et la fiabilité des différents algorithmes.

## 👥 Composition de l'équipe

* **Lucas Ternel** - MMI 2A1 & MMI 2WEB 

---

## 📊 Grandes lignes de la visualisation

L'application est structurée autour de 4 pages principales, offrant une navigation fluide via une barre latérale (Sidebar) responsive :

1.  **Tableau de Bord (Dashboard) :**
    * Affichage des **KPIs** (Indicateurs clés) : Nombre total de problèmes, taux de réussite global, meilleur solveur.
    * **Graphique en bâtons (Chart.js)** : Classement des solveurs par nombre de problèmes résolus.
    * **Graphique en beignet (Chart.js)** : Répartition globale des statuts (SAT, UNSAT, UNKNOWN, UNSUPPORTED).

2.  **Données Brutes :**
    * Tableau complet des résultats issus du fichier JSON.
    * **Système de filtres dynamiques** : Possibilité de croiser les données par *Solveur* ET par *Statut* (ex: Voir tous les échecs du solveur "Choco").
    * Codes couleurs (Badges) pour identifier rapidement l'état d'un problème.

3.  **Classement & Analyse (Solvers) :**
    * Tableau de leaderboard détaillé avec podium (🥇, 🥈, 🥉).
    * Calcul du **Temps Moyen sans échec** (moyenne calculée uniquement sur les réussites, métrique la plus pertinente pour la vitesse pure).
    * **Cactus Plot (D3.js)** : Graphique avancé montrant la progression du nombre d'instances résolues en fonction du temps cumulé.

4.  **Équipe :**
    * Page de présentation du membre du projet avec liens vers GitHub/Portfolio.

---

## 🛠️ Stack Technique

* **HTML5 / CSS3** : Basé sur le template *Material Dashboard 3* (adapté).
* **JavaScript (ES6)** : Logique de tri, filtrage et manipulation du DOM.
* **Chart.js** : Pour les graphiques statistiques standards (Bar, Doughnut).
* **D3.js** : Pour la visualisation avancée (Cactus Plot).
* **FontAwesome** : Pour les icônes.

---

## ⚠️ Problèmes rencontrés & Solutions

Durant le développement, plusieurs défis techniques ont été relevés :

### 1. Structure du fichier JSON (Export PHPMyAdmin)
* **Problème :** Le fichier `results.json` n'était pas un tableau plat d'objets, mais contenait des métadonnées (header, database info) aux index 0 et 1. Les données réelles étaient imbriquées dans `data[2].data`.
* **Solution :** Implémentation d'une vérification au chargement du `fetch` pour cibler automatiquement le bon nœud de données, tout en gardant une compatibilité si le format changeait pour devenir standard.

### 2. Gestion du statut "UNSUPPORTED"
* **Problème :** Certains jeux de données contenaient le statut "UNSUPPORTED" qui n'était pas prévu initialement, faussant les graphiques.
* **Solution :** Ajout explicite de ce statut dans la logique de comptage et attribution d'une couleur spécifique (Orange) dans les graphiques et le tableau de données brutes.

### 3. Menu Burger sur Mobile
* **Problème :** Le menu latéral ne s'ouvrait pas sur mobile car les scripts JS du template original étaient trop lourds ou incomplets.
* **Solution :** Développement d'un script léger `burger.js` dédié, qui gère l'ajout de la classe CSS `g-sidenav-pinned` et force l'animation CSS pour une ouverture fluide.

---

## 📸 Captures d'écran

### 1. Le Dashboard (Vue d'ensemble) + Chart.js
![Aperçu du Dashboard](assets/img/dashboard.png)
### 2. Le Classement des Solvers (D3.js)
![Aperçu du Classement des Solvers](assets/img/classement.png)
### 3. Le Cactus Plot (D3.js)
![Aperçu du Cactus Plot](assets/img/cactus_plot.png)
### 4. Données Brutes / Tri en fonction de leur status / solvers (JS)
![Aperçu des Données Brutes](assets/img/donnees.png)
## 5. Responsive / Menu Burger
![Aperçu du Responsive](assets/img/responsive.png)
## 6. Equipe
![Aperçu de l'équipe](assets/img/equipe.png)

---

## 🚀 Installation

Pour tester le projet localement (nécessaire pour charger le JSON via `fetch`) :

1.  Cloner le dépôt.
2.  Lancer un serveur local :
    * Avec VS Code : Utiliser l'extension **Live Server**
    * Avec Python : `python -m http.server 8000`
    * Avec Wamp/Xampp : Placer le dossier dans `www` ou `htdocs`.
3.  Sinon ouvir en direct sans lancer de serveur Local



