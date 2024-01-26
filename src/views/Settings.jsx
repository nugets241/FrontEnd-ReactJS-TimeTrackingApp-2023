import React from 'react';

function Settings({ theme, setTheme, singleTaskMode, setSingleTaskMode }) {
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleModeChange = (event) => {
    setSingleTaskMode(event.target.checked);
  };

  return (
    <div className='view'>
      <h2>Settings</h2>
      <div>
        <label>
          Theme:
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Single Task Mode:
          <input type="checkbox" checked={singleTaskMode} onChange={handleModeChange} />
        </label>
      </div>
    </div>
  );
}

export default Settings;
