var entities = [];
var foods = [];
var total = 50;

////////////
// SETUP  //
////////////

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	ellipseMode(RADIUS);

	for(var i=0; i < total; i++){
			entities.push(new Entity(random(windowWidth), random(windowHeight), random(), random(), random()));
			if(i % 4 == 0) {
				foods.push(new Food(random(windowWidth), random(windowHeight), random(), random()));
				}
		}
}

////////////
//  DRAW  //
////////////

function draw() {
	background(200);

	for(var i=0; i < foods.length; i++) {
		foods[i].show();
	}

	for(var i=0; i < entities.length; i++){
		entities[i].move();
		entities[i].bounce();
		//entities[i].bounce();
		entities[i].show();
		for(var j=0; j < entities.length; j++) {
			if(entities[i] != entities[j]) {
				entities[i].repel(entities[j]);
			}
		}
	}
}

////////////
// ENTITY //
////////////

function Entity(x_, y_, p_, a_, s_) {
	this.acc    = createVector(0, 0);
	this.vel    = createVector(0, 0);
	this.loc    = createVector(x_, y_);
	this.ploc   = [];
	this.off    = random(999999);
	this.prt    = p_;
	this.acid   = a_;
	this.rds    = map(this.acid, 0, 1, 5, 20);
	this.mxvel  = map(this.acid * this.acid, 0, 1, 1, 0.1);
	this.sex    = s_ > 0.8;

	this.show = function() {
		noStroke();
		fill(220, 255, 220, 100);
		if(this.sex) fill(255, 220 , 220, 100);
		var nois = map(noise((frameCount + this.off)/100), 0, 1, -5, 5);
		ellipse(this.ploc[0].x, this.ploc[0].y, this.rds + nois, this.rds + nois);
		fill(0, 50, 0);
		if(this.sex) fill(150, 0 , 0);
		ellipse(this.loc.x, this.loc.y, 2 + nois, 2 + nois);
	}

	this.move = function() {
		// Store location.
		this.ploc.push(this.loc);
		if (this.ploc.length > 20) this.ploc.shift();
		// Absorve forces.
		this.vel.add(this.acc);
		this.vel.limit(this.mxvel);
		this.loc.add(this.vel);
		// Reset acceleration.
		this.acc.mult(0);
	}

	this.applyForce = function(f) {
		this.acc.add(f);
	}

	this.repel = function(e) {
		var f = p5.Vector.sub(this.loc, e.loc);
		var dist = f.mag();
		f.normalize();
		if(this.sex == 0 && e.sex == 1) {
			var strength = -(0.05 * this.rds * e.rds) / (dist*dist);
		} else if(this.sex == 1 && e.sex == 0) {
			var strength = (0.2 * this.rds * e.rds) / (dist*dist);
		} else if(this.sex == 0 && e.sex == 0) {
			var strength = (0.05 * this.rds * e.rds) / (dist*dist);
		}
		f.mult(strength);
		this.applyForce(f);
	}

	this.bounce = function() {
		var f = createVector(0,0)
		if(this.loc.x  + this.rds <= 0) f.add(createVector(5,0));
		if(this.loc.x  + this.rds >= windowWidth) f.add(createVector(-5,0));
		if(this.loc.y  + this.rds <= 0) f.add(createVector(0,5));
		if(this.loc.y  + this.rds >= windowHeight) f.add(createVector(0,-5));
		this.applyForce(f);
	}

	this.wrap = function() {
	}
}


////////////
//  FOOD  //
////////////

function Food(x_, y_, p_, a_) {
	this.x = x_;
	this.y = y_;
	this.prt = p_;
	this.acid = a_;
	this.col = map(this.acid, 0, 1, 100 , 155);

	this.show = function() {
		noStroke();
		fill(0);
		ellipse(this.x, this.y, 5, 5);
	}
}
