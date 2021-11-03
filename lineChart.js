
export default function LineChart(container,data) {
    // Create SVG, scales, axes, etc.

    //create SVG
    const margin = {top: 20, right: 20, bottom: 75, left: 100};
    const width = 550 - margin.left - margin.right;
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
    var series = new Set();
    for (let obj of data) {
        years.add(d3.timeFormat("%Y")(parseTime(obj.Year)));
        series.add(obj.Series);
    }

    const years_arr = [...years]


    const xScale = d3.scaleLinear()
        .range([0, width])

        const yScale = d3.scaleLinear()
        .range([height, 0])


    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"))
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
          "translate(" + (width/2 + 60) + " ," + (height + margin.top + 60) + ")")
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
        d3.selectAll(".remove").remove();

        if (country != null) {
        const filteredData = data.filter(d => d.Country === country)
        filteredData.forEach(d => d.Year = d3.timeFormat("%Y")(parseTime(d.Year)))
        filteredData.forEach(d => d.Value = parseFloat(d.Value))

       
        xScale.domain(d3.extent(filteredData, d=>d.Year))
        yScale.domain([0, parseFloat(d3.max(filteredData, d=>d.Value))])

        // yScale.domain([0, parseFloat(d3.max(data, d=>d.Value))])
  
        x_axis.transition()
          .call(xAxis)
  
        y_axis.transition()
          .call(yAxis)
  
        heading.text("Threatened Species in " + country)

        const sumstat = d3.group(filteredData, d => d.Series);
        const color = d3.scaleOrdinal()
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3'])
    

    
      var lines = svg.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("class", "remove")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("data-legend",function(d) { return d.Series})
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return xScale(d.Year) + (margin.left - 10) })
            .y(function(d) { return yScale(+d.Value) + (margin.top +15) })
            (d[1])
        })
      
      svg.append('rect')
        .data(filteredData)
        .attr("transform", "translate(" + (margin.left - 10) + "," + (margin.top + 15) + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr('opacity',0)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove);
      
      function mouseover() {
        d3.selectAll('.points text').style("display", null);
      }
      function mouseout(e) {
        d3.selectAll('.points text').style("display", "none");
        d3.selectAll(".tt").remove()
      }
      function mousemove(e) {
        d3.selectAll(".vline").remove()
        d3.selectAll(".tt").remove()

        var bisectYear = d3.bisector(function(d) { return d})
        var point = d3.pointer(e,svg.node());
        const pointX = ((point[0]-90)/width*(2020-2004) +2004)
        const year_i = bisectYear.left(years_arr,pointX)
        const year = years_arr[year_i]

        svg.append("line")
        .attr("x1", xScale(year))
        .attr("y1", 0)
        .attr("x2", xScale(year))
        .attr("y2", height)
        .style("stroke-width", 1)
        .style("stroke", "black")
        .attr("class", "tt")
        .style("fill", "none")
        .attr("transform", "translate(" + (margin.left - 10) + "," + (margin.top + 15) + ")")

        svg
        .append("rect")
        .attr("width", 100)
        .attr("height", 70)
        .attr("class", "tt")
        .attr("fill", "black")
        .attr("opacity", .75)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("x", (point[0] + 15))
        .attr("y", (point[1] - 105))
        var tt_data = filteredData.filter(d => d.Year == year)

        svg.selectAll("#line-tooltip")
        .data(tt_data)
        .enter()
        .append("text")
        .attr("class", "tt")
        .attr("x", (point[0] + 20))
        .attr("y", (d,i) => ((point[1] - 80 + 12*i)))
        .html((d,i) => `${d.Series.substring(20,((d.Series.length) - 9))}: ${d.Value}`)
        .style("font-size", "10px")
        .style("fill", "white")

        svg.append("text")
        .attr("class", "tt")
        .attr("x", (point[0] + 20))
        .attr("y", ((point[1] - 92)))
        .html(`Year: ${year}`)
        .style("font-size", "10px")
        .style("fill", "white")
      }
      
      
      


      svg.selectAll("myrec")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("width", 75)
        .attr("height",  65)
        .attr("x", 465)
        .attr("y", 15)
        .attr("class", "myrec")
        .style("fill","white")
        .style("opacity",.5)


      svg.selectAll("mydots")
        .data(sumstat)
        .enter()
        .append("circle")
          .attr("cx", 475)
          .attr('class', "dots")
          .attr("cy", function(d,i){ return 25 + i*15})
          .attr("r", 3)
          .style("fill", function(d){ return color(d[0])})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
        .data(sumstat)
        .enter()
        .append("text")
        .attr("class", "labels")
          .attr("x", 480)
          .attr("y", function(d,i){ return 27 + i*15})
          .style("fill", function(d,i){ return color(d[0])})
          .style("font-size", "10px")
          .text(function(d){ 
            return d[0].substring(20,((d[0].length) - 9))
          })
          .attr("text-anchor", "left")
      }
    }

    // Add another line with data of given species type after bar is clicked 
    function updateType(data, type, country) {
        // Remove whatever second line is already there (if any) and add one for particular type of species counts over time
        d3.selectAll(".remove").remove();
        d3.selectAll(".dots").remove();
        d3.selectAll(".labels").remove();
        d3.selectAll(".tt").remove();
        if (type != null) {
            const filteredData = data.filter(d => d.Country === country && d.Series == type)
            filteredData.forEach(d => d.Year = d3.timeFormat("%Y")(parseTime(d.Year)))
            filteredData.forEach(d => d.Value = parseFloat(d.Value))
    
            xScale.domain(d3.extent(filteredData, d=>d.Year));
            yScale.domain([0, parseFloat(d3.max(filteredData, d=>d.Value))])
          
            x_axis.transition()
              .call(xAxis)
      
            y_axis.transition()
              .call(yAxis)
      
            heading.text("Threatened " + `${type.substring(20,((type.length) - 9))} ${country} `)
    
            const sumstat = d3.group(filteredData, d => d.Series); // nest function allows to group the calculation per level of a factor
            const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3'])
        
    
          
            svg.selectAll(".line")
            .data(sumstat)
            .join("path")
              .attr("class", "remove")
              .attr("fill", "none")
              .attr("stroke", function(d){ return color(d[0]) })
              .attr("stroke-width", 1.5)
              .attr("data-legend",function(d) { return d.Series})
              .attr("d", function(d){
                return d3.line()
                  .x(function(d) { return xScale(d.Year) + (margin.left - 10) })
                  .y(function(d) { return yScale(+d.Value) + (margin.top +15) })
                  (d[1])
              })
              svg.append('rect')
              .data(filteredData)
              .attr("transform", "translate(" + (margin.left - 10) + "," + (margin.top + 15) + ")")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", height)
              .attr('opacity',0)
              .on("mouseover", mouseover)
              .on("mouseout", mouseout)
              .on("mousemove", mousemove);
            
            function mouseover() {
              d3.selectAll('.points text').style("display", null);
            }
            function mouseout(e) {
              d3.selectAll('.points text').style("display", "none");
              d3.selectAll(".tt").remove()
            }
            function mousemove(e) {
              d3.selectAll(".tt").remove()
      
              var bisectYear = d3.bisector(function(d) { return d})
              var point = d3.pointer(e,svg.node());
              const pointX = ((point[0]-90)/width*(2020-2004) +2004)
              const year_i = bisectYear.left(years_arr,pointX)
              const year = years_arr[year_i]
      
              svg.append("line")
              .attr("x1", xScale(year))
              .attr("y1", 0)
              .attr("x2", xScale(year))
              .attr("y2", height)
              .style("stroke-width", 1)
              .style("stroke", "black")
              .attr("class", "tt")
              .style("fill", "none")
              .attr("transform", "translate(" + (margin.left - 10) + "," + (margin.top + 15) + ")")
      
              svg
              .append("rect")
              .attr("width", 100)
              .attr("height", 32)
              .attr("class", "tt")
              .attr("fill", "black")
              .attr("opacity", .75)
              .attr("x", (point[0] + 15))
              .attr("y", (point[1] - 105))
              var tt_data = filteredData.filter(d => d.Year == year)
      
              svg.selectAll("#line-tooltip")
              .data(tt_data)
              .enter()
              .append("text")
              .attr("class", "tt")
              .attr("x", (point[0] + 20))
              .attr("y", (d,i) => ((point[1] - 80 + 12*i)))
              .html((d,i) => `${d.Series.substring(20,((d.Series.length) - 9))}: ${d.Value}`)
              .style("font-size", "10px")
              .style("fill", "white")
      
              svg.append("text")
              .attr("class", "tt")
              .attr("x", (point[0] + 20))
              .attr("y", ((point[1] - 92)))
              .html(`Year: ${year}`)
              .style("font-size", "10px")
              .style("fill", "white")
            }
          }
    }

    return {
        updateCountry,
        updateType
    }

    
}

