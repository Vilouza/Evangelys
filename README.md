# Evangelys

Site vitrine d'Evangelys (evangelys.fr) : Vierges de Lourdes, Vierges Miraculeuses, Sainte Famille, crèche de Noël, ex-voto Cœur Sacré et colombes murales.

Site statique publié avec GitHub Pages.

- `index.html` : la page, avec la liste des modèles, couleurs, tailles et prix dans le script en bas (`MODELS`, `STD`).
- `STRIPE` (en haut du script de `catalog.js`) : lien de paiement de chaque modèle. Vide = le bouton mène au formulaire de commande par e-mail. L'ex-voto (15 cm, 12 €) et le lot de colombes (14 €) n'ont pas encore de lien : à coller dans `exvoto` et `colombes`.
- `cut/` : photos des modèles. Les statues détourées sont en 900 × 1200, fond transparent. Les photos d'ambiance (crèche, ex-voto, colombes) gardent leur cadre.
- `partage.jpg` : image d'aperçu quand le lien est partagé sur les réseaux.
- `CNAME` : relie le site au domaine evangelys.fr.

Pages produit (HTML statique, un dossier par fiche) :

- `creche-de-noel-9-pieces/`
- `statue-notre-dame-de-lourdes/`
- `statue-vierge-miraculeuse/`
- `statue-sainte-famille/`
- `ex-voto-coeur-sacre/`
- `lot-de-3-colombes-murales/`

`catalog.js` : liste des modèles, couleurs, tailles, prix et liens Stripe, et le script qui enrichit les fiches (couleur, taille, lots). `site.css` : styles partagés.
