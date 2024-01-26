import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './views/Home';
import AnalyzeTime from './views/AnalyzeTime';
import Info from './views/Info';
import ManageTime from './views/ManageTime';
import DailyActivityChart from './views/DailyActivityChart';
import Settings from './views/Settings'; // Add this line
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [theme, setTheme] = useState('light');
  const [singleTaskMode, setSingleTaskMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  const [error, setError] = useState(null); // Add this line

  useEffect(() => {
    fetch('http://localhost:3010/settings')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching settings');
        }
      })
      .then((data) => {
        setTheme(data.theme);
        setSingleTaskMode(data.singleTaskMode);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3010/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [selectedTags]);

  useEffect(() => {
    if (!isLoading) {
      fetch('http://localhost:3010/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme, singleTaskMode }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error updating settings');
          }
        })
        .catch((error) => setError(error.message));
    }
  }, [theme, singleTaskMode, isLoading]);
  const allTags = [...new Set(tasks.flatMap(task => task.tags))];
  const filteredTasks = selectedTags.length > 0 ? tasks.filter(task => selectedTags.every(tag => task.tags.includes(tag))) : tasks;


  function updateTasks(updatedTask) {
    fetch('http://localhost:3010/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }

  return (
    <Router>
      <div className={theme}>
        <nav>
          <ul className='navList'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/analyze">Analyze Time</Link></li>
            <li><Link to="/manage-intervals">Manage Time</Link></li>
            <li><Link to="/chart">Activity Chart</Link></li>
            <li><Link to="/info">Info</Link></li>
            <li><Link to="/settings">Settings</Link></li> {/* Add this line */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home tasks={filteredTasks} setTasks={setTasks} allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} singleTaskMode={singleTaskMode} updateTasks={updateTasks} />} />
          <Route path="/analyze" element={<AnalyzeTime tasks={tasks} setTasks={setTasks} />} />
          <Route path="/manage-intervals" element={<ManageTime tasks={tasks} setTasks={setTasks} />} />
          <Route path="/chart" element={<DailyActivityChart tasks={tasks} />} />
          <Route path="/info" element={<Info />} />
          <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} singleTaskMode={singleTaskMode} setSingleTaskMode={setSingleTaskMode} />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
