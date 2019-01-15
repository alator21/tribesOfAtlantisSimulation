'use strict';
class Trench extends Boid {
    constructor(x, y, size, velocity,image,imageFlipped) {
        super(x, y, size, velocity,image,imageFlipped);
        this.maxSpeed = 3.5;
        this.maxForce = 0.1;
        this.color = createVector(90, 0, 0);
    }
    // show() {
    //     stroke(255,0,0);
    //     noFill();
    //     // rect(this.position.x,this.position.y-10,this.size,10);
    //     textAlign(CENTER);
    //     textSize(15);
    //     text(this.name,this.position.x,this.position.y-this.size/2);
    //     let image1;
    //     if (this.velocity.x > 0){
    //         image1 = trenchImage;
    //     }
    //     else{
    //         image1 = trenchImageFlipped;
    //     }
    //     image1.mask(maskImage);
    //     image(image1, this.position.x, this.position.y, this.size, this.size);
    // }
}