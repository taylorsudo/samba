import { initScrollControl } from './scrollControl.js';
import { formatHour } from './utils.js';
import { zonesPerFloor, defaultFloor } from './config.js';

import { draw3DPlot } from './charts/surfaceChart.js';
import { renderLineChartEnergyVsPPD } from './charts/lineEnergyVsPPD.js';
import { renderHumanHeatLossChart } from './charts/humanHeatLossChart.js';
import { renderCoalEmissionsChart } from './charts/coalEmissionsChart.js';
import { renderMethaneChart } from './charts/methaneChart.js';

// === Global State ===
let data = {};
let activeVar = "ppd";
let selectedSeason = "Summer";
let selectedTimeValue = 0;

// === Throttle draw3DPlot using requestAnimationFrame ===
let frameId = null;
/**
 * Calls draw3DPlot but throttled to one frame.
 * Prevents over-rendering on rapid slider or scroll changes.
 */
function throttledDraw(...args) {
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => draw3DPlot(...args));
}

/**
 * Sets up click listeners for a group of buttons and updates state.
 */
function assignButtonGroup(selector, callback) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      callback(btn);
    });
  });
}

/**
 * Activates the floor button visually.
 */
function activateFloorTab(floor) {
  const floorButton = document.querySelector(`.tab-btn[data-floor="${floor}"]`);
  if (!floorButton) return;

  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  floorButton.classList.add("active");
}

/**
 * Hides the loading screen overlay once the app is fully initialized.
 */
function hideLoadingScreen() {
  const loader = document.getElementById("loading-screen");
  if (loader) loader.style.display = "none";
}

/**
 * Initializes the full web app: tabs, buttons, sliders, charts, scroll.
 */
function init() {
  const timeSlider = document.getElementById("time-slider");
  const timeLabel = document.getElementById("time-label");

  // === Season Tabs ===
  assignButtonGroup(".season-tab", (btn) => {
    selectedSeason = btn.dataset.season;
    updateAllCharts();
  });

  // === Variable Buttons ===
  assignButtonGroup(".data-btn", (btn) => {
    activeVar = btn.dataset.var;
    updateAllCharts();
  });

  // === Time Slider Setup ===
  timeSlider.max = 23;
  timeSlider.value = selectedTimeValue;
  timeLabel.textContent = formatHour(selectedTimeValue);

  timeSlider.addEventListener("input", () => {
    selectedTimeValue = parseInt(timeSlider.value);
    timeLabel.textContent = formatHour(selectedTimeValue);
    updateAllCharts();
  });

  // === Floor Tabs ===
  const floorTabs = document.getElementById("floor-tab-buttons");
  Object.keys(zonesPerFloor).sort((a, b) => b - a).forEach((floor) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = `Floor ${floor}`;
    btn.dataset.floor = floor;

    btn.addEventListener("click", () => {
      activateFloorTab(floor);
      updateAllCharts(parseInt(floor));
    });

    floorTabs.appendChild(btn);
  });

  // Default floor setup
  activateFloorTab(defaultFloor);
  updateAllCharts();

  // Enable scroll-time control
  initScrollControl();

  // === STATIC CHARTS ===

  // Critical chart: load immediately
  renderLineChartEnergyVsPPD(data);
  renderHumanHeatLossChart();

  // Defer non-critical charts using idle time
  const defer = typeof requestIdleCallback === 'function' ? requestIdleCallback : (cb) => setTimeout(cb, 500);

  defer(() => {
    renderCoalEmissionsChart();
    renderMethaneChart();
  });

  // Hide loading screen after all core charts and UI are ready
  hideLoadingScreen();
}

/**
 * Central chart update handler. Called on floor/tab/time changes.
 * Uses throttled 3D plot drawing for performance.
 */
function updateAllCharts(manualFloor = null) {
  throttledDraw(data, selectedSeason, activeVar, selectedTimeValue, manualFloor);
}

// === Load Data & Start ===
fetch("./scripts/samba_data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    init();
  });
