import React, { useEffect, useState } from 'react';
import TagFilter from './TagFilter'; // Import the TagFilter component
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ListItem from './ListItem';

function Home({ tasks, setTasks, allTags, selectedTags, setSelectedTags, singleTaskMode, updateTasks }) {
  const [taskName, setTaskName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTagInputs, setNewTagInputs] = useState({});

  const addTag = (index, newTagValue) => {
    if (newTagValue.trim() !== '') {
      const updatedTasks = [...tasks];
      const task = updatedTasks[index];
      task.tags = [...task.tags, newTagValue];
      fetch(`http://localhost:3010/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
        .then((response) => response.json())
        .then(() => {
          setTasks(updatedTasks);
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const removeTag = (taskIndex, tagIndex) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[taskIndex];
    if (task.tags.length > 1) {
      task.tags = task.tags.filter((_tag, index) => index !== tagIndex);
      fetch(`http://localhost:3010/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks(updatedTasks);
        })
        .catch((error) => console.error('Error:', error));
    } else {
      alert('Cannot remove the tag. A task must have at least one tag.');
    }
  };

  const createTask = () => {
    if (taskName.trim() !== '' && newTag.trim() !== '') {
      const newTaskObject = {
        name: taskName,
        activityPeriods: [],
        tags: [newTag],
      };
      fetch('http://localhost:3010/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskObject),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks([...tasks, data]);
          setTaskName('');
          setNewTag('');
        })
        .catch((error) => console.error('Error:', error));
    } else {
      alert('Please enter a task name and a tag.');
    }
  };

  const removeTask = (task) => {
    fetch(`http://localhost:3010/tasks/${task.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter((t) => t !== task));
      })
      .catch((error) => console.error('Error:', error));
  };

  function handleOnDragEnd(result) {
    const { source, destination, type } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "group") {
      const reorderedTasks = [...tasks];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      const [removedTask] = reorderedTasks.splice(sourceIndex, 1);
      reorderedTasks.splice(destinationIndex, 0, removedTask);

      // Update the order of tasks in the state
      setTasks(reorderedTasks);

      // Update the order of tasks in the backend
      reorderedTasks.forEach((task, index) => {
        const updatedTask = { ...task, order: index };
        fetch(`http://localhost:3010/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        })
          .then((response) => response.json())
          .catch((error) => console.error('Error:', error));
      });
    }
  }

  return (
    <div className="view">
      <h1>Home</h1>

      {/* Render the TagFilter component */}
      <TagFilter allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />


      <h2>Add Task</h2>
      <div>
        <label>
          <b>Task Name :</b>

          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        </label>
        <label>
          <b>Tag :</b>

          <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
          <select
            value={newTag || ''}
            onChange={(e) => setNewTag(e.target.value)}
          >
            <option value="">Select tag...</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <button onClick={createTask} style={{ padding: '.5em', fontSize: '1em', borderRadius: '5px' }}>Create Task</button>
      </div>

      {/* Display tasks here based on tasks prop */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='ROOT' type='group'>
          {(provided) => (
            <ul  {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, taskIndex) => (
                ////////////////////////////////////////////////////// LIST
                <Draggable key={task.id} draggableId={String(task.id)} index={taskIndex}>
                  {(provided) => (
                    <ListItem
                      task={task}
                      taskIndex={taskIndex}
                      tasks={tasks}
                      setTasks={setTasks}
                      removeTask={removeTask}
                      addTag={addTag}
                      removeTag={removeTag}
                      newTagInputs={newTagInputs}
                      setNewTagInputs={setNewTagInputs}
                      allTags={allTags}
                      provided={provided}
                      singleTaskMode={singleTaskMode}
                      updateTasks={updateTasks}
                    />
                  )}
                </Draggable>
                ////////////////////////////////////////////////////// LIST
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Home;