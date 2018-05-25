import Component from '../Component';
import $ from 'jquery';

export default class Slider extends Component {
    constructor(e) {
        super(e);
        this.images = $(this.e).find('img');
        this.container = $('#slider-pictures');
        this.navContainer = $('#slider-nav');
        this.previousButton = $('#slider-previous');
        this.nexButton = $('#slider-next');
        this.index = 0;
        this.autoId = null;
        this.slideDelay = 10000;
        this.sliderControll = this.sliderControll.bind(this);

    }


    init() {
        this.setListeners();
        this.setCurrent();
        this.render();
        this.autoSlide();
    }

    setCurrent() {
        this.checkIndex();
        this.current = this.images.eq(this.index);
    }

    setHeight() {
        $(this.e).height(this.current.height());
        $(this.container).height(this.current.height());
    }

    previous() {
        this.index--;
        this.setCurrent();
        this.render();
    }

    next() {
        this.index++;
        this.setCurrent();
        this.render();
    }

    sliderControll(e) {
        switch (e.key) {
            case 'ArrowLeft' :
                this.previous();
                break;
            case 'ArrowRight':
                this.next();
                break;
            case 'ArrowLeft', 'ArrowRight' :
                e.key.stopPropagation();
        }

    }
    setListeners() {
        $(document).keydown(this.sliderControll);

        // Responsivité conteneur
        $(window).resize(() => {
            this.setHeight();
        });

        // Swipe écran tactile
        let startX, endX;
        this.e.addEventListener("touchstart", (e) => {
            e.preventDefault();
            startX = e.touches[0].clientX;
        }, true);

        this.e.addEventListener("touchmove", (e) => {
            e.preventDefault();
            endX = e.touches[0].clientX;
        }, true);

        this.e.addEventListener("touchend", () => {
            if (endX != null && startX != null) {
                if (endX < startX && (startX - endX) > 20) {
                    this.next();
                } else if (endX > startX && (endX - startX) > 20) {
                    this.previous();
                }
                endX = null;
                startX = null;
            }
        }, true)
    }

    checkIndex() {
        // Retour au début quand on est a la fin
        if (this.index > this.images.length - 1) {
            this.index = 0;
        }
        // Affichage dernière image si précédent à la première
        else if (this.index < 0) {
            this.index = this.images.length - 1;
        }
    }

    autoSlide() {
        this.autoId = setInterval(() => {
            this.next();
        }, this.slideDelay)
    }

    stopSlide() {
        clearInterval(this.autoId);
    }

    render() {

        this.setHeight();
        this.images.hide();
        this.current.show();
    }
}
