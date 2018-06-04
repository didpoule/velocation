import ComponentAPI from './ComponentAPI';
import StationDetails from "./StationDetails";
import $ from 'jquery';

// Cette classe créée des marqueurs sur la carte google maps
export default class Markers extends ComponentAPI {
    constructor(k, u, map, booking) {
        super(null, k, u);
        this.labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.request = new XMLHttpRequest();
        this.url = null;
        this.map = map;
        this.setURL();
        this.booking = booking;
    }

    setURL() {
        this.URL = this.u + this.k;
    }

    sendRequest() {
        this.request.open('GET', this.URL, true);
        this.request.send(null);
        this.request.onreadystatechange = () => {
            // Chargement de la map et ses données une fois la réponse reçue
            if (this.request.readyState === 4 && this.request.status === 200) {
                this.setList(JSON.parse(this.request.responseText));
            }
        }
    }

    setList(datas) {
        this.list = datas.map((location, i) => {
            // Enlève le numéro d'identifiant de la station
            location.name = location.name.substr(7, location.name.length);

            // Traduction du statut
            location.status = (location.status === 'OPEN') ? 'Ouverte' : 'Fermée';

            // hydratation d'un nouveau marker
            return new google.maps.Marker({
                id: location.number,
                position: location.position,
                name: location.name,
                address: location.address,
                status: location.status,
                bike_stands: location.bike_stands,
                available_bike_stands: location.available_bike_stands,
                available_bikes: location.available_bikes,
                label: this.labels[i % this.labels.length],
            })
        });

        // Création MarkerClustrer pour regroupement des Makers
        this.markerCluster = new MarkerClusterer(this.map, this.list,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

        // Création encadré détails station
        this.stationDetails = new StationDetails(document.getElementById('station-summary'),
            'AIzaSyA6J_tRVyBM8d6SJTJHXVxdNmGpSTVojrU',
            [
                'https://maps.googleapis.com/maps/api/streetview?size=640x240&location=',
                '&heading=151.78&pitch=-0.76&key='
            ], this.booking);

        // Ajout du trigger clique sur marqueur pour mettre à jour le formulaire
        for (let i = 0; i < this.list.length; i++) {
            let marker = this.list[i];
            marker.addListener('click', () => {
                // Sauvegarde des données du marqueur pour contrôler lors de la réservation
                this.stationDetails.updateValues(marker);
                this.stationDetails.render();
                $('html,body').animate({
                        scrollTop: $(this.stationDetails.e).offset().top -
                        20
                    }, 'slow');
            });
        }

    }

}