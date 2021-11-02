export default function barChart(container, year, country, data) {
    console.log(year)
    console.log(country)
   
   
    const filteredData = data.filter(d=> d.Country == country &&d.Year == year &&d.Series != "Threatened Species: Total (number)");


    const margin = {top: 20, right: 20, bottom: 70, left: 75};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const xScale = d3.scaleBand().domain(filteredData.map(function(d) {return d.Series.substring(20,((d.Series.length) - 9));})).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, parseFloat(d3.max(filteredData, d=>d.Value))]).range([height, 0]);
 
    d3.select('#svg-bar').remove();

    const xAxis = d3.axisBottom().scale(xScale)
    const yAxis = d3.axisLeft().scale(yScale); 


      const svg = d3
        .select(container)
        .attr("class", "svg-bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        


svg.append("g")
.attr("class", "x-axis")
.call(xAxis)
.attr("transform", `translate(${margin.left - 10 }, ${height+margin.top+ 15})`);

svg.append("g")
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

      svg.append("text")
        .attr("class", "axis-title")
        .attr("transform",
              "translate(" + (width/2 + 60) + " ," + (height + margin.top - 205) + ")")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Threatened Species in " + country + " in " + year)
        

  
   
  svg.selectAll(".bar")
    .data(filteredData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (function(d) { return xScale(d.Series.substring(20,((d.Series.length) - 9)))}))
    .attr("y", (function(d) { return yScale(d.Value)}))
    .attr("width", 100)
    .attr("height", function(d) { return height - yScale(d.Value); })
    .attr("transform", `translate(${margin.left + 5} , ${margin.top +15 })`)
    .attr("fill", "lightblue")
    .on("mouseover", function(event, d) {
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
