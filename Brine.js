'use strict';
class Brine extends Boid {
    constructor(x, y, size, velocity,image,imageFlipped) {
        super(x, y, size, velocity,image,imageFlipped);
        this.maxSpeed = 3;
        this.maxForce = 0.1;
        this.color = createVector(0, 255, 0);
    }
}