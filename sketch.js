/* global Fish,Nest,Trench,Brine,Fisherman,Aquaman,p5 */
'use strict';
let nests = [];
let fishElements = [];
let trenchElements = [];
let brineElements = [];
let fishermanElements = [];
let allElements = [];
let aquaman;
let aquamanImage;
let aquamanImageFlipped;
let fishImage;
let fishImageFlipped;
let trenchImage;
let trenchImageFlipped;
let brineImage;
let brineImageFlipped;
let fishermanImage;
let fishermanImageFlipped;
let maskImage;

// eslint-disable-next-line no-unused-vars
let globalImageMode = true;
// eslint-disable-next-line no-unused-vars
let globalShowNames = false;
// eslint-disable-next-line no-unused-vars
let globalShowKills = false;


// eslint-disable-next-line
function preload() {
	aquamanImage = loadImage('assets/images/aquaman.png');
	aquamanImageFlipped = loadImage('assets/images/aquamanFlipped.png');
	fishImage = loadImage('assets/images/fish.png');
	fishImageFlipped = loadImage('assets/images/fishFlipped.png');
	trenchImage = loadImage('assets/images/trench.png');
	trenchImageFlipped = loadImage('assets/images/trenchFlipped.png');
	brineImage = loadImage('assets/images/brine.png');
	brineImageFlipped = loadImage('assets/images/brineFlipped.png');
	fishermanImage = loadImage('assets/images/fisherman.png');
	fishermanImageFlipped = loadImage('assets/images/fishermanFlipped.png');
	maskImage = createGraphics(512, 512);
	maskImage.beginShape();
	maskImage.ellipse(240, 240, 1000, 1000);
	maskImage.endShape();
}
// eslint-disable-next-line
function setup() {
	createCanvas(windowWidth, windowHeight - 5);
	imageMode(CENTER);
	angleMode(DEGREES);
	nests.push(new Nest('Fish'));
	nests.push(new Nest('Trench'));
	nests.push(new Nest('Brine'));
	nests.push(new Nest('Fisherman'));

	spawnFish(20);
	spawnTrench(10);
	spawnBrine(5);
	spawnFisherman(5);
	// spawnTheAquaman(width/2,height/2);
}
// eslint-disable-next-line
function draw() {
	background(102, 255, 255);

	for (let nest of nests) {
		nest.show();
	}
	if (frameCount > 100) {
		for (let nest of nests) {
			if (nest.colorAlpha > 0) {
				nest.colorAlpha--;
			}

		}
	}


	for (let i = 0; i < fishElements.length; i++) {
		let fish = fishElements[i];
		fish.flock(fishElements, trenchElements, 5, [], 1, 1, 1, 1);
		fish.limitIntoCanvas();
		fish.update();
		fish.show();
	}
	for (let i = 0; i < trenchElements.length; i++) {
		let trench = trenchElements[i];
		if (aquaman) {
			trench.flock(trenchElements, [...brineElements, aquaman], 5, fishElements, 1, 1, 1, 1.5);
		} else {
			trench.flock(trenchElements, [...brineElements], 1, fishElements, 1, 1, 1, 1.5);
		}
		trench.limitIntoCanvas();
		trench.update();
		trench.show();
	}

	for (let i = 0; i < brineElements.length; i++) {
		let brine = brineElements[i];
		brine.flock(brineElements, [], 1, [], 1, 1, 1, 1.3);
		brine.limitIntoCanvas();
		brine.update();
		brine.show();
	}

	for (let i = 0; i < fishermanElements.length; i++) {
		let fisherman = fishermanElements[i];
		fisherman.flock(fishermanElements, [], 1, [], 1, 1, 1, 1.3);
		fisherman.limitIntoCanvas();
		fisherman.update();
		fisherman.show();
	}
	if (aquaman) {
		if (aquaman.idle) {
			aquaman.moveToAndStop(width - 100, 50);

		}
		aquaman.flock([...brineElements, ...fishermanElements], [], 1, trenchElements, 3, 1, 1, 1);
		aquaman.limitIntoCanvas();
		aquaman.update();
		aquaman.show();
	}


}

function spawnFish(howMany) {
	for (let nest of nests) {
		if (nest.name === 'Fish') {
			let velX = 5;
			let velY = 1;
			let x = nest.position.x + 50;
			let y = nest.position.y + 100;
			for (let i = 0; i < howMany; i++) {
				let velocity = createVector(velX, velY);
				x += random(-20, 20);
				y += random(-20, 20);

				velocity.setMag(random(1, 5));
				size = random(30, 45);
				let element = new Fish(x, y, size, velocity, fishImage, fishImageFlipped);
				fishElements.push(element);
			}
			allElements.push(...fishElements);
			break;
		}
	}
}

function spawnTrench(howMany) {
	for (let nest of nests) {
		if (nest.name === 'Trench') {
			let velX = 5;
			let velY = -1;
			let x = nest.position.x - 50;
			let y = nest.position.y - 100;
			for (let i = 0; i < howMany; i++) {
				let velocity = createVector(velX, velY);
				x += random(-20, 20);
				y += random(-20, 20);

				velocity.setMag(random(1, 5));
				size = random(40, 60);
				let element = new Trench(x, y, size, velocity, trenchImage, trenchImageFlipped);
				trenchElements.push(element);
			}
			allElements.push(...trenchElements);
			break;
		}

	}
}

function spawnBrine(howMany) {
	for (let nest of nests) {
		if (nest.name === 'Brine') {
			let velX = -5;
			let velY = 1;
			let x = nest.position.x - 50;
			let y = nest.position.y + 100;
			for (let i = 0; i < howMany; i++) {
				let velocity = createVector(velX, velY);
				x += random(-20, 20);
				y += random(-20, 20);

				velocity.setMag(random(1, 5));
				size = random(45, 60);
				let element = new Brine(x, y, size, velocity, brineImage, brineImageFlipped);
				brineElements.push(element);
			}
			allElements.push(...brineElements);
			break;
		}
	}
}

function spawnFisherman(howMany) {
	for (let nest of nests) {
		if (nest.name === 'Fisherman') {
			let velX = -5;
			let velY = -1;
			let x = nest.position.x - 50;
			let y = nest.position.y - 100;
			for (let i = 0; i < howMany; i++) {
				let velocity = createVector(velX, velY);
				x += random(-20, 20);
				y += random(-20, 20);

				velocity.setMag(random(1, 5));
				size = random(35, 40);
				let element = new Fisherman(x, y, size, velocity, fishermanImage, fishermanImageFlipped);
				fishermanElements.push(element);
			}
			allElements.push(...fishermanElements);
			break;
		}
	}
}
// eslint-disable-next-line no-unused-vars
function spawnTheAquaman(x, y) {
	let size = 60;
	let velocity = p5.Vector.random2D();
	velocity.setMag(8);
	aquaman = new Aquaman(x, y, size, velocity, aquamanImage, aquamanImageFlipped);
	allElements.push(aquaman);
}