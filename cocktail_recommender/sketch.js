var width = 1000;
var height = 1000;

// Create SVG canvas.
var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Define colors.
var colors1 = d3.scaleOrdinal(d3.schemeAccent);
var colors2 = d3.scaleOrdinal(d3.schemeDark2);

// Create force layout.
var simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(function(d) {return d.id}))
  .force('charge', d3.forceManyBody(-40))
  .force('center', d3.forceCenter(width/2, height/2))
  //.force('x', d3.forceX(width/2))
  //.force('y', d3.forceY(height/2))
  .force('collide', d3.forceCollide().radius(function(d) {return Math.pow(d.size, 1/1.9)}));

// Dragging events.
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
function highlight(d, i) {
  d3.select(this)
    .attr('fill', 'rgba(0, 0, 0, 1)')
    .attr('font-size', 12);
}
function deHighlight(d, i) {
  d3.select(this)
    .attr('fill', 'rgba(255, 255, 255, 0.50)')
    .attr('font-size', 8);
}

//Read file and start.
d3.json('graph_new.json', function(error, graph) {
  if (error) throw error;

  // Ticked function.
  function ticked() {
    link
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

    node
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; });

    label
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });
  };

  var link = svg.append('g')
    .attr('class', 'link')
    .selectAll('line')
    .data(graph.links)
    .enter().append('line')
    .attr('stroke-width', function(d) {return 0});

  var node = svg.append('g')
    .attr('class', 'node')
    .selectAll('circle')
    .data(graph.nodes)
    .enter().append('circle')
    .attr('r', function(d) { return Math.pow(d.size, 1/2); })
    .style('fill', function(d) { return colors2(d.cluster); })
    .style('stroke', 'black')//function(d) { return colors1(d.base); })
    .style('stroke-width', 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  var label = svg.append('g')
    .selectAll('.label')
    .data(graph.nodes)
    .enter().append('text')
    .attr('class', '.label')
    .attr('text-anchor', 'right')
    .attr('font-size', 8)
    .attr('font-family', 'sans-serif')
    .attr('fill', 'rgba(255, 255, 255, 0.50)')
    .text(function(d) { return d.id; })
    .on('mouseover', highlight)
    .on('mouseout', deHighlight);

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(graph.links);

});
