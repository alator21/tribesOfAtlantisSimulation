'use strict';
const names = ['John', 'Alfie', 'Alfred', 'Bellamy', 'Atticus', 'Blaze', 'Jeannine', 'Fritz', 'Garry', 'Fabian', 'Rafael', 'Connor', 'Zachariah', 'Solomon', 'Byron', 'Franklin', 'Ian', 'Zakaria', 'Julian', 'Margot', 'Anam', 'Nina', 'Scarlet', 'Hakeem', 'Troy', 'Paolo', 'Nolan', 'Carina', 'Ioana', 'Bayley', 'Alex', 'Eliza', 'Ismail', 'Nate', 'Shanna', 'Anne', 'Tayler', 'Reagan', 'Isa', 'Jazmin', 'Shannon', 'Fatma', 'Idris'];
class Boid {
	constructor(x, y, size, velocity, image, imageFlipped) {
		this.position = createVector(x, y);
		this.size = size;
		this.velocity = velocity;
		this.accelaration = createVector();
		this.maxForce = 0.01;
		this.maxSpeed = 4;
		this.color = createVector(50, 50, 50);
		this.idle = false;
		this.statue = false;
		this.numberOfKills = 0;
		this.name = random(names);
		this.image = image;
		this.imageFlipped = imageFlipped;
	}
	show() {
		if (globalShowNames) {
			noStroke();
			fill(150, 0, 0);
			textSize(15);
			text(this.name, this.position.x, this.position.y - this.size / 2);
		}
		if (globalImageMode) {
			let image1;
			if (this.velocity.x > 0) {
				image1 = this.image;
			} else {
				image1 = this.imageFlipped;
			}
			image1.mask(maskImage);
			image(image1, this.position.x, this.position.y, this.size, this.size);
		} else {
			stroke(0);
			fill(this.color.x, this.color.y, this.color.z);
			ellipse(this.position.x, this.position.y, this.size - 15, this.size - 15);
		}
	}

	update() {
		if (this.statue) {
			this.velocity.mult(0);
			return;
		}
		this.position.add(this.velocity);
		this.velocity.add(this.accelaration);
		this.velocity.limit(this.maxSpeed);
		this.accelaration.mult(0);
	}

	doForce(whatForce, elements) {
		let perceptionRadius = 100;
		let total = 0;
		let steering = createVector(0, 0);

		if (whatForce === 'align') {
			for (let i = 0; i < elements.length; i++) {
				let other = elements[i];
				let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
				if (d < perceptionRadius && this != other) {
					steering.add(other.velocity);
					total++;
				}
			}
			if (total > 0) {
				steering.div(total);
				steering.setMag(this.maxSpeed);
				steering.sub(this.velocity);
				steering.limit(this.maxForce);
			}
		} else if (whatForce === 'cohesion') {
			for (let i = 0; i < elements.length; i++) {
				let other = elements[i];
				let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
				if (d < perceptionRadius && this != other) {
					steering.add(other.position);
					total++;
				}
			}
			if (total > 0) {
				steering.div(total);
				steering.sub(this.position);
				steering.setMag(this.maxSpeed);
				steering.sub(this.velocity);
				steering.limit(this.maxForce);
			}
		} else if (whatForce === 'seperation') {
			for (let i = 0; i < elements.length; i++) {
				let other = elements[i];
				let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
				if (d < perceptionRadius && this != other) {
					let diff = p5.Vector.sub(this.position, other.position);
					diff.div(d * d);
					steering.add(diff);
					total++;
				}
			}
			if (total) {
				steering.div(total);
				steering.setMag(this.maxSpeed);
				steering.sub(this.velocity);
				steering.limit(this.maxForce);
			}
		}
		return steering;
	}
	limitIntoCanvas() {
		if (this.position.x > width) {
			this.position.x = 0;
		} else if (this.position.x < 0) {
			this.position.x = width;
		}

		if (this.position.y > height) {
			this.position.y = 0;
		} else if (this.position.y < 0) {
			this.position.y = height;
		}
	}

	flock(elements, fearElements = [], fearMult = 50, chaseElements = [], chaseMult = 5, alignmentMult = 1, cohesionMult = 1, seperationMult = 1) {
		if (this.idle) {
			return;
		}
		if (elements.length !== 0) {
			let alignment = this.doForce('align', elements);
			let cohesion = this.doForce('cohesion', elements);
			let seperation = this.doForce('seperation', elements);
			alignment.mult(alignmentMult);
			cohesion.mult(cohesionMult);
			seperation.mult(seperationMult);
			this.accelaration.add(alignment);
			this.accelaration.add(cohesion);
			this.accelaration.add(seperation);
		}
		if (fearElements.length !== 0) {
			let fear = this.fear(fearElements, fearMult);
			this.accelaration.add(fear);
		}

		if (chaseElements.length !== 0) {
			let chase = this.chase(chaseElements, chaseMult);
			this.accelaration.add(chase);
			this.hunt(chaseElements);
		}


	}

	fear(elements, fearMult = 50) {
		let perceptionRadius = 100;
		let total = 0;
		let steering = createVector();
		for (let i = 0; i < elements.length; i++) {
			let other = elements[i];
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
			if (d < perceptionRadius && this != other) {
				let diff = p5.Vector.sub(this.position, other.position);
				diff.div(d * d);
				steering.add(diff);
				total++;
			}
		}
		if (total) {
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		steering.mult(fearMult);
		return steering;
	}

	chase(elements, chaseMult = 5) {
		let perceptionRadius = 150;
		let total = 0;
		let steering = createVector(0, 0);
		let minDistance = 500;
		let closestElement;
		for (let i = 0; i < elements.length; i++) {
			let other = elements[i];
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
			if (d < perceptionRadius && this != other) {
				if (d < minDistance) {
					d = minDistance;
					closestElement = other;
				}
			}

		}
		if (!closestElement) {
			return createVector(0, 0);
		}
		steering.add(closestElement.position);
		steering.sub(this.position);
		steering.setMag(this.maxSpeed);
		steering.sub(this.velocity);
		steering.limit(this.maxForce);
		steering.mult(chaseMult);
		return steering;
	}

	intersects(elements) {
		let intersectingElements = [];
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			let d = dist(this.position.x, this.position.y, element.position.x, element.position.y);
			if (d < sqrt(this.size) + sqrt(element.size)) {
				intersectingElements.push(element);
			}
		}
		return intersectingElements;
	}

	eat() {
		this.numberOfKills++;
		this.size += 1;
		this.maxSpeed -= 0.05;
	}

	hunt(elements) {
		let intersectingElements = this.intersects(elements);
		if (intersectingElements.length > 0) {
			for (let j = 0; j < intersectingElements.length; j++) {
				let elementThatIntersects = intersectingElements[j];
				let className = elementThatIntersects.constructor.name;
				let index;
				switch (className) {
					case 'Fish':
						index = fishElements.indexOf(elementThatIntersects);
						if (index !== -1) {
							fishElements.splice(index, 1);
						}
						break;
					case 'Trench':
						index = trenchElements.indexOf(elementThatIntersects);
						if (index !== -1) {
							trenchElements.splice(index, 1);
						}
						break;
					case 'Brine':
						index = brineElements.indexOf(elementThatIntersects);
						if (index !== -1) {
							brineElements.splice(index, 1);
						}
						break;
					case 'Fisherman':
						index = fishermanElements.indexOf(elementThatIntersects);
						if (index !== -1) {
							fishermanElements.splice(index, 1);
						}
						break;
					case 'Aquaman':
						aquaman = undefined;
						break;
					default:
						console.log(`Cant find class:${className}`);
						break;
				}
				if (index !== -1) {
					let gIndex = allElements.indexOf(elementThatIntersects);
					if (gIndex !== -1) {
						allElements.splice(gIndex, 1);
						this.eat();
					}

				}
			}
		}
	}

	moveTowards(x, y) {
		if (this.statue) {
			return;
		}
		this.idle = true;
		let target = createVector(x, y);
		target.sub(this.position);
		target.setMag(2);
		target.sub(this.velocity);
		target.limit(this.maxForce);
		this.accelaration.add(target);
	}

	isAt(x, y) {
		let d = dist(this.position.x, this.position.y, x, y);
		if (d < 5) {
			return true;
		}
		return false;
	}

	moveToAndStop(x, y) {
		this.moveTowards(x, y);
		if (this.isAt(x, y)) {
			this.statue = true;
			this.velocity.mult(0);
		}
	}

	stopFlocking() {
		this.idle = true;
	}

	startFlockingAgain() {
		this.statue = false;
		this.idle = false;
	}
}