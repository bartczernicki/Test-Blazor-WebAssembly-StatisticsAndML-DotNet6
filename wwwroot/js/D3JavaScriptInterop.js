function countUnique(iterable) {
    return new Set(iterable).size;
}

function formatPower(x) {
    return x;
}

function createD3SvgObject(data, mean, title) {

    console.log(data);
    //https://datacadamia.com/viz/d3/histogram#instantiation
    //http://bl.ocks.org/nnattawat/8916402

    var svgTest = d3.select("#my_dataviz");
    svgTest.selectAll("*").remove();

    // Set the margins
    var margin = { top: 30, right: 30, bottom: 40, left: 50 },
        width = 370 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom;

    // For some distributions, ensure 0 placeholder at midpoint is available
    var min = 0;
    var dataMinimum = d3.min(data);
    if (dataMinimum == 0) {
        min = -1;
    };
    max = d3.max(data);
    domain = [min, max];

    // The number of bins, for statistics & sampling it should be set to number of unique bins
    Nbin = max; //countUnique(data);
    var samplesCount = data.length;

    var x = d3
        .scaleLinear()
        .domain(domain)
        .range([0, width]);

    var histogram = d3
        .histogram()
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(Nbin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    var color = "steelblue";
    var yBinMin = d3.min(bins, function (d) { return d.length });
    var yBinMax = d3.max(bins, function (d) { return d.length });
    var colorScale = d3.scaleLinear()
        .domain([yBinMin, yBinMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    // Add the svg element to the body and set the dimensions and margins of the graph
    var svg = d3
        .select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style('background-color', 'WhiteSmoke')
        .append("g")
            .attr('class', 'bars')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Y-AXIS
    // Add 10% to Y-axis
    var yMax = 1.1 * d3.max(bins, function (d) {
        return d.length / samplesCount;
    });

    var y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, yMax]);

    yAxisLeft = d3.axisLeft(y);

    svg.append("g").call(yAxisLeft);

    // X-AXIS
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.selectAll(".tick")
        .attr("opacity", function (d) {
            if (d < 0) {
                return 0;
            }
        })



    // Only render bins/visual elements that are non-zero
    var binsNonZero = bins.filter(bins => bins.length > 0);

    // Add bars
    var bar = svg.selectAll(".bar")
        .data(binsNonZero)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(0) + ")"; });

    bar.append("rect")
        .attr("x", function (d) {
            return -(x(d.x1) - x(d.x0)) / 2 + 1;
        })
        // Ensure width of bars is 0 or positive
        .attr("width", function (d) {
            var calculatedWidth = x(d.x1) - x(d.x0) - 1;

            if (calculatedWidth >= 0) {
                return calculatedWidth;
            }
            else {
                return 0;
            }
        })
        //.attr("height", function (d) {
        //    return height - y(d.length);
        //})
        .attr("height", function (d) {
            return 0;
        })
        .style("fill", function (d) {
            return colorScale(d.length)
        });

    // Animations
    svg.selectAll("rect")
        .transition()
        .duration(100)
        .attr("height", function (d) { return height - y(d.length / samplesCount); })
        .delay(function (d, i) {
            //console.log(i + " - " + (height - y(d.length)));
            return (i * 50);
        })
    svg.selectAll(".bar")
        .transition()
        .duration(100)
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length / samplesCount) + ")"; })
        .delay(function (d, i) {
            // console.log(i + " - " + (height - y(d.length)));
            return (i * 50);
        })

    //bar.append("text")
    //    .attr("dy", ".75em")
    //    .attr("y", -10)
    //    .attr("x", function (d) { return (d.x1 - d.x0); })
    //    .attr("dx", ".5em")
    //    .style("font-size", "10px")
    //    .text(function (d) { if (d.length > 0) { return d.length } });

    // Add line for mean
    svg
        .append("line")
        .attr("x1", x(mean))
        .attr("x2", x(mean))
        .attr("y1", y(0))
        .attr("y2", y(yMax))
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "4")
    // Add text for mean label
    svg
        .append("text")
        .attr("x", x(mean) + 2)
        .attr("y", y(yMax) + 10)
        .text("Dist Mean: " + mean)
        .style("font-size", "8px")


    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom/1.25)
        .text("Count of observations")
        .style("font-size", "9px")
        .style("font-weight", "bold");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 45)
        .attr("x", (height/2))
        .attr("transform", "rotate(90)")
        .text("Probability")
        .style("font-size", "10px")
        .style("font-weight", "bold");

    svg
        .append("text")
        .attr("class", "title")
        .attr("x", width / 2) //positions it at the middle of the width
        .attr("y", -margin.top / 3) //positions it from the top by the margin top
        .attr("font-family", "'Monotype Corsiva','Apple Chancery','ITC Zapf Chancery','URW Chancery L',cursive")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text(title);
}