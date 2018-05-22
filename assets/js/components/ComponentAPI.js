import Component from '../Component';
export default class ComponentAPI extends Component{
    /**
     *
     * @param e DOMElement
     * @param k string Clé d'api
     * @param u url de la requête
     */
    constructor(e, k, u) {
        super(e);
        this.k = k;
        this.u = u;
    }
}