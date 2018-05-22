import $ from 'jquery';

export default class Canvas {

    constructor() {
        this.container = document.getElementById('canvas-container');
        this.canvas = document.getElementById('station-booking-canvas');
        this.drawArea = document.getElementById('station-booking-canvas').getContext("2d");
        this.elementOffset = null;
        this.lastX = null;
        this.lastY = null;
        this.initDraw();
        this.clear = this.clear.bind(this);
        window.clearCanvas = this.clear;

    }

    hide() {
        this.clear();
        this.container.style.display = "none";
    }

    show() {
        this.container.style.display = "flex";
    }

    draw(x, y, isDown) {
        if (isDown) {
            this.drawArea.beginPath();
            this.drawArea.strokeStyle = "black";
            this.drawArea.lineWidth = 3;
            this.drawArea.lineJoin = "round";
            this.drawArea.moveTo(this.lastX, this.lastY);
            this.drawArea.lineTo(x, y);
            this.drawArea.closePath();
            this.drawArea.stroke();
        }
        this.lastX = x;
        this.lastY = y;
    }

    initDraw() {
        let mousePressed = false;

        // Ajout des évènements
        this.canvas.addEventListener('mousedown', (e) => {
            mousePressed = true;
            // Calcule la position réelle de l'élement
            this.elementOffset = this.offset();
            // Calcule de la position relative pour dessiner sous le curseur
            this.draw(e.pageX - this.elementOffset.left, e.pageY - this.elementOffset.top, false);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (mousePressed) {
                this.elementOffset = this.offset();
                this.draw(e.pageX - this.elementOffset.left, e.pageY - this.elementOffset.top, true);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            mousePressed = false;
            this.canvas.addEventListener('mouseleave', () => {
                mousePressed = false;
            });
        });

        this.canvas.addEventListener('touchstart', (e) => { this.handleStart(e) }, true);
        this.canvas.addEventListener('touchend', (e) => { this.handleEnd(e) }, true);
        this.canvas.addEventListener('touchmove', (e) => { this.handleMove(e) }, true);
    }

    offset() {
        let rect = this.canvas.getBoundingClientRect();
        let bodyElement = document.documentElement;

        return {
            top: rect.top + $(window).scrollTop(),
            left: rect.left + $(window).scrollLeft()
        }
    }

    // Vide le canvas
    clear() {
        this.drawArea.setTransform(1, 0, 0, 1, 0, 0);
        this.drawArea.clearRect(0, 0, this.drawArea.canvas.width, this.drawArea.canvas.height);

    }

    // Crée un canvas vierge et retourne la comparaison avec le canvas réelle
    isCanvasBlank() {
        let blank = document.createElement('canvas');
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;

        return this.canvas.toDataURL() === blank.toDataURL();

    }

    handleStart(e) {
        e.preventDefault();
        this.elementOffset = this.offset();
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX ,
            clientY: touch.clientY + document.documentElement.scrollTop
        });

        //console.log(mouseEvent.clientY);

        this.canvas.dispatchEvent(mouseEvent);
    }

    handleEnd(e) {
        let mouseEvent = new MouseEvent("mouseup", {});
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleMove(e) {
        e.preventDefault();
        let touch = e.touches[0];

        let mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY + document.documentElement.scrollTop
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
}
