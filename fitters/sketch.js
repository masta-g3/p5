var data = [];
var params = [1,-0.01,0.001];

var ml = require('ml-regression');

function setup() {
	createCanvas(900, 500);
	let inputs = [80, 60, 10, 20, 30];
	let outputs = [20, 40, 30, 50, 60];
	console.log(inputs, outputs);
}

function mousePressed() {
	// We do this map to handle resizing.
	var x1 = map(mouseX, 0, width, 0, 1);
	var y1 = map(mouseY, 0, height, 1, 0);
	var point = new dataPoint(x1, y1);
	data.push(point);
}

function draw() {
  background('#FFFFFF');
	// Draw points.
  for (var i = 0; i < data.length; i++) {
		data[i].move();
		data[i].show();
		xi = data[i].x * width;
		yi = data[i].y * height;
		if (xi<-5|| xi>width+5||yi<-5|yi>height+5) {
			data.pop(i);
		}
  }
	// Draw fitted line.
	for (var x = 0; x < width; x +=5){
		var y = Polynomial(params, x);
		// console.log(x, y);
		// fill('#FF0077');
		// ellipse(x, y + 100, 8, 8);
	}
}

function dataPoint(x, y){
	this.x = x;
	this.y = y;
	this.xoff = random(100);
	this.yoff = random(100);
}

// Update movement.
dataPoint.prototype.move = function() {
	this.xoff += 0.001;
	this.yoff += 0.01;
	this.x += (0.8 - noise(this.xoff))*0.0001;
	this.y += (0.5 - noise(this.yoff))*0.005;
}

dataPoint.prototype.show = function() {
	var x = map(this.x, 0, 1, 0, width);
	var y = map(this.y, 0, 1, height, 0);
	noStroke();
	fill('#FF0077');
	ellipse(x, y, 8, 8);
}

function Polynomial(params, x){
	var y = 0;
	for (var i = 0; i < params.length; i++) {
		y += params[i] * (x**i);
	}
	return y;
}
