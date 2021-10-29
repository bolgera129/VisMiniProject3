
export default function MapChart(container, data, world) {

    // Create SVG
    let outerWidth = 650
    let outerHeight = 500
    let margin = {top: 10, bottom: 10, left: 10, right: 10}
    let width = outerWidth - margin.left - margin.right
    let height = outerHeight - margin.top - margin.bottom

    const svg = d3.select(container)
        .append("svg")
        .attr("class", "svg-map")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

    // Data Set Manipulation
    let worldmap = topojson.feature(world, world.objects.countries)
    let countries = worldmap.features.map(d => d.properties.name)

    console.log(worldmap)

    // Create color scale
    let domain = data.filter(d => d.Series === "Threatened Species: Total (number)" && countries.includes(d.Country))

    let colorScale = d3.scaleQuantize()
        .domain([0, d3.max(domain, d => d.Value)])
        .range(d3.schemeBlues[9])

    // Construct projection
    const projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], worldmap)

    // Create path generator
    const path = d3.geoPath()
        .projection(projection)

    // Draw map
    const map = svg.selectAll("path")
        .append("g")
        .data(worldmap.features)
        .enter()
        .append("path")
        .attr("d", path)

    // Draw border lines
    svg.append("path")
        .datum(topojson.mesh(world, world.objects.countries))
        .attr("d", path)
        .attr('fill', 'none')
        .attr('stroke', 'midnightblue')
        .attr('stroke-width', '0.5px')
        .attr("class", "subunit-boundary")

    // Zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", (event, d) => zoomed(event))

    function zoomed(event) {
        svg.selectAll("path")
            .attr("transform", event.transform)
    }

    svg.call(zoom)

    // Click listener and click function
    const listeners = {"click": null}

    function clicked(d) {
        listeners["click"](d.properties.name)
    }

    // Reset zoom
    d3.select("#zoom").on('click', () => {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity)
    })

    function update(data, year) {
        // Filter Data Set
        year = parseInt(year)
        let remainder = []
        let filtered = data.filter(d => d.Series === "Threatened Species: Total (number)" && d.Year === year && countries.includes(d.Country))
        let features = worldmap.features

        for (const feat of features) {
            var country = feat.properties.name
            var found = false
            for (const object of filtered) {
                var data_country = object.Country
                if (country === data_country) {
                    feat.properties.Value = object.Value
                    found = true
                }
            }
            if (!found) {
                feat.properties.Value = null
                remainder.push(country)
            }
        }
        
        // Update coloring, tooltips
        map.attr("fill", d => {
            if (remainder.includes(d.properties.name)) {
                return "Grey"
            }
            else return colorScale(d.properties.Value)
            })
            .on("mouseenter", (event, d) => {
                
                let pos = d3.pointer(event, window)
                console.log(pos)
    
                d3.select("#map-tooltip")
                    .style('left', pos[0] + "px")
                    .style('top', pos[1] + "px")
                    .html(() => {
                        if (d.properties.Value === null) {
                            return `Country: ${d.properties.name} <br>
                            Total Threatened Species: N/A <br>`
                        }
                        else {
                            return `Country: ${d.properties.name} <br>
                            Total Threatened Species: ${d3.format(",")(d.properties.Value)} <br>`
                        }
                    })
                
                d3.select('#map-tooltip').classed("hidden", false)

                d3.select(event.currentTarget)
                    .transition()
                    .duration(100)
                    .attr("fill", "lightcoral")
                
            })
            .on("mouseleave", (event, d) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(100)
                    .attr("fill", d => {
                        if (remainder.includes(d.properties.name)) {
                            return "Grey"
                        }
                        else return colorScale(d.properties.Value)
                        })

                d3.select("#map-tooltip").classed("hidden", true)
            })
            .on("click", (event, d) => clicked(d))
    }
    function on(event, listener) {
        listeners[event] = listener
    }
    return {
        update,
        on
    }
}