import { Chart } from "chart.js/auto";

/**
 * Function that create two canvas and add them into DOM above table tags
 */
export function createCanvasTags() {
    const offencesRecordedDiv = document.createElement("div");
    const prisonPopulationDiv = document.createElement("div");
    const offencesRecordedCanvas = document.createElement("canvas");
    const prisonPopulationCanvas = document.createElement("canvas");
    const parentDiv = document.getElementById("mw-content-text");

    offencesRecordedCanvas.setAttribute("id", "chartTable1");
    prisonPopulationCanvas.setAttribute("id", "chartTable2");

    offencesRecordedDiv.appendChild(offencesRecordedCanvas);
    prisonPopulationDiv.appendChild(prisonPopulationCanvas);

    parentDiv.insertBefore(offencesRecordedDiv, parentDiv.children[5]);
    parentDiv.insertBefore(prisonPopulationDiv, parentDiv.children[19]);      
}

/**
 * Function that add graph of offences recorded
 */
export function chartForTable1() {
    const table = document.getElementById("table1");
    const years = [];
    const countries = [];
    const cells = [];

    const headerRow = table.rows[1];
    for (let j = 2; j < headerRow.cells.length; j++) {
        years.push(headerRow.cells[j].textContent);
    }

    for (let i = 2; i < table.rows.length; i++) {
        const row = table.rows[i];
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
        type: 'line',
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
 * Function that add graph of prison population
 */
export function chartForTable2() {
    const table = document.getElementById("table2");
    const years = [];
    const countries = [];
    const cells = [];

    const headerRow = table.rows[0];
    for (let j = 2; j < headerRow.cells.length; j++) {
        years.push(headerRow.cells[j].textContent);
    }

    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
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
        type: 'line',
        data: {
            labels: tableData.countries,
            datasets: tableData.years.map((year, index) => ({
                label: year,
                data: tableData.cells.map(row => row[index]),
                backgroundColor: [
                    '#ff7979', '#34495e'
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