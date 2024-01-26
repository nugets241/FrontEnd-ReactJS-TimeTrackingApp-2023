import React, { useState } from 'react';
import TimeButton from "./TimeButton";

function ListItem({
    task,
    taskIndex,
    tasks,
    setTasks,
    removeTask,
    addTag,
    removeTag,
    newTagInputs,
    setNewTagInputs,
    allTags,
    provided,
    singleTaskMode,
    updateTasks
}) {
    return (
        <div className='task-list'>
            <li className='tasks' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <div className='task-list'>
                    <div style={{ position: "relative", width: '100%' }}>
                        <button
                            onClick={() => removeTask(task)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 10, // Add some space between the button and the edge of the container
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '.5em 1em',
                                borderRadius: '5px',
                                fontWeight: 'bold'
                            }}
                        >
                            X
                        </button>
                    </div>
                    <div className='task-list' style={{ paddingTop: '.5em' }}>
                        <input
                            type="text"
                            value={task.name}
                            onChange={(e) => {
                                const updatedTasks = [...tasks];
                                updatedTasks[taskIndex].name = e.target.value;
                                fetch(`http://localhost:3010/tasks/${task.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(updatedTasks[taskIndex]),
                                })
                                    .then((response) => response.json())
                                    .then(() => {
                                        setTasks(updatedTasks);
                                    })
                                    .catch((error) => console.error('Error:', error));
                            }}
                            style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.2em' }}
                        />

                        <ul>
                            {task.tags.map((tag, tagIndex) => (
                                <li className='tags' key={tagIndex}>
                                    {tag}{' '}
                                    <button onClick={() => removeTag(taskIndex, tagIndex)}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={newTagInputs[taskIndex] || ''}
                            onChange={(e) => {
                                setNewTagInputs({
                                    ...newTagInputs,
                                    [taskIndex]: e.target.value,
                                });
                            }}
                        />
                        <select
                            value={newTagInputs[taskIndex] || ''}
                            onChange={(e) => {
                                addTag(taskIndex, e.target.value);
                                setNewTagInputs({
                                    ...newTagInputs,
                                    [taskIndex]: '',
                                });
                            }}
                        >
                            <option value="">Select tag...</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => {
                                addTag(taskIndex, newTagInputs[taskIndex]);
                                setNewTagInputs({
                                    ...newTagInputs,
                                    [taskIndex]: '',
                                });
                            }}
                        >
                            Add Tag
                        </button>
                    </div>
                    <TimeButton task={task} tasks={tasks} setTasks={setTasks} singleTaskMode={singleTaskMode} updateTasks={updateTasks} />
                </div>
            </li>
        </div>
    );
}

export default ListItem;
