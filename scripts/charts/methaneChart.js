export function renderMethaneChart() {
  const years = ['2020', '2021'];

  const nswInventory = {
    name: 'NSW inventory (100% coverage)',
    x: years,
    y: [0.37, 0.34],
    type: 'bar',
    marker: { color: 'rgb(255, 150, 50)' }
  };

  const kayrros = {
    name: 'Kayrros (60–64% coverage)',
    x: years,
    y: [0.7, 0.68],
    type: 'bar',
    error_y: {
      type: 'data',
      array: [0.14, 0.15],  // error bars
      visible: true,
      color: 'black',
      thickness: 2
    },
    marker: { color: 'rgb(200, 0, 0)' }
  };

  const layout = {
    title: {
      text: `Reported Coal Mine Methane Emissions`,
      font: {
        family: 'VT323, monospace',
        size: 22,
        color: 'rgb(255, 150, 50)',
      }
    },
    barmode: 'group',
    xaxis: {
      tickfont: {
        family: 'VT323, monospace',
        size: 18,
        color: 'rgb(255, 150, 50)'
      }
    },
    yaxis: {
      title: 'million tonnes CH₄',
      titlefont: {
        family: 'VT323, monospace',
        size: 18,
        color: 'rgb(255, 150, 50)'
      },
      tickfont: {
        family: 'VT323, monospace',
        size: 16,
        color: 'rgb(255, 150, 50)'
      }
    },
    legend: {
      font: {
        family: 'VT323, monospace',
        size: 16,
        color: 'rgb(255, 150, 50)'
      }
    },
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',
    margin: { t: 80, b: 60, l: 80, r: 20 }
  };

  Plotly.react('methane-chart', [nswInventory, kayrros], layout, { responsive: true });
}