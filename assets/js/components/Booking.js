import Component from '../Component';
import StorageManager from './StorageManager'
import Alert from './Alert';
import $ from 'jquery';

export default class Booking extends Component {
    constructor(e, datas = null) {
        super(e);
        this.storage = null;
        this.bookingDetails = document.getElementById('booking-details');
        this.bookingName = document.getElementById('booking-name');
        this.bookingAddress = document.getElementById('booking-address');
        this.bookingTime = document.getElementById('booking-time');
        this.bookingEnd = document.getElementById('booking-end');
        this.bookingDefault = document.getElementById('booking-default');
        this.alert = null;
        this.datas = datas;
    }

    // Création de l'instance pour stockage
    init() {
        if (this.storage === null) {
            this.storage = new StorageManager(this.datas, this);
        }



        // On vérifie si la page a été raffraichie
        if (this.datas === null) {
            this.storage.retrieve();

            // Si on récupère les données, on initialise le timer et on met a jour l'affichage
            if (this.storage.stationId != null) {
                this.storage.save();
                this.storage.setTimer();
                this.render();
            }

            // Si réservation par bouton station
        } else {
            this.storage.init();
        }

    }

    setDatas(datas) {
        this.datas = datas;
        this.storage.datas = this.storage.datas = this.datas;
    }

    // Affichage temps restant dynamique
    updateDisplayTime() {
        // Formatage du temps restant pour affichage
        this.bookingTime.innerHTML = timeConversion(this.storage.remaining);
    }

    // Gestion messages
    createAlert(type = "success") {
        let params = {
            id: "booking-alert",
            parent: document.getElementById('booking-container'),
            position: 'before'
        };
        // Si succès réservation
        if (type === "success") {
            params.content = "Votre réservation a bien été prise en compte";
            params.classes = "alert alert-success";
        }
        // Si réservation expirée
        else if (type === "expired") {
            params.content = "Votre réservation a expirée.";
            params.classes = "alert alert-info";
        }
        // Récupération de l'instance Alert ou création
        if (this.alert === null) {
            this.alert = new Alert(params);
        } else {
            this.alert.updateParams(params.content, params.classes);
        }

        return this.alert;

    }

    // Affichage détails réservation
    render(type) {
        if (this.storage.stationId !== null && this.storage.stationName !== null
            && this.storage.stationPlace !== null &&
            this.storage.remaining > 0) {
            this.bookingDefault.hide();
            this.bookingEnd.hide();

            this.bookingName.innerHTML = this.storage.stationName;
            this.bookingAddress.innerHTML = this.storage.stationPlace;
            this.bookingDetails.show();

        } else {

            this.bookingDefault.hide();
            this.bookingEnd.show();
            this.bookingDetails.hide();
        }
        // Affichage du message en fonction du statut de la réservation
        this.createAlert(type).render();
    }
}