/*----------------
	---MARKOV CH.---
	----------------*/
// Functions and prototype changes.
String.prototype.tokenize = function() {
	return this.split(/\s+/);
}

Array.prototype.pick = function() {
	var w = floor(random(this.length));
	return this[w];
}

function Markov(n, long) {
	this.n = n;
	this.long = long;
	this.ngrams = {};
	this.beginnings = [];

	// What consumes the text.
	this.feed = function(text) {
		tokens = text.tokenize();
		// Discard smaller than n lines.
		if(tokens.length < this.n) {
			return False;
		}
		// Get starting words.
		var begins = tokens.slice(0, this.n).join(' ');
		this.beginnings.push(begins);
		// Generate frequency dictionary.
		for(var i=0; i<tokens.length - this.n; i++) {
			gram = tokens.slice(i, i + this.n).join(' ');
			next = tokens[i + this.n];
			// Add to dictionary.
			if(!this.ngrams[gram]) {
				this.ngrams[gram] = [];
			}
			this.ngrams[gram].push(next);
		}
	}
	// Create new text.
	this.generate = function() {
		// Select starting ngram.
		var current = this.beginnings.pick();
		output = current.tokenize();
		for(var i=0; i < this.long; i++) {
			// Add one of the possible choices to output.
			possibles = this.ngrams[current];
			if(possibles) {
				chosen = possibles.pick();
				output.push(chosen);
				current = output.slice(output.length - this.n, output.length).join(' ');
			}
		}
		return(output);
	}
}

function setup() {
	noCanvas();
	var min_length = 100;
	var sources_url = 'https://newsapi.org/v1/sources?language=en';
	var key = 'b28fdd2635fa45e998cd2f93e7e08396';
	var sorting = ['top'];//, 'latest','popular'];
	var header = new Markov(1, 10);
	var paragraph = new Markov(1, min_length);

	console.log('About to read sources.');
	loadJSON(sources_url, start);

	// Generate news article.
	setTimeout(function(){
		html_header = header.generate();
		h = createElement('h2', html_header.join(' '));
		html_par = paragraph.generate();
		while(html_par.length < min_length) {
			complementary = paragraph.generate();
			html_par = html_par.concat(complementary);
		}
		p = createP(html_par.join(' '));
		p.class('content');
}, 1000);

	// Function to read sources.
	function start(sources) {
		for(var s=0; s<sources.sources.length; s++) {``
			var url = 'https://newsapi.org/v1/articles?source=' + sources.sources[s].id + '&apiKey=' + key;
			loadJSON(url, loadData);
		}
	}
	// Function to feed the model.
	function loadData(data) {
		for(var j=0; j<data.articles.length; j++) {
			title = data.articles[j].title;
			//console.log('About to feed title.');
			header.feed(title);
			content = data.articles[j].description;
			if(content) {
				if(content.length > 20) {
					paragraph.feed(content);
				}
			}
		}
	}
}

	// var params = {
	//   apiKey: 'b28fdd2635fa45e998cd2f93e7e08396',
	// 	source: 'techcrunch'
	// }
	// // Make call.
	// httpGet('https://newsapi.org/v1/articles', params, finished);
	//
	// // Display results.
	// function finished(response) {
	//   console.log(response);
	// 	console.log(response.length)
	// }

//function draw() {

//}
