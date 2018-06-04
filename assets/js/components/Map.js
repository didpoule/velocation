import ComponentAPI from './ComponentAPI';
import Markers from './Markers';

// Cette classe affiche la carte google map
export default class Map extends ComponentAPI {
    constructor(e, k, u, booking) {
        super(e, k, u);
        this.initMap = this.initMap.bind(this);
        this.request = new XMLHttpRequest();
        this.map = null;
        this.markers = null;
        this.booking = booking;
    }

    /**
     * Envoie une requête pour récupérer les stations sur l'API JCDecaux
     */

    /**
     * Chargement de le carte google map et injection des donnés de stations
     */
    initMap() {

        this.map = new google.maps.Map(this.e, {
            zoom: 10,
            center: {lat: 45.757934, lng: 4.8552035}
        });

        this.markers = new Markers(this.k, this.u, this.map, this.booking);

        // Initialisation Markers
        this.markers.sendRequest();
    }
}
