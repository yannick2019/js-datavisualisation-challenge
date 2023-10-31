import { Chart } from "chart.js/auto";


const offencesRecordedGraphContainer = document.createElement("div");
const prisonPopulationGraphContainer = document.createElement("div");
const ajaxContainer = document.createElement("div");
const offencesRecordedCanvas = document.createElement("canvas");
const prisonPopulationCanvas = document.createElement("canvas");
const ajaxCanvas = document.createElement("canvas");
const parentTables = document.getElementById("mw-content-text");
const firstHeading = document.getElementById("firstHeading");
const table1 = document.getElementById("table1");
const table2 = document.getElementById("table2");

/**
 * Function that create three canvas and add them into DOM, two above table tags and one below first heading
 */
export function createCanvasTags() {
    offencesRecordedCanvas.setAttribute("id", "chartTable1");
    prisonPopulationCanvas.setAttribute("id", "chartTable2");
    ajaxCanvas.setAttribute("id", "chartAjax");

    offencesRecordedGraphContainer.appendChild(offencesRecordedCanvas);
    prisonPopulationGraphContainer.appendChild(prisonPopulationCanvas);
    ajaxContainer.appendChild(ajaxCanvas);

    parentTables.insertBefore(offencesRecordedGraphContainer, table1);
    parentTables.insertBefore(prisonPopulationGraphContainer, table2);  
    firstHeading.after(ajaxContainer);
    
}

/**
 * Function that add graph of offences recorded above Table 1
 */
export function chartForTable1() {
    let years = [];
    let countries = [];
    let cells = [];

    const headerRow = table1.rows[1];
    for (let j = 2; j < headerRow.cells.length; j++) {
        years.push(headerRow.cells[j].textContent);
    }

    for (let i = 2; i < table1.rows.length; i++) {
        const row = table1.rows[i];
        countries.push(row.cells[1].textContent);

        const rowData = [];
        for (let j = 2; j < row.cells.length; j++) {
            rowData.push(parseFloat(row.cells[j].textContent.replace(",", ".")));
        }
        cells.push(rowData);
    }

    const tableData = { years, countries, cells };
    const chartCanvas = document.getElementById("chartTable1");

    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: tableData.countries,
            datasets: tableData.years.map((year, index) => ({
                label: year,
                data: tableData.cells.map(row => row[index]),
                backgroundColor: [
                    '#ff7979', '#34495e', '#2ecc71', '#e67e22',
                    '#2980b9', '#9b59b6', '#95a5a6', '#bdc3c7', 
                    '#6c5ce7', '#6F1E51', '#7ed6df', 
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }))
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Function that add graph of prison population above Table 2
 */
export function chartForTable2() {
    let years = [];
    let countries = [];
    let cells = [];

    const headerRow = table2.rows[0];
    for (let j = 2; j < headerRow.cells.length; j++) {
        years.push(headerRow.cells[j].textContent);
    }

    for (let i = 1; i < table2.rows.length; i++) {
        const row = table2.rows[i];
        countries.push(row.cells[1].textContent);

        const rowData = [];
        for (let j = 2; j < row.cells.length; j++) {
            rowData.push(parseFloat(row.cells[j].textContent.replace(",", ".")));
        }
        cells.push(rowData);
    }

    const tableData = { years, countries, cells };
    const chartCanvas = document.getElementById("chartTable2");

    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: tableData.countries,
            datasets: tableData.years.map((year, index) => ({
                label: year,
                data: tableData.cells.map(row => row[index]),
                backgroundColor: '#3498db',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }))
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Retrieve the data via Ajax, and insert graph that refreshes every second, just below the main title (h1)
 */
export function chartWithAjax() {

    // Ajax
    const req = new XMLHttpRequest();
    const url = "https://canvasjs.com/services/data/datapoints.php";

    req.open("GET", url, true);
    req.send();

    req.onreadystatechange = function() {
        if (this.status === 200 && this.readyState === 4) {
            const datapoints = JSON.parse(this.responseText);

            createChart(datapoints);
            console.log(datapoints);
        }
    }

    // Create chart
    function createChart(data) {
        const chartCanvas = document.getElementById("chartAjax");

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: data.map(datapoint => datapoint[0]),
                datasets: [{
                    label: 'Data from API',
                    data: data.map(datapoint => datapoint[1]),
                    backgroundColor: [
                        '#16a085', '#ecf0f1', '#2ecc71', 
                        '#2980b9', '#9b59b6', '#95a5a6', 
                        '#6c5ce7', '#f1c40f', '#7ed6df', 
                        '#bdc3c7',
                    ],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]                
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    }
}