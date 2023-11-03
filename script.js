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
    const ctx = document.getElementById("chartTable1").getContext('2d');

    new Chart(ctx, {
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
    const ctx = document.getElementById("chartTable2").getContext('2d');

    new Chart(ctx, {
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
export function chartWithAjaxLive() {
    let chart;
    let dataPoints = [];
    
    function fetchDataAndRenderChart() {
        const url = "https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=10&length=10&type=json";
    
        const req = new XMLHttpRequest();
        req.open("GET", url, true);
    
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                const data = JSON.parse(req.responseText);
                dataPoints = data.map(point => ({ x: point[0], y: parseInt(point[1]) }));
                renderChart(dataPoints);
            }
        };
    
        req.send();
    }
    
    function renderChart(dataPoints) {
        const ctx = document.getElementById("chartAjax").getContext("2d");
    
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.map(datapoint => datapoint.x),
                datasets: [{
                    label: 'Live Chart with dataPoints from External JSON',
                    data: dataPoints.map(datapoint => datapoint.y),
                    backgroundColor: '#ecf0f1',
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
    
    function updateChart() {
        const url = "https://canvasjs.com/services/data/datapoints.php?xstart=" + (dataPoints.length + 1) + "&ystart=" + dataPoints[dataPoints.length - 1].y + "&length=1&type=json";
    
        const req = new XMLHttpRequest();
        req.open("GET", url, true);
    
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                const data = JSON.parse(req.responseText);
                dataPoints.push({
                    x: parseInt(data[0][0]),
                    y: parseInt(data[0][1])
                });
                
                chart.data.labels.push(dataPoints[dataPoints.length - 1].x);
                chart.data.datasets[0].data.push(dataPoints[dataPoints.length - 1].y);      
                chart.update();
                
            }
        };
    
        req.send();
    }
    
    fetchDataAndRenderChart();
    
    setInterval(updateChart, 1000);
    
}











