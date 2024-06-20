import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto'; // Import Chart.js library

const ChartJSExample = () => {
  const userState = useSelector((state) => state.user);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null); // Reference to store the chart instance

  useEffect(() => {
    if (userState.program) {
      fetchLOs();
    }
  }, [userState.program]);

  const fetchLOs = async () => {
    try {
      const response = await fetch(`http://localhost:8087/calculate-lo-coverage/${userState.program}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response - LOs:", data);
      const losDetails = await fetchLODetails(data.totalLOs);
      prepareChartData(data.totalLOs, losDetails);
    } catch (error) {
      console.error("Error fetching LOs:", error);
    }
  };

  const fetchLODetails = async (los) => {
    const promises = los.map(async (lo) => {
      try {
        const response = await fetch(`http://localhost:8087/los/${lo.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + userState.token,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const loDetail = await response.json();
        return loDetail.lo;
      } catch (error) {
        console.error(`Error fetching details for LO ${lo.id}:`, error);
        return null;
      }
    });

    try {
      const losDetails = await Promise.all(promises);
      console.log("LO Details:", losDetails);
      return losDetails.filter((detail) => detail !== null);
    } catch (error) {
      console.error("Error fetching LO details:", error);
      return [];
    }
  };

  const prepareChartData = (coverageData, loDetails) => {
    if (!coverageData || !Array.isArray(coverageData)) {
      console.error("Invalid coverage data format:", coverageData);
      return;
    }

    if (!loDetails || !Array.isArray(loDetails)) {
      console.error("Invalid LO details format:", loDetails);
      return;
    }

    const labels = [];
    const coverageDataSet = [];
    const targetDataSet = [];

    coverageData.forEach((item) => {
      const loDetail = loDetails.find((detail) => detail._id === item.id);
      if (loDetail) {
        labels.push(loDetail.code);
        coverageDataSet.push(item.coverage);
        targetDataSet.push(loDetail.target);
      }
    });

    console.log("Chart Data - Labels:", labels);
    console.log("Chart Data - Coverage Dataset:", coverageDataSet);
    console.log("Chart Data - Target Dataset:", targetDataSet);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Coverage',
          data: coverageDataSet,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Target',
          data: targetDataSet,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    });
  };

  useEffect(() => {
    if (chartData) {
      // Destroy the previous chart instance if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [chartData]);

  return (
    <div>
      <h2 className="font-bold text-xl mt-8 text-center">LOs FlowChart</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <div className="chartMenu"></div>
      <div className="chartCard">
        <div className="chartBox">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ChartJSExample;
