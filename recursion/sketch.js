let toff = 0;
let s = 0.4;
let on = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	toff *= random() * 10;
	img = loadImage("arrows.jpg");
}

function draw() {
	background(246);
	image(img, width*0.6, height*0.6);
	rec_square(width/2, height/2, width, toff);
	toff += 0.01;
	// Trigger random size.
	on = random();
	console.log(on);
	console.log(s);
	if (on < 0.01 & s < 0.9) {
		s += 0.05;
	} else if (on < 0.01 & s > 0.1) {
		s -= 0.05;
	}
}

function rec_square(x, y, z, toff) {
	noFill();
	if (z < 15) {
		fill(0, 100, 30);
	}
	push();
	rect(x, y ,z, z);
	pop();
	if (z > 10) {
		shift1 = (width/2 - mouseX)*0.1;
		shift1 = Math.min(Math.max(parseInt(shift1), -1), 1);
		noise1 = map(noise(toff), 0, 1, -0.5, 0.5);
		shift2 = (height/2 - mouseY)*0.1;
		shift2 = Math.min(Math.max(parseInt(shift2), -1), 1);
		noise2 = map(noise(toff+1000), 0, 1, -0.5, 0.5);
		rec_square(x-shift1+noise1, y-shift2+noise2, z*s, toff);
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW & s < 0.9)  {
		s += 0.05;
	} else if (keyCode === DOWN_ARROW & s > 0.1) {
		s -= 0.05;
	}
}
