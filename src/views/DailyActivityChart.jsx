import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

function DailyActivityChart({ tasks }) {
  const [selectedTask, setSelectedTask] = useState(null); // Selected task
  const [startMoment, setStartMoment] = useState(new Date().setHours(0, 0, 0, 0)); // Start of the current day
  const [endMoment, setEndMoment] = useState(Date.now()); // Current time

  // Get the activity periods of the selected task
  const selectedTaskPeriods = selectedTask ? selectedTask.activityPeriods.filter(period =>
    new Date(period.startDate).getTime() >= startMoment && (!period.endDate || new Date(period.endDate).getTime() <= endMoment)
  ) : [];

  // Calculate daily activity times for the selected task
  const dailyActivityTimes = selectedTaskPeriods.reduce((acc, period) => {
    const startDate = new Date(period.startDate);
    const endDate = period.endDate ? new Date(period.endDate) : new Date();
    const startDay = Math.floor(startDate.getTime() / (1000 * 60 * 60 * 24));
    const endDay = Math.floor(endDate.getTime() / (1000 * 60 * 60 * 24));

    for (let day = startDay; day <= endDay; day++) {
      const dayStart = day * 24 * 60 * 60 * 1000;
      const dayEnd = (day + 1) * 24 * 60 * 60 * 1000 - 1;
      const start = Math.max(startDate.getTime(), dayStart);
      const end = Math.min(endDate.getTime(), dayEnd);
      const time = Math.max(0, end - start); // Ensure the time is not negative

      if (!acc[day]) {
        acc[day] = { date: new Date(dayStart), time: 0 };
      }
      acc[day].time += time;
    }

    return acc;
  }, {});

  // Prepare the data for the bar chart
  const chartData = {
    labels: Object.values(dailyActivityTimes).map(data => data.date.toDateString()),
    datasets: [{
      label: 'Daily Activity Time',
      data: Object.values(dailyActivityTimes).map(data => data.time / (1000 * 60 * 60)), // Convert time to hours
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div className="view">
      <h1>Daily Activity Chart</h1>
      <h2>Select a Task:</h2>
      <select value={selectedTask ? selectedTask.id : ''} onChange={e => setSelectedTask(tasks.find(task => task.id === Number(e.target.value)))}>
        <option value="">-- Select a task --</option>
        {tasks.map(task => <option key={task.id} value={task.id}>{task.name}</option>)}
      </select>
      {selectedTask && (
        <>
          <h2>Daily Activity Chart Interval:</h2>
          <div>
            <b>From :</b>
            <input style={{ marginRight: '0.5em' }} type="date" value={new Date(startMoment).toISOString().substring(0, 10)} onChange={e => setStartMoment(new Date(e.target.value).getTime())} />
            <b> To :</b>
            <input type="date" value={new Date(endMoment).toISOString().substring(0, 10)} onChange={e => setEndMoment(new Date(e.target.value).getTime())} />
          </div>
          <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </>
      )}
    </div>
  );
}

export default DailyActivityChart;
