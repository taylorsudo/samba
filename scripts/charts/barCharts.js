import { getUnitLabel, getZoneAveragesAcrossBuilding } from "../utils.js";

/**
 * Renders all bar charts for a given floor.
 *
 * @param {number} floor - The floor number to display.
 * @param {Array<Object>} filteredData - Flattened array of readings for the selected floor and hour.
 * @param {Object|null} outlier - Zone object with highest deviation for highlighting (optional).
 */
export function renderBarCharts(floor, filteredData, outlier = null) {
  // Variable keys to chart
  const vars = ["ppd", "pmv", "rh", "spl", "lux", "co2"];

  // Map each variable to its corresponding chart container ID
  const containerIds = {
    ppd: "bar-chart-ppd",
    pmv: "bar-chart-pmv",
    rh: "bar-chart-rh",
    spl: "bar-chart-spl",
    lux: "bar-chart-lux",
    co2: "bar-chart-co2",
  };

  // Axis and chart titles for readability
  const variableTitles = {
    ppd: "Predicted % Dissatisfied",
    pmv: "Predicted Mean Vote",
    rh: "Relative Humidity",
    spl: "Sound Pressure Level",
    lux: "Illuminance",
    co2: "CO₂ Concentration"
  };

  vars.forEach((v) => {
    // Calculate zone averages for each variable
    const zoneAverages = getZoneAveragesAcrossBuilding(filteredData, v, floor);

    // Highlight bar in red if it matches the outlier zone
    const barColors = zoneAverages.map((z) =>
      outlier && z.zoneId === outlier.zoneId ? "red" : "#ff9933"
    );

    const trace = {
      type: "bar",
      x: zoneAverages.map((z) => `Zone ${z.zoneId}`),
      y: zoneAverages.map((z) => z.avg),
      marker: { color: barColors },
    };

    const layout = {
      title: variableTitles[v],
      xaxis: { title: "" },
      yaxis: { title: getUnitLabel(v) },
      margin: { t: 40, l: 50, r: 30, b: 40 },
      font: {
        family: 'VT323, monospace',
        color: 'rgb(255, 150, 50)',
        size: 16,
      },
      paper_bgcolor: "black",
      plot_bgcolor: "black",
    };

    Plotly.react(containerIds[v], [trace], layout, { responsive: true });
  });
}
