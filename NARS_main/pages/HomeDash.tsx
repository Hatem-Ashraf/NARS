import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { Doughnut } from 'react-chartjs-2';
import { sliceEvents, createPlugin } from '@fullcalendar/core';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const handleDateClick = (arg) => {
  alert(arg.dateStr)
}

const BarChart = ({ cookies }) => {
  
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  const [pieChartData, setPieChartData] = useState({
    labels: ['Faculties', 'Staff', 'Teachers', 'Deps', 'Programs', 'Courses'],
    datasets: [
      {
        data: [2, 36, 30, 9, 30, 48],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
        ],
      },
    ],
  });

  const [pieChartOptions, setPieChartOptions] = useState({
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Faculty Distribution',
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  });

  useEffect(() => {
    setChartData({
        labels: ['Faculty', 'Staff', 'Teach', 'Dep', 'Prog', 'Courses'],
        datasets: [
            {
                label: 'Staff',
                data: [11, 36, 30, 16, 30, 48],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(255, 159, 64, 0.7)',
                  'rgba(201, 203, 207, 0.7)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 206, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 159, 64)',
                  'rgb(201, 203, 207)',
                ],
              }, 
        ]
    })
    setChartOptions({
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Faculty statistics',
            }
        },
        maintainAspectRatio: false,
        responsive: true
    })
  }, [])

  return (
    <div className="bg-white p-10">
      <h2 className='text-4xl font-bold text-center mb-10 text-indigo-800'>Welcome {cookies.name}</h2>
      <div className="grid grid-cols-3 gap-8">
        <div className="p-4 border border-gray-300 rounded-md">
          <div  className="flex justify-between mb-5">
            <span className="text-4xl">2</span>
            <img src="/images/img1.png" alt="Card 01" className="w-15 h-15" />
          </div>
          <p className="text-xl">Total Faculties</p>
          <p className="text-neutral-400">2 new faculties added!</p>
        </div>
        <div className="p-4 border border-gray-300 rounded-md">
          <div  className="flex justify-between mb-5">
            <span className="text-4xl">36</span>
            <img src="/images/img2.png" alt="Card 01" className="w-15 h-15" />
          </div>
          <p className="text-xl">Total Staff</p>
          <p className="text-neutral-400">2 new employees added!</p>
        </div>
        <div className="p-4 border border-gray-300 rounded-md">
          <div  className="flex justify-between mb-5">
            <span className="text-4xl">30</span>
            <img src="/images/img3.png" alt="Card 01" className="w-15 h-15" />
          </div>
          <p className="text-xl">Total teachers</p>
          <p className="text-neutral-400">2 new employees added!</p>
        </div>
        <div className="p-4 border border-gray-300 rounded-md">
          <div  className="flex justify-between mb-5">
            <span className="text-4xl">9</span>
            <img src="/images/img4.png" alt="Card 01" className="w-15 h-15" />
          </div>
          <p className="text-xl">Total Departments</p>
          <p className="text-neutral-400">2 new Department added!</p>
        </div>
        <div className="p-4 border border-gray-300 rounded-md">
          <div  className="flex justify-between mb-5">
            <span className="text-4xl">30</span>
            <img src="/images/img5.png" alt="Card 01" className="w-15 h-15" />
          </div>
          <p className="text-xl">Total Programs</p>
          <p className="text-neutral-400">5 new programs added!</p>
        </div>
        <div className="p-4 border border-gray-300 rounded-md">
          <div  className="flex justify-between mb-5">
            <span className="text-4xl">48</span>
            <img src="/images/img6.png" alt="Card 01" className="w-15 h-15" />
          </div>
          <p className="text-xl">Total Courses</p>
          <p className="text-neutral-400">11 new courses added!</p>
        </div>
        <div className="col-span-2 lg:h-[70vh] h-[50vh] p-4 border rounded-lg overflow-x-scroll">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[
            {
              title: 'Verify the success of recent backups.',
              start: '2024-03-01',
              end: '2024-03-06', // The end date (inclusive) for a multi-day event
            },
            {
              title: 'Conduct a review of user accounts and permissions.',
              start: '2024-03-05',
              end: '2024-03-07', // The end date (inclusive) for another multi-day event
            },
            {
              title: 'Conduct a review of user accounts and permissions.',
              start: '2024-04-01',
              end: '2024-04-09', // The end date (inclusive) for another multi-day event
            },
          ]}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
        />

        </div>
        <div className=' lg:h-[70vh] h-[50vh] p-4 border rounded-lg bg-white'>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
};

function renderEventContent(eventInfo) {
  return(
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export default BarChart;
