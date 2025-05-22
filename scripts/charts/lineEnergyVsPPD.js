export function renderLineChartEnergyVsPPD() {
  // Hours of the day data (x-axis)
  const hours = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', 
                 '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', 
                 '8pm', '9pm', '10pm', '11pm'];
  
  // Sample data based on the image
  const carbonIntensity = [
      290, 290, 300, 330, 360, 400, 440, 470, 530, 580, 
      600, 610, 620, 625, 630, 635, 630, 625, 540, 420, 
      360, 340, 320, 315
  ];
  
  const predictedDissatisfied = [
      17.5, 17.4, 17.3, 17.2, 17.0, 16.8, 16.5, 15.8, 13.5, 13.8, 
      14.2, 14.8, 15.0, 16.0, 16.5, 17.2, 17.5, 17.0, 17.0, 17.8, 
      17.6, 17.5, 17.4, 17.3
  ];
  
  // Create the two traces for our dual-axis plot
  const trace1 = {
      x: hours,
      y: carbonIntensity.slice(0, hours.length),
      name: 'Carbon Intensity',
      type: 'scatter',
      mode: 'lines+markers',
      line: {
          color: 'rgb(80, 180, 255)',
          width: 3
      },
      marker: {
          color: 'rgb(80, 180, 255)',
          size: 8
      }
  };
  
  const trace2 = {
      x: hours,
      y: predictedDissatisfied.slice(0, hours.length),
      name: 'Predicted % Dissatisfied',
      type: 'scatter',
      mode: 'lines+markers',
      line: {
          color: 'rgb(255, 150, 50)',
          width: 3
      },
      marker: {
          color: 'rgb(255, 150, 50)',
          size: 8
      },
      yaxis: 'y2'
  };
  
  // Layout configuration
  const layout = {
      title: {
          text: 'Energy Use vs. PPD',
          font: {
              family: 'VT323, monospace',
              size: 32,
              color: 'rgb(255, 150, 50)'
          }
      },
      paper_bgcolor: 'rgb(0, 0, 0)',
      plot_bgcolor: 'rgb(0, 0, 0)',
      autosize: true,
      margin: {
          l: 60,
          r: 60,
          b: 60,
          t: 80,
          pad: 4
      },
      xaxis: {
          title: '',
          tickfont: {
              family: 'VT323, monospace',
              size: 18,
              color: 'rgb(255, 150, 50)'
          },
          gridcolor: 'rgba(255, 150, 50, 0.2)',
          gridwidth: 1,
          showgrid: true,
          zeroline: false
      },
      yaxis: {
          title: {
              text: 'Carbon Intensity (gCO₂/kWh)',
              font: {
                  family: 'VT323, monospace',
                  size: 22,
                  color: 'rgb(80, 180, 255)'
              }
          },
          range: [250, 650],
          tickfont: {
              family: 'VT323, monospace',
              size: 18,
              color: 'rgb(80, 180, 255)'
          },
          gridcolor: 'rgba(255, 150, 50, 0.2)',
          gridwidth: 1
      },
      yaxis2: {
          title: {
              text: 'PPD (%)',
              font: {
                  family: 'VT323, monospace',
                  size: 22,
                  color: 'rgb(255, 150, 50)'
              }
          },
          range: [13, 18],
          tickfont: {
              family: 'VT323, monospace',
              size: 18,
              color: 'rgb(255, 150, 50)'
          },
          overlaying: 'y',
          side: 'right'
      },
      showlegend: false,
  };
  
  const data = [trace1, trace2];
  
  Plotly.newPlot('line-chart-energy-vs-ppd', data, layout, {responsive: true});
}