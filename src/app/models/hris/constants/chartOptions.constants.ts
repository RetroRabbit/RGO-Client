import { ChartConfiguration } from "chart.js";

export const barChartOptions: ChartConfiguration['options'] = {
  events: [],
  responsive: true,
  scales: {
    x: {},
    y: {
      display: true,
      title: {
        display: true,
        text: 'Employees',
        color: '#black',
        font: {
          family: 'Roboto',
          size: 14,
          style: 'normal',
          lineHeight: 1.2
        },
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        font: {
          size: 14
        }
      }
    },
    datalabels: {
      anchor: 'middle',
      align: 'center',
      color: 'white',
    } as any,
  },

};

export const pieChartOptions: ChartConfiguration['options'] = {
    events: [],
    responsive: true,
    layout: {
      padding: {
        left: 20
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            size: 14
          }
        }
      },
      datalabels: {
        anchor: 'middle',
        align: 'center',
        color: 'white',
      } as any,
    },
  };