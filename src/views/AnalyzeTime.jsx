import React, { useState, useEffect } from 'react';

function AnalyzeTime({ tasks, setTasks}) {
  const [startMoment, setStartMoment] = useState(new Date().setHours(0, 0, 0, 0)); // Start of the current day
  const [endMoment, setEndMoment] = useState(Date.now()); // Current time
  const date = new Date();
  const timezoneOffsetInHours = date.getTimezoneOffset() / 60 * -1;
  const timeZone = 3600000 * timezoneOffsetInHours; // Set local time zone to +2

  useEffect(() => {
    fetch('http://localhost:3010/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [startMoment, endMoment]);

  // Filter tasks that have been active at some point during the observation interval
  const tasksOfInterest = tasks.filter(task =>
    task.activityPeriods.some(period =>
      new Date(period.startDate) <= endMoment && (!period.endDate || new Date(period.endDate) >= startMoment)
    )
  );

  // Get all unique tags of interest
  const tagsOfInterest = [...new Set(tasksOfInterest.flatMap(task => task.tags))];

  // Calculate total active time for each task
  const taskTimes = tasksOfInterest.reduce((acc, task) => {
    const taskTime = task.activityPeriods.reduce((total, period) => {
      const start = Math.max(new Date(period.startDate).getTime(), startMoment);
      const end = period.endDate ? Math.min(new Date(period.endDate).getTime(), endMoment) : endMoment;
      return total + Math.max(0, end - start); // Ensure the time is not negative
    }, 0);
    acc[task.name] = taskTime;
    return acc;
  }, {});

  // Calculate total active time for each tag
  const tagTimes = tagsOfInterest.reduce((acc, tag) => {
    const tagTime = tasksOfInterest.filter(task => task.tags.includes(tag)).reduce((total, task) => {
      const taskTime = task.activityPeriods.reduce((total, period) => {
        const start = Math.max(new Date(period.startDate).getTime(), startMoment);
        const end = period.endDate ? Math.min(new Date(period.endDate).getTime(), endMoment) : endMoment;
        return total + Math.max(0, end - start); // Ensure the time is not negative
      }, 0);
      return total + taskTime;
    }, 0);
    acc[tag] = tagTime;
    return acc;
  }, {});

  return (
    <div className="view">
      <h1>Analyze Time</h1>
      <h2>Observation Interval:</h2>
      <div>
        <b>From :</b>
        <input style={{ marginRight: '0.5em' }} type="datetime-local" value={new Date(startMoment + timeZone).toISOString().substring(0, 16)} onChange={e => setStartMoment(new Date(e.target.value).getTime())} />
        <b> To :</b>
        <input type="datetime-local" value={new Date(endMoment + timeZone).toISOString().substring(0, 16)} onChange={e => setEndMoment(new Date(e.target.value).getTime())} />
      </div>
      <h2>Tasks of Interest:</h2>
      <ul>
        {Object.entries(taskTimes).map(([task, time], index) => (
          <li key={index}>
            <b>{task}</b>: {Math.floor(time / 3600000)}h {Math.floor((time / 1000 % 3600) / 60)}m {Math.floor(time / 1000 % 60)}s
          </li>
        ))}
      </ul>
      <h2>Tags of Interest:</h2>
      <ul>
        {Object.entries(tagTimes).map(([tag, time], index) => (
          <li key={index}>
            <b>{tag}</b>: {Math.floor(time / 3600000)}h {Math.floor((time / 1000 % 3600) / 60)}m {Math.floor(time / 1000 % 60)}s
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnalyzeTime;
