import React, { useState, useEffect } from 'react';

function TimeButton({ task: initialTask, tasks, setTasks, singleTaskMode }) {
  const [task, setTask] = useState(initialTask);
  const [elapsedTime, setElapsedTime] = useState(null);

  const handleClick = () => {
    if (!task.isActive) {
      if (singleTaskMode) {
        const updateTasksPromises = tasks.map(t => {
          if (t.id !== task.id && t.isActive === true) {
            const endTime = new Date();
            const updatedTask = {
              ...t,
              activityPeriods: t.activityPeriods.map((period, index) =>
                index === t.activityPeriods.length - 1 ? { ...period, endDate: endTime.toISOString() } : period
              ),
              isActive: false
            };
            return fetch(`http://localhost:3010/tasks/${t.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedTask),
            }).then(() => window.location.reload());

          }
        });

        Promise.all(updateTasksPromises)
          .then(() => {
            const updatedTasks = tasks.map(t => t.id === task.id ? task : { ...t, isActive: false });
            setTasks(updatedTasks);
          })
          .catch((error) => console.error('Error:', error));
      }
      const start = new Date();
      setTask({ ...task, activityPeriods: [...task.activityPeriods, { startDate: start.toISOString(), endDate: null }], isActive: true });
      setElapsedTime(null); // Reset elapsed time when starting the task
    } else {
      const endTime = new Date();
      const timeDiff = endTime.getTime() - new Date(task.activityPeriods[task.activityPeriods.length - 1].startDate).getTime();
      const elapsedSeconds = timeDiff / 1000;
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = Math.floor(elapsedSeconds % 60);
      const elapsedTimeString = `${hours}h ${minutes}m ${seconds}s`;
      setElapsedTime(elapsedTimeString); // Set elapsed time when stopping the task
      setTask({ ...task, activityPeriods: task.activityPeriods.map((period, index) => index === task.activityPeriods.length - 1 ? { ...period, endDate: endTime.toISOString() } : period), isActive: false });

      // Remove elapsed time after 5 seconds
      setTimeout(() => {
        setElapsedTime(null);
      }, 5000);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3010/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    }).then(() => {
      const updatedTasks = tasks.map(t => t.id === task.id ? task : { ...t, isActive: false })
      setTasks(updatedTasks);
    }).catch((error) => console.error('Error:', error));
  }, [task]);

  return (
    <div className='task-list'>
      <button onClick={handleClick} style={{ backgroundColor: task.isActive ? 'red' : 'green', color: 'white', padding: '.5em', fontSize: '20px', borderRadius: '5px' }}>
        {task.isActive ? 'Stop Task' : 'Start Task'}
      </button>
      <em><b>{task.isActive ? 'Active!' : 'Inactive'}</b></em>
      {elapsedTime && <div>{"Your time was " + elapsedTime}</div>}
    </div>
  );
}

export default TimeButton;