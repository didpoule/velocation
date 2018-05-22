import 'bootstrap';
import Slider from './components/Slider';
import Map from './components/Map';

HTMLElement.prototype.show = function (d = 'block') {
    this.style.display = d;
};

HTMLElement.prototype.hide = function () {
    this.style.display = 'none';
};

window.timeConversion = function (millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

class App {
    constructor() {
        this.jcdK = '64e67bb866a2e8469869909a9502f86b8f893beb';

        this.slider = new Slider(document.getElementById('slider'));
        this.map = new Map(document.getElementById('map-container'), this.jcdK, 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=');
    }

    render() {
        this.slider.init();
    }
}

let app = new App();

app.render();

window.initMap = app.map.initMap;

