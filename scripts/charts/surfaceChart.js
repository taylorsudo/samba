import { floorLabelToZ, zonesPerFloor } from "../config.js";
import { calculateAverage, getUnitLabel, getZoneAveragesAcrossBuilding } from "../utils.js";
import { renderBarCharts } from "./barCharts.js";
import { updateCarbonMeter } from "./carbonMeter.js";
import { showAlert } from "../alert.js";

// Cache mesh geometry per floor config
let meshGeometryCache = {};

/**
 * Precomputes and returns 3D mesh geometry for a given floor layout.
 * Geometry is cached by floor and zone count to avoid recalculating.
 */
function getMeshGeometry(floor, zones) {
  const cacheKey = floor + "_" + zones.length;
  if (meshGeometryCache[cacheKey]) return meshGeometryCache[cacheKey];

  const x = [], y = [], z = [], i = [], j = [], k = [];
  let vertexCount = 0;
  const tileWidth = 1 / zones.length;

  zones.forEach((zoneId, index) => {
    const startX = index * tileWidth;
    const corners = [
      [startX, 0],
      [startX + tileWidth, 0],
      [startX + tileWidth, 1],
      [startX, 1]
    ];

    corners.forEach(([vx, vy]) => {
      x.push(vx);
      y.push(vy);
      z.push(floorLabelToZ[floor]);
    });

    // Two triangles per quad
    i.push(vertexCount);     j.push(vertexCount + 1); k.push(vertexCount + 2);
    i.push(vertexCount);     j.push(vertexCount + 2); k.push(vertexCount + 3);
    vertexCount += 4;
  });

  meshGeometryCache[cacheKey] = { x, y, z, i, j, k };
  return meshGeometryCache[cacheKey];
}

/**
 * Draws the main 3D surface plot and updates related components.
 */
export function draw3DPlot(data, selectedSeason, activeVar, selectedHour, manualFloor = null) {
  const seasonData = data[selectedSeason];
  if (!seasonData) return;

  const x = [], y = [], z = [], i = [], j = [], k = [], colors = [], labels = [];
  let vertexOffset = 0;

  Object.entries(zonesPerFloor).forEach(([floorStr, zoneList]) => {
    const floor = parseInt(floorStr);
    const floorData = seasonData?.[floor];
    if (!floorData) return;

    const mesh = getMeshGeometry(floor, zoneList);

    mesh.x.forEach(val => x.push(val));
    mesh.y.forEach(val => y.push(val));
    mesh.z.forEach(val => z.push(val));

    // Use offset to index faces correctly
    mesh.i.forEach(val => i.push(val + vertexOffset));
    mesh.j.forEach(val => j.push(val + vertexOffset));
    mesh.k.forEach(val => k.push(val + vertexOffset));

    // Add colors and labels for each zone
    zoneList.forEach((zoneId, index) => {
      const value = floorData?.[zoneId]?.[selectedHour]?.[activeVar];
      if (value === undefined) return;

      const label = `Floor ${floor}, Zone ${zoneId}`;
      for (let n = 0; n < 4; n++) {
        colors.push(value);
        labels.push(label);
      }
    });

    vertexOffset += mesh.x.length;
  });

  const colorscale = ["pmv", "ppd", "spl", "co2"].includes(activeVar)
    ? [[0, "#ffffcc"], [0.5, "#ff9933"], [1, "#cc0000"]]
    : activeVar === "rh"
      ? [[0, "#ffffff"], [0.5, "#36d3eb"], [1, "#13939f"]]
      : activeVar === "lux"
        ? [[0, "#222222"], [0.5, "#ffffcc"], [1, "#ffffcc"]]
        : "YlOrRd";

  Plotly.react("surface-plot", [{
    type: "mesh3d",
    x, y, z, i, j, k,
    intensity: colors,
    customdata: labels,
    hovertemplate: "%{customdata}<br>" + getUnitLabel(activeVar) + ": %{intensity:.2f}<extra></extra>",
    colorscale,
    showscale: true,
    colorbar: { title: getUnitLabel(activeVar) },
    opacity: 0.95,
  }], {
    title: `Building ${getUnitLabel(activeVar)} in ${selectedSeason}`,
    scene: {
      xaxis: { title: "Zone" },
      yaxis: { title: "" },
      zaxis: {
        title: "Floor",
        tickvals: Object.values(floorLabelToZ),
        ticktext: Object.keys(floorLabelToZ),
      },
    },
    margin: { t: 60 },
    font: {
      family: 'VT323, monospace',
      color: 'rgb(255, 150, 50)',
      size: 16
    },
    paper_bgcolor: "black",
  }, { responsive: true });

  // Flatten selected floor data for bar charts and alerts
  const floor = manualFloor ?? 30;
  const floorZones = seasonData?.[floor] ?? {};
  const flattenedData = [];

  Object.entries(floorZones).forEach(([zoneId, hours]) => {
    const reading = hours?.[selectedHour];
    if (reading) {
      flattenedData.push({
        floor,
        zone_id: parseInt(zoneId),
        ppd: reading.ppd,
        pmv: reading.pmv,
        rh: reading.rh,
        spl: reading.spl,
        lux: reading.lux,
        co2: reading.co2,
      });
    }
  });

  // Outlier detection logic
  const zoneAverages = getZoneAveragesAcrossBuilding(flattenedData, activeVar);
  const values = zoneAverages.map(z => z.avg);
  const mean = calculateAverage(values);
  const stdDev = Math.sqrt(values.map(v => (v - mean) ** 2).reduce((a, b) => a + b, 0) / values.length);

  let outlier = zoneAverages.reduce((acc, z) => {
    if (!acc) return z;
    return Math.abs(z.avg - mean) > Math.abs(acc.avg - mean) ? z : acc;
  }, null);

  if (outlier && stdDev > 0) {
    const zScore = Math.abs((outlier.avg - mean) / stdDev);
    if (zScore > 1.5) {
      const zMult = zScore.toFixed(1);
      const direction = outlier.avg >= mean ? "above" : "below";
      outlier.variable = activeVar;
      showAlert(outlier, getUnitLabel(activeVar), zMult, direction);
    } else {
      outlier = null;
    }
  } else {
    outlier = null;
  }

  renderBarCharts(floor, flattenedData, outlier);
  updateCarbonMeter(selectedHour, selectedSeason, data);
}
