
export default function LineChart(container,data) {
    // Create SVG, scales, axes, etc.

    //create SVG
    const margin = {top: 20, right: 20, bottom: 70, left: 75};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
    .select(container)
    .attr("class", "svg-line")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

    //create axis

    var parseTime = d3.timeParse("%Y");

    var years = new Set();
    for (let obj of data) {
        years.add(parseTime(obj.Year));
    }


    const xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(years));
    const yScale = d3.scaleLinear()
        .range([height, 0]);    

    const xAxis = d3.axisBottom().scale(xScale)
    const yAxis = d3.axisLeft().scale(yScale); 

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
    .text("Years");

  const heading = svg.append("text")
    .attr("class", "axis-title")
    .attr("transform",
          "translate(" + (width/2 + 60) + " ," + (height + margin.top - 205) + ")")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")


    const listeners = {"click": null}

    function clicked(d) {
        listeners["click"](d.Series)
    }  


    // Function that updates line chart to different country
    function updateCountry(data, country) {
        // Remove all previous lines from SVG and add one for the total species counts over time in given country
        if (country != null) {
            const sumstat = d3.group(data, d => d.Series)
            print(sumstat)
  
        yScale.domain([0, parseFloat(d3.max(data, d=>d.Value))])
  
        x_axis.transition()
          .call(xAxis)
  
        y_axis.transition()
          .call(yAxis)
  
        heading.text("Threatened Species in " + country)

        console.log
            
        var lines = svg.selectAll("line") 
          .data(sumstat)
  
        lines
            .join("path")
            .attr("stroke",function(d){return "#377eb8"})
            .attr("stroke-width", 1.5)
            .attr("d", d => {
                return d3.line()
                  .x(d => xScale(d.Year))
                  .y(d => yScale(d.Value))
                  (d[1])
              })
          .attr("fill", "lightblue")
          svg.append("path")
        
        lines.exit().remove();
  
        lines = svg.selectAll("line")
  
        lines.on("mouseover", function(event, d) {
  
          const pos = d3.pointer(event, window);
  
          d3.select("#line-tooltip")
              .style("left", pos[0] + "px")
              .style("top", pos[1] + "px")
            .select("#value")
            .html(d.Value + " Threatened ")      
          d3.select("#line-tooltip").classed("hidden", false);
  
          d3.select(event.currentTarget)
                      .transition()
                      .duration(100)
                      .attr("fill", "lightcoral")
  
        })
        .on("mouseout", function(event, d) {
  
          d3.select("#line-tooltip").classed("hidden", true);
  
          d3.select(event.currentTarget)
                      .transition()
                      .duration(100)
                      .attr("fill", "lightblue")
        })
        .on("click", (event, d) => clicked(d))
      }
    }

    // Add another line with data of given species type after bar is clicked 
    function updateType(data, type, country) {
        // Remove whatever second line is already there (if any) and add one for particular type of species counts over time
    }

    return {
        updateCountry,
        updateType
    }
}