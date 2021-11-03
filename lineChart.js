
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
        years.add(parseTime(obj.Year));
        series.add(obj.Series);
    }
    var formattedData = []
    for (let s of series){
        let t = data.filter(d => d.Series === s)
        formattedData.push(t)
    }

    console.log(formattedData)

    const xScale = d3.scaleTime()
        .range([0, width])
    const yScale = d3.scaleLinear()
        .range([height, 0])


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
        if (country != null) {
        const filteredData = data.filter(d => d.Country === country)
        filteredData.forEach(d => d.Year = d3.timeFormat("%Y")(parseTime(d.Year)))
        filteredData.forEach(d => d.Value = parseFloat(d.Value))
        console.log(filteredData)

        xScale.domain(d3.extent(filteredData, d=>d.Year));
        yScale.domain([0, parseFloat(d3.max(filteredData, d=>d.Value))])

        // yScale.domain([0, parseFloat(d3.max(data, d=>d.Value))])
  
        x_axis.transition()
          .call(xAxis)
  
        y_axis.transition()
          .call(yAxis)
  
        heading.text("Threatened Species in " + country)

        const sumstat = d3.group(filteredData, d => d.Series); // nest function allows to group the calculation per level of a factor
        console.log(sumstat)
        const color = d3.scaleOrdinal()
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3'])
    

      
        svg.selectAll(".line")
        .data(sumstat)
        .join("path")
          .attr("fill", "none")
          .attr("stroke", function(d){ return color(d[0]) })
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
              console.log(d)
            return d3.line()
              .x(function(d) { return xScale(+d.Year) })
              .y(function(d) { return yScale(+d.Value); })
              (d[1])
          })

  

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

