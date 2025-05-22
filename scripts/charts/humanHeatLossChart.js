export function renderHumanHeatLossChart() {
    const trace = {
      x: ['Heat Dissipation'],
      y: [60],
      name: 'Radiation (~60%)',
      type: 'bar',
      marker: { color: '#cc0000' }
    };
  
    const trace2 = {
      x: ['Heat Dissipation'],
      y: [22],
      name: 'Evaporation (~22%)',
      type: 'bar',
      marker: { color: '#36d3eb' }
    };
  
    const trace3 = {
      x: ['Heat Dissipation'],
      y: [15],
      name: 'Convection + Conduction (~15%)',
      type: 'bar',
      marker: { color: '#ffff00' }
    };
  
    const layout = {
      barmode: 'stack',
      title: '',
      yaxis: { title: 'Percentage (%)', range: [0, 100] },
      font: { family: 'VT323, monospace', color: 'rgb(255, 150, 50)', size: 16 },
      paper_bgcolor: 'black',
      plot_bgcolor: 'black',
      showlegend: false,
      autosize: false,
      width: 500,
      height: 800,
    };
  
    Plotly.react('human-heat-loss-chart', [trace, trace2, trace3], layout, { responsive: true });
  }
  