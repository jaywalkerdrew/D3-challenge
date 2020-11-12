// SVG container size
var svgWidth = 900;
var svgHeight = 650;

// Container margins
var margin = {
  top: 20,
  right: 40,
  bottom: 80, // Could use 60?
  left: 60
};

// Chart area minus the margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating the SVG container
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Adjusting everything to the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the CSV
d3.csv("data.csv").then(function(startData) {
    
    // Parse the necessary data
    startData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    // Shortcut mapping
    var povData = startData.map(d => d.poverty);
    var smokeData = startData.map(d => d.smokes);

    // Creating the x and y scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(povData)-1 , d3.max(povData)+1])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(smokeData)-1, d3.max(smokeData)+1])
        .range([height, 0]);

    // Setting our axes
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(20);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(20);

    // Appending the axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g").call(leftAxis);

    // Generating the base circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(startData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "12")
        .attr("opacity", "0.75");

    // Generating the text labels
    chartGroup.append("g")
        .selectAll("text")
        .data(startData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.smokes)+4)
        .style("font-size", "10px");

    // Generate the tooltip and add it to the SVG
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([100,0])
        .html(d => {
            return `<strong>${d.state}<strong><br>Poverty: ${d.poverty}%<br>Smoking: ${d.smokes}%`;
        });
    
    svg.call(toolTip);
    
    // Create the mouseover listener to bring up the tooltip
    circlesGroup
        .on("mouseover", function(d) {
            toolTip.show(d, this); 
        })
        .on("mouseout", function(d) {
            toolTip.hide(d);
        })
    
    // Label the axes
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
        .attr("class", "axisText")
        .text("Poverty %"); 
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smoking %");

    })
    
    // Just in case
    .catch(function(error) {
        //do nothing
});
