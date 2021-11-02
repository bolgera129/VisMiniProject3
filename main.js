import MapChart from './mapChart.js';
import BarChart from './species_chart.js';

d3.csv("Threatened_species.csv", d3.autoType).then(data => {
    d3.json("world-110m.json", d3.autoType).then(world => {

        // Generate initial map and update it to data from 2004
        const mapChart = MapChart(".map", data, world)
        mapChart.update(data, 2004)
        const barChart = BarChart(".bar-chart")

        let country = null
        let selection = document.getElementById('year')

        // Listen for change in year dropdown, update charts if changed
        selection.onchange = () => {
            mapChart.update(data, selection.value)
            barChart.update(data, selection.value, country)
        }
        
        // Update other charts when country is clicked on map
        mapChart.on("click", (c) => {
            country = c
            barChart.update(data, selection.value, country)
        })
    })

})