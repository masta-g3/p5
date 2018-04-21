let data = [];
let xs = [];
let ys = [];
let segments = 10;
let shift = 0;

const iters = 10;
const learningRate = 0.5;
const linspace = tf.linspace(0, 1, segments);

// P5 functions.
function setup() {
	createCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	// We do this map to handle resizing.
	let x1 = map(mouseX, 0, width, 0, 1);
	let y1 = map(mouseY, 0, height, 1, 0);
	let point = new dataPoint(x1, y1);
	console.log(x1, y1);

	// Store as array and as objects.
	data.push(point);
	xs.push(x1);
	ys.push(y1);

	// Remove extra data.
	if(xs.length > 20) {
		xs.shift();
		ys.shift();
		data.shift();
	}
}

function draw() {
  background('#FFFFFF');

	// Draw points.
  for (let i = 0; i < data.length; i++) {
		data[i].move();
		data[i].show();
		xs[i] = data[i].x;
		ys[i] = data[i].y;
		let xi = data[i].x * width;
		let yi = data[i].y * height;
		if (xi < -5 || xi > width + 5 || yi < -5 || yi > height + 5) {
			data.pop(i);
		}
  }

	// Train and predict.
	if(xs.length > 5) {
		train(xs, ys, iters);
		let my_pred = predict(linspace);
		// Plot predictions.
		stroke(0, 200);
		strokeWeight(10);
		noFill();
		beginShape();
		for(i = 0; i <= segments; i++) {
			let xi = map(linspace.dataSync()[i], 0, 1, 0, width);
			let yi = map(my_pred.dataSync()[i], 1, 0, 0, height);
			console.log(linspace.dataSync()[i]);
			console.log(my_pred.dataSync()[i]);
			console.log(xi, yi);
			vertex(xi, yi);
		}
		endShape();
		// Final text.
		noStroke();
		fill(0, 4);
		if (frameCount % 10 == 0) {
			shift = random()*width*0.3 - width*0.3;
		}
		textSize(width/(60 - xs.length*5));
		text("mmooore", (width*0.5) + shift, (height*0.5) + shift);
	} else {
		// Initial text. Weird that its down here...
		textSize(width/60);
		textFont("Courier");
		noStroke();
		fill(0, 5);
		if (frameCount % 7 == 0) {
			shift = random()*width*0.2 - width*0.2;
		}
		text("feed the curve", (width*0.5) + shift, (height*0.5) + shift*0.25);
	}
}

class dataPoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.xoff = map(random(1000), 0 , 1000, 0, 1);
		this.yoff = map(random(1000), 0 , 1000, 0, 1);
	}

	move() {
		this.xoff += 0.001;
		this.yoff += 0.01;
		this.x += (noise(this.xoff) - 0.5) * 0.001;
		this.y += (noise(this.yoff) - 0.5) * 0.001;
	}

	show() {
		let x = map(this.x, 0, 1, 0, width);
		let y = map(this.y, 0, 1, height, 0);
		strokeWeight(1);
		stroke(0);
		fill('#FF0077');
		let sz = max(windowWidth, windowHeight) / 28;
		ellipse(x, y, sz, sz);
	}
}

// Tensorflow functions.
const optimizer = tf.train.sgd(learningRate);

const a = tf.variable(tf.scalar(1));
const b = tf.variable(tf.scalar(1));
const c = tf.variable(tf.scalar(1));
const d = tf.variable(tf.scalar(1));
const e = tf.variable(tf.scalar(1));
const f = tf.variable(tf.scalar(1));
const g = tf.variable(tf.scalar(1));

function predict(x) {
	return tf.tidy(() => {
		return a.mul(x.pow(tf.scalar(6, 'int32')))
			.add(b.mul(x.pow(tf.scalar(5, 'int32'))))
			.add(c.mul(x.pow(tf.scalar(4, 'int32'))))
			.add(e.mul(x.pow(tf.scalar(3, 'int32'))))
			.add(e.mul(x.square()))
			.add(f.mul(x))
			.add(g);
	});
}

function loss(y_hat, y) {
	const error = y_hat.sub(y).square().mean();
	return error;
}

async function train(x, y, iters) {
	x = tf.tensor(x);
	y = tf.tensor(y);
	for (let i = 0; i < iters; i++) {
		optimizer.minimize(() => {
			const pred = predict(x);
			return loss(pred, y);
		});
		await tf.nextFrame();
	}
}
