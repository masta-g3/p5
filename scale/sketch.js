var spd = 0.01;
var figures = [];
var pan = [0, 0];
var t = Math.random() * 10000;

var ObjectEnum = {
	SQUARE: 1,
	CIRCLE: 2
  };

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(RADIUS);
	for (var i = 0; i < 10; i++) {
		figures[i] = random_object(ObjectEnum.SQUARE);
		figures[i] = random_object(ObjectEnum.CIRCLE);
	  }
	img = loadImage("264898-200.png");
}


function draw() {
	background(255);

	// Create squares.
	if (random() > 0.8) {
		var sq = random_object(ObjectEnum.SQUARE);
		figures.push(sq);
	} else if (random() > 0.8) {
		var crl = random_object(ObjectEnum.CIRCLE);
		figures.push(crl);
	}	

	for (var i = 0; i < figures.length; i++) {
		figures[i].display();
		figures[i].grow();
		if(figures[i].z > 2.5) {
			if (random() > 0.9) {
				figures.splice(i, 1);
			}
		}
	  }
	  tint(255, 10);
	  image(img, width*0.8, height*0.8);
	  t += 0.1;
	}

function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		pan[0] += 10;
	} else if (keyCode === RIGHT_ARROW) {
		pan[0] -= 10;
	} else if (keyCode === UP_ARROW) {
		pan[1] += 10;
	} else if (keyCode === DOWN_ARROW) {
		pan[1] -= 10;
	}
} 

class Figure {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.z = 0;
	}

	grow() {
		this.z += (1 * spd);
	}
}

class Square extends Figure {
	constructor(x, y, r) {
		super(x, y, r);
	}

	display() {
		stroke(0);
		strokeWeight(3);
		fill(255,200);
		
		var sx = this.x * this.z;
		var sy = this.y * this.z;
		
		push();
		translate(width/2 + pan[0], height/2 + pan[1]);
		rect(sx, sy, this.r * this.z, this.r * this.z);
		pop();
	}
}

class Circle extends Figure {
	constructor(x, y, r) {
		super(x, y, r);
	}

	display() {
		stroke(0);
		strokeWeight(2);
		fill(255,200);
		
		var sx = this.x * this.z;
		var sy = this.y * this.z;
		
		push();
		translate(width/2 + pan[0], height/2 + pan[1]);
		ellipse(sx, sy, this.r * this.z, this.r * this.z);
		pop();
	}
}

function random_object(type) {
	noise(t);
	var nx = (noise(t) - 0.5) * width;
	var ny = (noise(t+1000) - 0.5) * height;
	var r = 15;	
	if (type == ObjectEnum.SQUARE) {
		var sq = new Square(nx, ny, r);
		return sq;
	} else if (type == ObjectEnum.CIRCLE) {
		var sq = new Circle(nx, ny, r);
		return sq;
	}
}