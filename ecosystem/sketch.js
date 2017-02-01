var entities = [];
var foods = [];
var total = 10;

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
	background(0);

	for(var i=0; i < foods.length; i++) {
		//foods[i].show();
	}

	for(var i=0; i < entities.length; i++){
		entities[i].move();
		entities[i].bounce();
		entities[i].show();
		// seeking and fleeing
		for(var j=0; j < entities.length; j++) {
			if(entities[i] != entities[j]) {
				if(entities[i].sex == 0 && entities[j].sex == 1) {
					entities[i].purse(entities[j]);
				} else if(entities[i].sex == 1 && entities[j].sex == 0) {
					entities[i].evade(entities[j]);
				}
			}
		}
	}
}

////////////
// ENTITY //
////////////

function Entity(x_, y_, p_, a_, s_) {
	// movement
	this.acc    = createVector(0, 0);
	this.vel    = createVector(0, 0);
	this.loc    = createVector(x_, y_);
	this.ploc   = [];
	// noise
	this.off    = random(999999);
	this.ctr	  = random(1000);
	// properties
	this.prt    = p_;
	this.acid   = a_;
	this.rds    = map(this.acid, 0, 1, 5, 25);
	this.mxvel  = map(this.acid * this.acid, 0, 1, 1, 0.1);
	this.sex    = s_ > 0.7;
	// female properties
	if(this.sex) {
		this.mxvel *= 1.2;
		this.rds *= 0.5;
	}

	this.show = function() {
		noStroke();
		// male vs. female
		push();
		translate(this.loc.x, this.loc.y);
		// outer shape
		fill(200,100);
		if(this.sex) fill(255, 100);
		beginShape();
		for (var a = 0; a < TWO_PI; a += PI/100) {
			var nois = noise(cos(a) + 1, sin(a) + 1, this.ctr);
			d = this.rds + map(nois, 0, 1, 0, 8);
			vertex(d * cos(a), d * sin(a));
		}
		endShape();
		// outer shape
		fill(250, 50);
		if(this.sex) fill(255, 50);
		beginShape();
		for (var a = 0; a < TWO_PI; a += PI/100) {
			var nois = noise(cos(a) + 1, sin(a) + 1, this.ctr);
			d = this.rds/3 + map(nois, 0, 1, 0, 3);
			vertex(d * cos(a), d * sin(a));
		}
		endShape();
		// reset
		pop();
		this.ctr += 0.05;
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

	// Purse red objects.
	this.purse = function(tgt) {
		// First get distance and calculate future location.
		d = p5.Vector.sub(tgt.loc, this.loc).mag();
		future_vel = tgt.vel.mult(0.001*d);
		future_loc = tgt.loc.add(future_vel);
		// Calculate desired velocity.
		desired = p5.Vector.sub(future_loc, this.loc);
		spd = map(d, 1, 10, this.mxvel, 0);
		desired.setMag(spd);
		// Apply steering force.
		steer = p5.Vector.sub(desired, this.vel);
		this.applyForce(steer);
	}

	// Evade blue objects.
	this.evade = function(tgt) {
		// First get distance and calculate future location.
		d = p5.Vector.sub(tgt.loc, this.loc).mag();
		future_vel = tgt.vel.mult(0.001*d);
		future_loc = tgt.loc.add(future_vel);
		// Calculate desired velocity.
		desired = p5.Vector.sub(future_loc, this.loc);
		spd = map(d, 1, 20, this.mxvel, 0);
		desired.setMag(spd);
		// Apply steering force.
		steer = p5.Vector.sub(desired, this.vel);
		steer.mult(-1);
		this.applyForce(steer);
	}

	/*this.repel = function(e) {
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
	}*/

	this.bounce = function() {
		var f = createVector(0,0)
		if(this.loc.x  + this.rds <= 0) f.add(createVector(5,0));
		if(this.loc.x  + this.rds >= windowWidth) f.add(createVector(-5,0));
		if(this.loc.y  + this.rds <= 0) f.add(createVector(0,5));
		if(this.loc.y  + this.rds >= windowHeight) f.add(createVector(0,-5));
		this.acc.mult(0);
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
