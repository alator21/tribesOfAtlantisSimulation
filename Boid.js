'use strict';
class Boid {
    constructor(x, y, size, velocity) {
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
    }
    show() {
        if (this.idle){
            strokeWeight(4);
            if (this.statue){
                stroke(random(255),random(200),random(15));
            }
            else{
                stroke(0);
            }
        }
        else{
            noStroke();
        }
        fill(this.color.x, this.color.y, this.color.z);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }

    update() {
        if (this.statue){
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

    eat(element) {
        this.numberOfKills ++;
        this.size += 1;
        this.maxSpeed -= 0.05;
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