var margin = {top: 20, right: 20, bottom: 50, left: 20},
    width = $(".chart").width() - margin.left - margin.right,
    height = $(".chart").height() - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(function(d) {
      return d;
    });

var svg = d3.select(".chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "main-g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var theData = {};

var currTeam = "SLN"


d3.json("js/2014stats.json", function(error, data) {
  console.log(data);
  console.log(data[5]);

  data.forEach(function(d){
    d.lastName = d.nameLast;
    //d.hits = +d['salary/H'];
    d.hits = +d.H;


    if (!theData[d.teamID]) {
      theData[d.teamID] = [];
    }

    theData[d.teamID].push(d);

  });

 



  setNav();
  drawChart();
  console.log(theData);

 }); 

function setNav() {

  $(".dropdown").change(function () {
    var val = this.value;
    currTeam = val;
    updateChart();
  });

}

function drawChart() {

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Player");
      

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .style("text-anchor", "start")
      .text("Price Per Hit");



  updateChart();

}
  
function updateChart() {

  var data = theData[currTeam];

  var players = svg.selectAll(".bar")
    .data(data, function(d) {
      return d.lastName;
    })

  x.domain(data.map(function(d) {
    return d.lastName;
  }));

  y.domain([0, d3.max(data, function(d) {
    return d.hits;
  })]).nice();

  d3.select(".x.axis")
    .transition()
    .duration(200)
    .call(xAxis)
   .selectAll("text")
    .style("text-anchor","start")
    .attr("transform","rotate(90)");

  
    players.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
          return x(d.lastName);
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(d.hits);
      })
      .attr("height", function(d) { return height - y(d.hits); });



      players.exit()
        .transition()
        .duration(200)
        .remove();

      players.transition()
        .duration(200)
        .attr("x", function(d) {
          return x(d.lastName);
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(d.hits);
      });

}







