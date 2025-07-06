// client/src/components/ChartPage.js
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function ChartPage({ userVisitCount, clickCount, hoverCount }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Create a ref to store the chart instance

  useEffect(() => { 
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance and store it in the ref
      chartInstanceRef.current = new Chart(ctx, {
        type: "doughnut", // Change to 'doughnut' type
        data: {
          labels: ["Clicks", "Hovers"], // Adjust labels for the doughnut chart
          datasets: [
            {
              label: "Interactions",
              data: [clickCount, hoverCount], // Use click and hover counts from props
              backgroundColor: [
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "User Interactions",
            },
          },
        },
      });
    }
  }, [clickCount, hoverCount]); // Re-run effect when clickCount or hoverCount changes

  return <canvas ref={chartRef} />;
}
