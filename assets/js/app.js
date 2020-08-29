// @TODO: YOUR CODE HERE!

var svgWidth = 1200;
var svgHeight = 660;
console.log("hi there");
var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
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

var chosenXAxis = "poverty"
var chosenYAxis = "obesity"

function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    console.log("within the function")
    return xLinearScale;
}

function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
        ])
        .range([0, width]);

    return yLinearScale;
}

//setup functions to update the xAxis and yAxis on click

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxes(newYScale, YAxis) {
    var bottomAxis = d3.axisBottom(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;
    var yLabel;
    console.log("calling tooltip1")
    if (chosenXAxis === "poverty") {
        xLabel = "In Poverty (%):";
    }
    else if (chosenXAxis == "age") {
        xLabel = "Age (Media):";
    }
    else {
        xLabel = "Household Income (Median):"
    }

    if (chosenYAxis === "obesity") {
        yLabel = "Obese(%):";
    }
    else if (chosenYAxis == "smokes") {
        yLabel = "Smokes(%):";
    }
    else {
        yLabel = "Lacks-Healthcare (%):"
    }
    console.log("calling tooltip2")
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>
            ${xLabel} ${d[chosenXAxis]}<br>
            ${yLabel} ${d[chosenYAxis]}`);
        });
        console.log("calling tooltip3")
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

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
    console.log("here")
    // create x and y scales

    // var xLinearScale = xScale(healthData, chosenXAxis)

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty), d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.smokes), d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    // Create axis functions
    console.log("here1")
    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to the chart

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circles for data

    var circleRadius = 15

    var circlesGroup = chartGroup.append("g").selectAll("g")
        .data(healthData)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            console.log("d.poverty", d.abbr, d.poverty)
            return "translate(" + xLinearScale(d.poverty) + "," + yLinearScale(d.smokes) + ")"
        });

    var circle = circlesGroup
        .append("circle")
        .attr("r", circleRadius)
        .classed("stateCircle", true);

        circlesGroup.append("text")
        .style("text-anchor", "middle")
        .classed("stateText", true)
        // .attr("dx", function(d){return -10})
        .attr("dy", function (d) { return circleRadius - 10 })
        .text(d => d.abbr)

    // Append axes titles
        //need to make groups for each of the sets of labels

    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .style("font-weight", "bolder")

    var povertyLabel = xLabelsGroup.append("text")
       // .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
        .classed("aText", true)
        .text("In Poverty (%)");

       var ageLabel =  xLabelsGroup.append("text")
        .attr("dy", "1.5em")
       // .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
        .classed("aText", true)
        .text("Age (Median)");

       var obesityLabel = xLabelsGroup.append("text")
        .attr("dy", "3em")
       // .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
        .classed("aText", true)
        .text("Household Income (Median)");

        var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate( ${0 - margin.left+70}, ${0 + (height / 2)} )` + " rotate(-90)")
        .style("font-weight", "bolder")

        var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .text("Obesity (%)");

        var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .attr("dy", "-1.5em")
        .text("Smokes (%)");

        var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .attr("dy", "-3em")
        .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenXAxis, circlesGroup);



})
