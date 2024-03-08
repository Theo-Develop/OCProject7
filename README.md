# Mon Vieux Grimoire - Backend
Ce dépôt contient le backend de l'application Mon Vieux Grimoire : un site web de référencement et de notation de livres.

## Prérequis
Avant d'installer et d'exécuter ce projet, assurez-vous d'avoir installé :

Node.js (version v21.1.0)
npm (version 10.2.0)

## Installation
Suivez les étapes ci-dessous pour installer et configurer le projet localement :

Clonez ce dépôt sur votre machine :
git clone https://github.com/evafmh/P7-mon-vieux-grimoire-backend.git

Accédez au répertoire du projet :
cd P7-mon-vieux-grimoire-backend

Installez les dépendances nécessaires avec la commande suivante :
npm install

## Configuration de la Base de Données
Avant de lancer le projet, assurez-vous d'avoir configuré votre base de données MongoDB. Vous pouvez suivre les étapes suivantes :

Accédez au site web de MongoDB https://www.mongodb.com/cloud/atlas/register et inscrivez-vous pour obtenir un compte.

Une fois que vous avez accès à votre tableau de bord, créez un cluster et configurez-le selon vos besoins.

Récupérez votre code URI sur MongoDB et ajoutez-le dans un fichier .env.local que vous créez à la racine du projet. Configurez les variables d'environnement suivantes (variables listées dans le fichier .env):

DB_HOST=PORT_BackEnd
DB_URL=URL_de_connexion_à_MongoDB
SECRET_TOKEN=Votre_clé_secrète_pour_les_tokens_JWT
Remplacez PORT_BackEnd par le port local sur lequel votre backend sera connecté (par défaut : 4000).
Remplacez URL_de_connexion_à_MongoDB par l'URL de connexion à votre base de données MongoDB, sous le format mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority.
Remplacez Votre_clé_secrète_pour_les_tokens_JWT par une clé secrète de votre choix pour les tokens JWT.