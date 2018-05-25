# Vélocation

Projet de réservation de vélo'v à Lyon, codé en JavaScript avec l'aide webpack.

APIs utilisées:
* Google Map
* Google StreetView
* JCDecaux

## Installation

Pour installer le projet suivez les instructions suivantes.

### Prérequis

Avoir npm et node installés.


[Voir ce lien](https://www.npmjs.com/get-npm) pour plus d'informations.
### Installation

Clonez le projet sur votre bureau

```
git clone git://github.com/didpoule/velocationgit
```

Installez les dépendances.

```
npm install
```

##

### Utiliser le serveur de développement

Pour utiliser le serveur de développement lancez la commande
```
npm run dev-server
```


### Déploiement

Pour héberger le projet sur un serveur, il faut le compiler au préalable.


```
npm run build
```

Ensuite copier le répertoire images

```
./assets/images
```

Dans le répertoire

```
./public/images
```

Envoyez sur le serveur uniquement le dossier
```
./public
```

Et le fichier

```
./index.html
```
## Auteur

* **Jordan Brito** [didpoule](https://github.com/didpoule)

## License

Ce projet est sous license MIT

