'use strict';
// eslint-disable-next-line
class Aquaman extends Brine {
	constructor(x, y, size, velocity, image, imageFlipped) {
		super(x, y, size, velocity, image, imageFlipped);
		this.size = 60;
		this.maxSpeed = 3.8;
		this.maxForce = 0.1;
		this.color = createVector(0, 100, 255);
		this.name = 'Arthur';
	}
}