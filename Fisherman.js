'use strict';
// eslint-disable-next-line
class Fisherman extends Boid {
	constructor(x, y, size, velocity, image, imageFlipped) {
		super(x, y, size, velocity, image, imageFlipped);
		this.maxSpeed = 4;
		this.maxForce = 0.1;
		this.color = createVector(100, 100, 50);
	}
}