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

let globalImageMode = true;
let globalShowNames = false;



$(function() {
    $(document).on('click', '#spawnAquaman', function() {
        if (!aquaman) {
            spawnTheAquaman(width / 2, height / 2);
            $('#stopAquaman').attr('disabled', false);
            $('#startAquamanAgain').attr('disabled', false);
            $(this).attr('disabled', true);
        }
    });
    $(document).on('click', '#stopAquaman', function() {
        if (aquaman) {
            aquaman.stopFlocking();
        }
    });
    $(document).on('click', '#startAquamanAgain', function() {
        if (aquaman) {
            aquaman.startFlockingAgain();
        }
    });
    $(document).on('click', '#showNames', function() {
        if ($(this).is(':checked')) {
            globalShowNames = true;
        } else {
            globalShowNames = false;
        }
    });
});

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

function setup() {
    createCanvas(windowWidth - 100, windowHeight - 100);
    initializeUI();
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
}


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
        let intersectingElements = [];
        intersectingElements = trench.intersects(fishElements);
        if (intersectingElements.length > 0) {
            for (let j = 0; j < intersectingElements.length; j++) {
                let elementThatIntersects = intersectingElements[j];
                trench.eat();
                let index = fishElements.indexOf(elementThatIntersects);
                if (index !== -1) {
                    fishElements.splice(index, 1);
                }
            }

        }
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
        let intersectingElements = [];

        if (aquaman.intersects(trenchElements).length > 0) {
            intersectingElements = aquaman.intersects(trenchElements);
        }

        if (intersectingElements.length > 0) {
            for (let i = 0; i < intersectingElements.length; i++) {
                let elementThatIntersects = intersectingElements[i];
                let index;
                let className = elementThatIntersects.constructor.name;
                if (className === 'Trench') {
                    index = trenchElements.indexOf(elementThatIntersects);
                    trenchElements.splice(index, 1);
                    aquaman.eat();
                }
            }
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
            break;
        }
    }
}

function spawnTheAquaman(x, y) {
    let size = 60;
    let velocity = p5.Vector.random2D();
    velocity.setMag(8);
    aquaman = new Aquaman(x, y, size, velocity, aquamanImage, aquamanImageFlipped);
}

function initializeUI() {
    let rethtml = ``;
    rethtml += `<button class='retro-button green-button' id='spawnAquaman'>Spawn Aquaman</button>`;
    rethtml += `<span style='font-size:20px'>|| </span>`;
    rethtml += `<button class='retro-button red-button' id='stopAquaman' disabled>Stop Aquaman</button>`;
    rethtml += `<span style='font-size:20px'>|| </span>`;
    rethtml += `<button class='retro-button yellow-button' id='startAquamanAgain' disabled>Start Aquaman again</button>`;
    rethtml += `<span style='font-size:20px'>|| </span>`;
    rethtml += `<span class='checkbox-inline'><label><input id='showNames' type='checkbox'>Show names</label></span>`;
    $('body').append(rethtml);
}