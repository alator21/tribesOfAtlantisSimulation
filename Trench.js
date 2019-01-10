'use strict';
class Trench extends Boid {
    constructor(x, y, size, velocity) {
        super(x, y, size, velocity);
        this.maxSpeed = 3.5;
        this.maxForce = 0.1;
        this.color = createVector(90, 0, 0);
    }
}