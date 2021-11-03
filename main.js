import MapChart from './mapChart.js';
import BarChart from './species_chart.js';
import LineChart from './lineChart.js';

d3.csv("Threatened_species.csv", d3.autoType).then(data => {
    d3.json("world-110m.json", d3.autoType).then(world => {

        // Generate initial map and update it to data from 2004
        const mapChart = MapChart(".map", data, world)
        mapChart.update(data, 2004)

        const barChart = BarChart(".bar-chart")
        const lineChart = LineChart(".line-chart", data)

        let selection = document.getElementById('year')
        let country = null
        let type = null

        //default the bar chart with Afganistan Data 
        barChart.update(data, 2004, "Afghanistan")
        
        // Listen for change in year dropdown, update map chart, bar chart if changed
        selection.onchange = () => {
            mapChart.update(data, selection.value)
            barChart.update(data, selection.value, country)
        }
        
        // Update bar chart, line chart when country is clicked on map
        mapChart.on("click", (clicked) => {
            country = clicked
            barChart.update(data, selection.value, country)
            lineChart.updateCountry(data, country)
        })

        // Update line chart to include line of type of clicked bar
        barChart.on("click", (clicked) => {
            type = clicked
            lineChart.updateType(data, type, country)
        })
    })

})