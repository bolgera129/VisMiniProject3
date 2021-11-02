export default function barChart(container, year, country, data) {
    console.log(year)
    console.log(country)
   
    const filteredData = data.filter(d=> d.Country === country &&d.Year === year);
   
      // Create SVG
      let outerWidth = 450
      let outerHeight = 300
      let margin = {top: 10, bottom: 10, left: 0, right: 10}
      let width = outerWidth - margin.left - margin.right
      let height = outerHeight - margin.top - margin.bottom
  
      const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

// AXIS
let x = d3
  .scaleBand()
  .range([0, width])

let y = d3.scaleLinear().range([height, 0]);

let xAxis = d3
  .axisBottom()
  .scale(x)
  

let yAxis = d3.axisLeft().scale(y);

let xAxisGroup = svg.append("g").attr("class", "x-axis axis");

let yAxisGroup = svg.append("g").attr("class", "y-axis axis");


  x.domain(
    filteredData.map(function(d) {
      return d.Series;
    })
  );
  y.domain([
    0,
    d3.max(filteredData, function(d) {
      return d.Value;
    })
  ]);

  // ---- DRAW BARS ----
  let bars = svg
    .selectAll(".bar")
    .remove()
    .exit()
    .data(filteredData);

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.Series);
    })
    .attr("y", function(d) {
      return y(d.Value);
    })
    .attr("height", function(d) {
      return height - y(d.Value);
    })
    .attr("width", x.bandwidth())
    

  // ---- DRAW AXIS	----
  xAxisGroup = svg
    .select(".x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  yAxisGroup = svg.select(".y-axis").call(yAxis);

  svg.select("text.axis-title").remove();
  svg
    .append("text")
    .attr("class", "axis-title")
    .attr("x", -5)
    .attr("y", -15)
    .attr("dy", ".1em")
    .style("text-anchor", "end")
    .text("title");
}

