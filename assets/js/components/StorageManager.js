export default class StorageManager {
    constructor(datas, renderer) {
        this.stationId = null;
        this.stationName = null;
        this.stationPlace = null;
        this.duration = null;
        this.timer = null;
        this.remaining = null;
        this.decount = null;

        this.renderer = renderer;
        this.datas = datas;
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
        this.stationId = this.datas.id;
        this.stationName = this.datas.name;
        this.stationPlace = this.datas.address;
        this.duration = 1200000;
    }

    save() {
        sessionStorage.setItem('id', this.stationId);
        sessionStorage.setItem('name', this.stationName);
        sessionStorage.setItem('place', this.stationPlace);

    }

    clear(render = true) {
        sessionStorage.clear();

        this.stopTimer();

        if (render) {
            this.renderer.render('expired');
        }
        this.stationId = null;
        this.stationName = null;
        this.stationPlace = null;
    }

    setTimer() {
        this.remaining = this.duration;

        this.decount = setInterval(() => {
            if ((this.remaining - 1000) > 0) {
                this.remaining -= 1000;
                this.renderer.updateDisplayTime();
            } else {
                clearInterval(this.decount);
            }

        }, 1000);

        this.timer = setTimeout(() => {
            this.clear();
        }, this.duration);

    }

    stopTimer() {
        clearTimeout(this.timer);
        clearInterval(this.decount);
        this.remaining = null;
        this.duration = null;
        this.decount = null;
    }
}