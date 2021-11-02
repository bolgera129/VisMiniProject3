
export default function LineChart(container) {
    // Create SVG, scales, axes, etc.

    // Function that updates line chart to different country
    function updateCountry(data, country) {
        // Remove all previous lines from SVG and add one for the total species counts over time in given country

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