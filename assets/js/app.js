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

// append svg and group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

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
chartGroup.exit()
    var circleRadius = 15

    var circleContainer = chartGroup.append("g").selectAll("g")
        .data(healthData)
        .enter()
        .append("g")
        // .merge(circleContainer)
        .attr("transform", function (d) {
            console.log(d.abbr, d.obesity)
            return "translate(" + xScale(d.poverty) + "," + yScale(d.smokes) + ")"
        });
        
        circleContainer.exit();

// // // //  ********************************************************** */
// // var austinTemps = [5, 59, 59, 73, 200];
// // var selection = d3.select("#content").selectAll(".temps")
// //     .data(austinTemps);

// // selection.enter()
// //     .append("div")
// //     .classed("temps", true)
// //     .merge(selection)
// //     .style("height", function(d) {
// //       return d + "px";
// //     });

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

const dataPromise = d3.csv("./assets/data/data.csv");
console.log("data promiise", dataPromise)