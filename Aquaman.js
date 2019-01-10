'use strict';
class Aquaman extends Brine {
    constructor(x, y, size, velocity) {
        super(x, y, size, velocity);
        this.size = 60;
        this.maxSpeed = 3.8;
        this.maxForce = 0.1;
        this.color = createVector(0, 100, 255);
    }

    // show(){
    // 	fill(this.color.x, this.color.y, this.color.z);
    //     ellipse(this.position.x, this.position.y, this.size, this.size);
    //     // imageMode(CENTER);
    //     // image(aquamanImage,this.position.x,this.position.y,this.size,this.size,0,0);
    // }
}