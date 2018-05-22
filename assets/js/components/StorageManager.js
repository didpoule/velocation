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
        this.duration = 1200000;

    }

    init() {
        this.setDatas();
        if (!this.isNull()) {
            this.save();
            this.setTimer();
        }
        this.renderer.render();
    }

    isNull() {
        return ((this.stationName === null) || (this.stationPlace === null) ||
            (this.stationId == null));
    }

    setDatas() {
        if (sessionStorage.name != null || sessionStorage.place != null || sessionStorage.id != null) {
            this.clear(false);
        }

        if (this.datas != null) {
            this.stationId = this.datas.id;
            this.stationName = this.datas.name;
            this.stationPlace = this.datas.address;
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

    save() {
        sessionStorage.setItem('id', this.stationId);
        sessionStorage.setItem('name', this.stationName);
        sessionStorage.setItem('place', this.stationPlace);
        sessionStorage.setItem('expire', this.endTime);

    }


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

    stopTimer() {
        clearTimeout(this.timer);
        clearInterval(this.decount);
        this.remaining = null;
        this.decount = null;
    }
}