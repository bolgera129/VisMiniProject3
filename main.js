import MapChart from './mapChart.js';
import barChart from './species_chart.js';

d3.csv("Threatened_species.csv", d3.autoType).then(data => {
    d3.json("world-110m.json", d3.autoType).then(world => {

        // Generate initial map and update it to data from 2004
        const mapChart = MapChart(".map", data, world)
        mapChart.update(data, 2004)

        // Listen for change in year dropdown, update charts if changed
        let selection = document.getElementById('year')
        selection.onchange = () => {
            mapChart.update(data, selection.value)
            }
        
        
        // Update other charts when country is clicked on map
        mapChart.on("click", (country) => {
            d3.select("#svg-bar").selectAll("svg").exit().remove();
            let BarChart = barChart(".bar-chart", selection.value, country, data)
            
        })
    })

})