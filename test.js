import MapChart from './mapChart.js';
import BarChart from './species_chart.js';
import LineChart from './lineChart.js';

d3.csv("Threatened_species.csv", d3.autoType).then(data => {
    d3.json("world-110m.json", d3.autoType).then(world => {


        const lineChart = LineChart(".line-chart", data)

        let selection = document.getElementById('year')
        let country = null
        let type = null

        //default the bar chart with Afganistan Data 
        lineChart.updateCountry(data, "Afghanistan")
        
        
        // Update bar chart, line chart when country is clicked on map

        // Update line chart to include line of type of clicked bar

    })

})