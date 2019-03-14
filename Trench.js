'use strict';
class Trench extends Boid {
	constructor(x, y, size, velocity, image, imageFlipped) {
		super(x, y, size, velocity, image, imageFlipped);
		this.maxSpeed = 3.5;
		this.maxForce = 0.1;
		this.color = createVector(90, 0, 0);
	}

	show() {
		if (!globalShowNames && globalShowKills) {
			if (this.numberOfKills > 0) {
				noStroke();
				fill(150, 0, 0);
				textSize(15);
				text(this.numberOfKills, this.position.x, this.position.y - this.size / 2);
			}
		}
		super.show();
	}
}