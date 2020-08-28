// @TODO: YOUR CODE HERE!

var svgWidth = 1200;
var svgHeight = 660;
console.log("hi there");
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

//Let's decide the variables to use for the x and y axes
//x axes
// In Poverty (%)
//Age (Media)
// Household Income (Median)

//y axes
//Obese(%)
//Smokes(%)
//Lacks-Healthcare (%)

// append svg and group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//setup functions to scale the x axis and y axis upon selection of axis

var chosenXAxis = "In Poverty (%)"
var chosenYAxis = "Obese(%)"

function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

function yScale(healthData, chosenXAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
        ])
        .range([0, width]);

    return yLinearScale;
}

//setup functions to update the xAxis and yAxis on click

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  function renderAxes(newYScale, YAxis) {
    var bottomAxis = d3.axisBottom(newYScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating circles group with a transition to
  // new circles
  



function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  



var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//  Import the data and start the promise

d3.csv("./assets/data/data.csv").then(function (healthData) {
    console.log("healthData", healthData);
    console.log([healthData]);

    //tidy data to make sure it is all numbers

    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMo
        data.age = +data.age
        data.ageMoe = +data.ageMoe
        data.income = +data.income
        data.incomeMoe = +data.incomeMoe
        data.healthcare = +data.healthcare
        data.healthcareLow = +data.healthcareLow
        data.healthcareHigh = +data.healthcareHigh
        data.obesity = +data.obesity
        data.obesityLow = +data.obesityLow
        data.obesityHigh = +data.obesityHigh
        data.smokes = +data.smokes
        data.smokesLow = +data.smokesLow
        data.smokesHigh = +data.smokesHigh

    })

    // create x and y scales
    var xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty), d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.smokes), d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    // Create axis functions

    var bottomAxis = d3.axisBottom(xScale);

    var leftAxis = d3.axisLeft(yScale);

    //append axes to the chart

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circles for data

    var circleRadius = 15

    var circleContainer = chartGroup.selectAll("g")
        .data(healthData)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + xScale(d.poverty) + "," + yScale(d.smokes) + ")"
        });

    var circle = circleContainer
        .append("circle")
        .attr("r", circleRadius)
        .classed("stateCircle", true)

    circleContainer.append("text")
        .style("text-anchor", "middle")
        .classed("stateText", true)
        // .attr("dx", function(d){return -10})
        .attr("dy", function (d) { return circleRadius - 10 })
        .text(d => d.abbr)

    // Append axes titles
    chartGroup.append("text")
        .style("font-weight", "bolder")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
        .classed("aText", true)
        .text("Poverty");

    chartGroup.append("text")
        .style("font-weight", "bolder")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Smokes");





})
