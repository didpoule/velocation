// Cette classe gère le stoackage de la réservation dans le Local Storage
export default class StorageManager {
    constructor(datas = {}, renderer) {
        this.stationId = null;
        this.stationName = null;
        this.stationPlace = null;
        this.duration = null;
        this.timer = null;
        this.remaining = null;
        this.decount = null;
        this.endTime = null;

        this.renderer = renderer;
        this.datas = datas;
        this.duration = null;

    }

    init() {
        this.setDatas();
        if (!this.isNull()) {
            this.save();
            this.setTimer();
        }
        this.renderer.render();
    }

    // Vérifie si toutes les données de réservation sont renseignées
    isNull() {
        return ((this.stationName === null) || (this.stationPlace === null) ||
            (this.stationId == null));
    }

    // Définit les données de réservation
    setDatas() {
        if (sessionStorage.name != null || sessionStorage.place != null || sessionStorage.id != null) {
            this.clear(false);
        }

        if (this.datas != null) {
            this.stationId = this.datas.id;
            this.stationName = this.datas.name;
            this.stationPlace = this.datas.address;
            this.duration = 1200000;
            this.endTime = Date.now() + this.duration;

        }
    }

    // Récupération des données dans le local storage
    retrieve() {
        this.datas = {
            name: null,
            address: null,
            id: null,
            endTime: null
        };
        if (sessionStorage.id != null) {
            this.datas.name = sessionStorage.name;
            this.datas.address = sessionStorage.place;
            this.datas.id = sessionStorage.id;
            this.duration = sessionStorage.expire - Date.now();

            this.stationId = this.datas.id;
            this.stationName = this.datas.name;
            this.stationPlace = this.datas.address;
            this.endTime = Date.now() + this.duration;
        }
    }

    // Stocke la réservation dans le localstorage
    save() {
        sessionStorage.setItem('id', this.stationId);
        sessionStorage.setItem('name', this.stationName);
        sessionStorage.setItem('place', this.stationPlace);
        sessionStorage.setItem('expire', this.endTime);

    }

    // Appel arret des timers et supression des données du lcaolstorage
    clear(render = true) {
        sessionStorage.clear();

        this.stopTimer();

        // Si on clear suite a une fin de réservation
        if (render) {
            this.renderer.render('expired');
        }
        this.stationId = null;
        this.stationName = null;
        this.stationPlace = null;
    }

    // Démarrage du timer de réservation
    setTimer() {

        // Temps restant
        this.remaining = this.duration;

        // Decompte dynamique
        this.decount = setInterval(() => {
            if ((this.remaining - 1000) > 0) {
                this.remaining -= 1000;
                this.renderer.updateDisplayTime();
            }

        }, 1000);

        // Timer réservation
        this.timer = setTimeout(() => {
            this.clear();
        }, this.duration);

    }

    // Arret des timers
    stopTimer() {
        clearTimeout(this.timer);
        clearInterval(this.decount);
        this.remaining = null;
        this.decount = null;
    }
}