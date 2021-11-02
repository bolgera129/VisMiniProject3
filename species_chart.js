export default function BarChart(container) {

  const margin = {top: 20, right: 20, bottom: 70, left: 75};
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const xScale = d3.scaleBand()
    .range([0, width]);
  const yScale = d3.scaleLinear()
    .range([height, 0]);    

  const xAxis = d3.axisBottom().scale(xScale)
  const yAxis = d3.axisLeft().scale(yScale); 

  const svg = d3
    .select(container)
    .attr("class", "svg-bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

  const x_axis = svg.append("g")
    .attr("class", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(${margin.left - 10 }, ${height+margin.top+ 15})`);

  const y_axis = svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .attr("transform", `translate(${margin.left - 10} , ${margin.top +15 })`);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -140)
    .attr("y", 15)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Threatened Species");  

  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2 + 60) + " ," + (height + margin.top + 50) + ")")
    .style("text-anchor", "middle")
    .text("Species Type");

  const heading = svg.append("text")
    .attr("class", "axis-title")
    .attr("transform",
          "translate(" + (width/2 + 60) + " ," + (height + margin.top - 205) + ")")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")

  function update(data, year, country) {

    if (country != null) 
      {const filteredData = data.filter(d => d.Country == country && d.Year == year && d.Series != "Threatened Species: Total (number)");

      xScale.domain(filteredData.map(function(d) {return d.Series.substring(20,((d.Series.length) - 9));}))
      yScale.domain([0, parseFloat(d3.max(filteredData, d=>d.Value))])

      x_axis.transition()
        .call(xAxis)

      y_axis.transition()
        .call(yAxis)

      heading.text("Threatened Species in " + country + " in " + year)
          
      const bars = svg.selectAll("rect") 
        .data(filteredData)

      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition()
        .attr("x", (function(d) { return xScale(d.Series.substring(20,((d.Series.length) - 9)))}))
        .attr("y", (function(d) { return yScale(d.Value)}))
        .attr("width", 100)
        .attr("height", function(d) { return height - yScale(d.Value); })
        .attr("transform", `translate(${margin.left + 5} , ${margin.top +15 })`)
        .attr("fill", "lightblue")
      
      bars.exit().remove();

      const tooltip_bars = svg.selectAll("rect")

      tooltip_bars.on("mouseover", function(event, d) {
        const pos = d3.pointer(event, window);
        d3.select("#bar-tooltip")
            .style("left", pos[0] + "px")
            .style("top", pos[1] + "px")
          .select("#value")
          .html(d.Value + " Threatened " + d.Series.substring(20,((d.Series.length) - 9)))      
        d3.select("#bar-tooltip").classed("hidden", false);
      })
      .on("mouseout", function(d) {
        d3.select("#bar-tooltip").classed("hidden", true);
      });
    }
  }

  return {
    update
  }
}
