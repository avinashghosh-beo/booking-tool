//UI_COMPONENTS
// Card component for responsive card view on orders page or home page
// Notes
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  values: number[];
  showXaxis?: boolean;
  showYaxis?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  labels,
  values,
  showXaxis = true,
  showYaxis = true,
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: false, // make true to enable the title
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      x: {
        display: showXaxis,
        ticks: {
          display: true, // Hides x-axis labels
        },
        grid: {
          display: false, // Hides x-axis grid lines
        },
      },
      y: {
        display: showYaxis,
        ticks: {
          display: true, // Hides y-axis labels
        },
        grid: {
          display: false, // Hides y-axis grid lines
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: values,
        borderColor: "rgb(53, 132, 56)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4, // make line wavvy
        pointRadius: 4, // remove dots from line
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
