var circles = [];
var capture;
var w = 960;
var h = 720;
var f = 15;

function setup() {
  // Mode and canvas.
  var canvas = createCanvas(w, h);
  pixelDensity(1);
  // Try to load webcam.
  try {
    capture = createCapture(VIDEO);
    canvas.parent('sketch-holder');
  } catch(err) {
    error_msg = createP('Your current browser does not support webcam access. Please use either Chrome or Firefox.');
    error_msg.parent('sketch-holder');
    error_msg.style('font-family', 'monospace');
  }
  capture.size(round(w/f), round(h/f));
  capture.hide();
  // Create circles.
  for(var x=1; x<w/f; x++) {
    for(var y=1; y<h/f; y++) {
      circles.push(new Circle(x, y));
    }
  }
}

function draw() {
  background(255, 245, 245);
  capture.loadPixels();
  //console.log(circles);
  for(var i=0; i < circles.length; i++) {
    circles[i].show();
    //circles[i].grow();
  }
}

function Circle(x_, y_) {
  this.x = x_;
  this.y = y_;
  this.rds = random(f*0.5, f);
  this.sign = 1;

  this.show = function() {
    this.r = capture.pixels[(this.x + this.y * capture.width) * 4 + 0];
    this.g = 0;//capture.pixels[(this.x + this.y * capture.width) * 4 + 1];
    this.b = 0;//capture.pixels[(this.x + this.y * capture.width) * 4 + 2];
    this.bright = this.r;
    this.rds = map(this.bright, 0, 255, f, f*0.1) + noise(frameCount/10000);

    noStroke();
    fill(this.r,this.g,this.b);
    ellipse(this.x * f, this.y * f, this.rds, this.rds);
  }

  this.grow = function() {
    this.rds += this.sign * 0.01;
    if (this.rds >= f || this.rds <= f*0.5) {
      this.sign *= -1;
    }
  }
}
