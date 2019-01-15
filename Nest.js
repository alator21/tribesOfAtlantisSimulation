'use strict';

class Nest {

    constructor(name) {
        this.name = name;
        switch (name) {
            case 'Fish':
                this.position = createVector(0, 0);
                this.size = random(250, 300);
                this.textPosition = createVector(32 + this.size / 15, 32 + this.size / 15);
                this.colorAlpha = random(80, 240);
                break;
            case 'Trench':
                this.position = createVector(0, height);
                this.size = random(250, 300);
                this.textPosition = createVector(32 + this.size / 15, height - 32 - this.size / 15);
                this.colorAlpha = random(80, 240);
                break;
            case 'Brine':
                this.position = createVector(width, 0);
                this.size = random(250, 300);
                this.textPosition = createVector(width - 32 - this.size / 15, 32 + this.size / 15);
                this.colorAlpha = random(80, 240);
                break;
            case 'Fisherman':
                this.position = createVector(width, height);
                this.size = random(250, 300);
                this.textPosition = createVector(width - 32 - this.size / 15, height - 32 - this.size / 15);
                this.colorAlpha = random(80, 240);
                break;
            default:

                break;
        }
    }

    show() {
        noStroke();
        fill(0, this.colorAlpha);
        ellipse(this.position.x, this.position.y, this.size, this.size);
        if (this.colorAlpha > 80) {
            textSize(15);
            textAlign(CENTER);
            fill(255);
            text(this.name, this.textPosition.x, this.textPosition.y);
        }

    }
}