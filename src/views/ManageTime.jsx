import React, { useState, useEffect } from 'react';

function ManageTime({ tasks, setTasks }) {
    const [startMoment, setStartMoment] = useState(new Date().setHours(0, 0, 0, 0)); // Start of the current day
    const [endMoment, setEndMoment] = useState(Date.now()); // Current time
    const [selectedTask, setSelectedTask] = useState(null); // Selected task
    const date = new Date();
    const timezoneOffsetInHours = date.getTimezoneOffset() / 60 * -1;
    const timeZone = 3600000 * timezoneOffsetInHours; // Set local time zone to +2

    useEffect(() => {
        fetch('http://localhost:3010/tasks')
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error('Error fetching tasks:', error));
    }, [startMoment, endMoment]);

    const handlePeriodChange = (index, start, end) => {
        // Update the activity periods of the selected task
        const updatedTask = { ...selectedTask, activityPeriods: selectedTask.activityPeriods.map((period, i) => i === index ? { startDate: start, endDate: end } : period) };
        setSelectedTask(updatedTask);

        // Save the changes to the server
        fetch(`http://localhost:3010/tasks/${selectedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        }).then((response) => response.json())
            .then((data) => setTasks(tasks.map(task => task.id === data.id ? data : task)))
            .catch((error) => console.error('Error updating task:', error));
    };

    const handleAddPeriod = () => {
        // Add a new activity period to the selected task
        const updatedTask = { ...selectedTask, activityPeriods: [...selectedTask.activityPeriods, { startDate: new Date(startMoment).toISOString(), endDate: new Date(endMoment).toISOString() }] };
        setSelectedTask(updatedTask);

        // Save the changes to the server
        fetch(`http://localhost:3010/tasks/${selectedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        }).then((response) => response.json())
            .then((data) => setTasks(tasks.map(task => task.id === data.id ? data : task)))
            .catch((error) => console.error('Error updating task:', error));
    };

    const handleRemovePeriod = (index) => {
        // Remove an activity period from the selected task
        const updatedTask = { ...selectedTask, activityPeriods: selectedTask.activityPeriods.filter((_, i) => i !== index) };
        setSelectedTask(updatedTask);

        // Save the changes to the server
        fetch(`http://localhost:3010/tasks/${selectedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        }).then((response) => response.json())
            .then((data) => setTasks(tasks.map(task => task.id === data.id ? data : task)))
            .catch((error) => console.error('Error updating task:', error));
    };

    return (
        <div className="view">
            <h1>Manage Time</h1>
            <h2>Observation Interval:</h2>
            <div>
                <b>From :</b>
                <input style={{ marginRight: '0.5em' }} type="datetime-local" value={new Date(startMoment + timeZone).toISOString().substring(0, 16)} onChange={e => setStartMoment(new Date(e.target.value).getTime())} />
                <b> To :</b>
                <input type="datetime-local" value={new Date(endMoment + timeZone).toISOString().substring(0, 16)} onChange={e => setEndMoment(new Date(e.target.value).getTime())} />
            </div>
            <h2>Select a Task:</h2>
            <select value={selectedTask ? selectedTask.id : ''} onChange={e => {
                console.log('Selected option value:', e.target.value);
                console.log('Tasks:', tasks);
                setSelectedTask(tasks.find(task => task.id === Number(e.target.value)))
            }}
            >
                <option value="">-- Select a task --</option>
                {tasks.map(task => <option key={task.id} value={task.id}>{task.name}</option>)}
            </select>
            {selectedTask && (
                <>
                    <h2>Activity Periods of Interest:</h2>
                    <ul>
                        {selectedTask.activityPeriods.filter(period => new Date(period.startDate).getTime() >= startMoment && (!period.endDate || new Date(period.endDate).getTime() <= endMoment)).map((period, index) => (
                            <li key={index}>
                                <b>From :</b>
                                <input style={{ marginRight: '0.5em' }} type="datetime-local" value={new Date(Math.max(new Date(period.startDate).getTime(), startMoment) + timeZone).toISOString().substring(0, 16)} onChange={e => handlePeriodChange(index, new Date(e.target.value).toISOString(), period.endDate)} />
                                <b> To :</b>
                                <input type="datetime-local" value={new Date((period.endDate ? Math.min(new Date(period.endDate).getTime(), endMoment) : endMoment) + timeZone).toISOString().substring(0, 16)} onChange={e => handlePeriodChange(index, period.startDate, new Date(e.target.value).toISOString())} />
                                <button onClick={() => handleRemovePeriod(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <button onClick={handleAddPeriod}>Add Period</button>
                </>
            )}
        </div>
    );
}

export default ManageTime;
