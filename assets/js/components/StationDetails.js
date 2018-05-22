import ComponentAPI from './ComponentAPI';
import Canvas from "./Canvas";
import Booking from "./Booking";
import Alert from "./Alert";
import $ from "jquery";

export default class StationDetails extends ComponentAPI {
    constructor(e, k, u, booking) {
        super(e, k, u);
        this.booking = null;
        this.marker = null;
        this.name = document.getElementById('station-name');
        this.picture = document.getElementById('station-picture');
        this.address = document.getElementById('station-address');
        this.status = document.getElementById('station-status');
        this.bikesFree = document.getElementById('station-bikesFree');
        this.bikesTotal = document.getElementById('station-bikesTotal');
        this.standsFree = document.getElementById('station-standsFree');
        this.button = document.getElementById('station-booking');
        this.validation = document.getElementById('booking-validation');
        this.canvas = new Canvas();
        this.alert = null;

        this.button.hide = () => {
            this.button.classList.remove('d-block');
            this.button.style.display = 'none';
        };

        this.button.show = () => {
            this.button.classList.add('d-block');
            this.button.style.display = 'block';
        };
        this.buttonEventToggle();
        this.booking = booking;

    }

    createAlert(type = "sign") {
        let params = {
            id: "station-alert",
            parent: this.e,
        };
        // Si canvas non rempli
        if (type === 'sign') {
            params.content = "Veuillez signer dans l'encadré pour valider votre réservation";
            params.classes = "alert alert-danger";
        }
        // Si plus de vélos
        else if (type === 'unavailable') {
            params.content = "Il n'y a plus de vélos disponibles à cette station. Veuillez en choisir une autre";
            params.classes = "alert alert-warning";
        }
        // Si déja une réservation
        else if (type === 'change') {
            params.content = "Vous avez déjà une reservation en cours. En validant celle-ci, la précédente sera remplacée";
            params.classes = "alert alert-info";
        }
        // Récupération de l'instance Alerte ou création
        if (this.alert === null) {
            this.alert = new Alert(params);
        } else {
            this.alert.updateParams(params.content, params.classes);
        }
        return this.alert;
    }

    // Ajout des évènements boutons
    buttonEventToggle() {
        // Bouton réserver
        this.button.addEventListener('click', () => {
            // On reset les alertes
            this.removeAlert();
            // Si vélo disponible
            if (this.marker.available_bikes !== 0 && this.marker.status !== 'Fermée') {
                this.canvas.show();
                this.button.hide();
                $('html,body').animate({
                    scrollTop: $(this.e).offset().top
                }, 'slow');
                // Vérification si réservation en cours
                if (this.booking.storage != null) {
                    if (this.booking.storage.stationId != null) {
                        this.createAlert('change').render();
                    }
                }
            } else {
                // Si pas de vélo
                this.createAlert('unavailable').render();
            }

        });
        // Bouton valider réservation
        this.validation.addEventListener('click', () => {
            // Vérification disponiblité vélo
            if (this.marker.available_bikes !== 0 && this.marker.status !== 'Fermée') {
                // Vérification si signature présente
                if (this.canvas.isCanvasBlank()) {
                    // Alrte si canvas vide
                    this.createAlert().render();
                } else {
                    // Sauvegarde de la réservation
                    this.booking.setDatas({
                        id: this.marker.id,
                        name: this.marker.name,
                        address: this.marker.address
                    });
                    this.booking.init();

                    // Mise à jour affichage
                    this.canvas.hide();
                    this.button.show();
                    this.removeAlert();

                    $('html,body').animate({
                        scrollTop: $(this.booking.e).offset().top
                    }, 'slow');
                }
            } else {
                // Si pas de vélo
                this.createAlert('unavailable').render();
            }
        })

    }

    // Récupération des donnés de la station
    updateValues(marker) {
        this.marker = marker;
    }

    render() {
        this.name.innerHTML = this.marker.name;
        this.picture.src = this.u[0] + this.marker.getPosition().lat() + "," + this.marker.getPosition().lng() + this.u[1] + this.k;
        this.picture.alt = this.marker.name;
        this.address.innerHTML = this.marker.address;
        this.status.innerHTML = this.marker.status;

        // Colorisation du statut
        if (this.status.innerHTML === 'Ouverte') {
            this.status.classList.add('text-success');
            this.status.classList.remove('text-danger');
        } else {
            this.status.classList.remove('text-success');
            this.status.classList.add('text-danger');
        }

        this.bikesFree.innerHTML = this.marker.available_bikes;
        this.bikesTotal.innerHTML = this.marker.bike_stands;
        this.standsFree.innerHTML = this.marker.available_bike_stands;
        this.canvas.hide();
        this.e.show();
        this.button.show();
        // Style boutton

        if (this.marker.available_bikes === 0 || this.marker.available_bikes === 'Fermée') {
            this.createAlert('unavailable').render();
            this.button.classList.add('btn-secondary');
            this.button.classList.remove('btn-primary');
        } else {
            this.createAlert('unavailable').remove();
            this.button.classList.remove('btn-secondary');
            this.button.classList.add('btn-primary');
        }
    }

    removeAlert() {
        if (this.alert !== null) {
            this.alert.remove();
        }
    }
}