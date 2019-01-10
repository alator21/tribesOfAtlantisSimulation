'use strict';
class Fisherman extends Boid {
    constructor(x, y, size, velocity) {
        super(x, y, size, velocity);
        this.maxSpeed = 4;
        this.maxForce = 0.1;
        this.color = createVector(100, 100, 50);
    }
}