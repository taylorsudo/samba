export function renderCoalEmissionsChart() {
    const countries = [
      "France", "United Kingdom", "Argentina", "Brazil", "Mexico", "Indonesia", "Canada", "India",
      "EU-27", "Russia", "Turkey", "World", "Germany", "Japan", "United States",
      "South Africa", "China", "South Korea", "Australia"
    ];
  
    const emissions = [
      0.07, 0.07, 0.08, 0.1, 0.1, 0.54, 0.67, 0.74, 0.78, 0.88, 0.99,
      1.06, 1.65, 1.82, 2.23, 2.68, 3.06, 3.18, 4.04
    ];
  
    const barColors = countries.map(c => c === "World" ? "yellow" : "rgb(200, 0, 0)");
  
    const trace = {
      type: "bar",
      x: emissions,
      y: countries,
      orientation: 'h',
      marker: {
        color: barColors,
      },
      text: emissions.map(v => v.toFixed(2)),
      textposition: "auto"
    };
  
    const layout = {
      title: "G20 Coal Power Emissions Per Capita in 2021",
      xaxis: {
        title: "CO₂ (tonnes)",
        range: [0, 4.5],
        color: 'rgb(255, 150, 50)'
      },
      yaxis: {
        color: 'rgb(255, 150, 50)',
      },
      font: {
        family: 'VT323, monospace',
        color: 'rgb(255, 150, 50)',
        size: 16
      },
      margin: { l: 150, r: 20, t: 60, b: 60 },
      paper_bgcolor: 'black',
      plot_bgcolor: 'black',
      height: 500,
    };
  
    Plotly.react("coal-emissions-chart", [trace], layout, { responsive: true });
  }
  