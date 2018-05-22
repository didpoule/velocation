export default class Alert {
    constructor(params) {
        this.element = null;
        this.content = params.content;
        this.id = params.id;
        this.classes = params.classes;
        this.parent = params.parent;
        this.position = params.position;

        this.createAlert();
    }

    // Initialisation du DOMElement
    createAlert() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.className = this.classes;
        this.element.setAttribute('role', 'alert');
        this.element.setAttribute('data-dismiss', 'alert');
        this.contentPlug();


    }
    // Ajout des icones en fonction du type d'alerte
    contentPlug() {
        if (this.element.classList.contains('alert-danger')) {
            this.element.innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i> " + this.content;

        } else if (this.element.classList.contains('alert-warning')) {
            this.element.innerHTML = "<i class=\"fas fa-exclamation\"></i> " + this.content;

        } else if (this.element.classList.contains('alert-info')) {
            this.element.innerHTML = "<i class=\"fas fa-info\"></i> " + this.content;

        } else if (this.element.classList.contains('alert-success')) {
            this.element.innerHTML = "<i class=\"fas fa-check\"></i> " + this.content;
        }
        this.element.innerHTML += '.';
    }

    // Affichage de l'alerte
    render() {
        // On enlève l'élément pour ne pas le dupliquer
        this.remove();

        // Ajout dans le DOM en fonction du paramètre de position voulue
        if (this.position === "before") {
            this.parent.prepend(this.element);
        } else {
            this.parent.appendChild(this.element);
        }
    }

    // Mise à jour du message
    updateParams(content, classes) {
        this.content = content;
        this.classes = classes;

        this.element.className = this.classes;
        this.contentPlug();

    }

    // Contrôle si l'élement est déjà dans le DOM
    isDisplayed() {
        return document.getElementById(this.id) != null;
    }

    // Enlève l'élément
    remove() {
        if (this.isDisplayed()) {
            this.parent.removeChild(this.element);
        }
    }
}