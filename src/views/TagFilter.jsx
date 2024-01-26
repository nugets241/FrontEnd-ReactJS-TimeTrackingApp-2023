import React from 'react';

function TagFilter({ allTags, selectedTags, setSelectedTags }) {
  return (
    <div className='task-list'>
      <h5> <em>TAGS : </em></h5>
      <div>
        <button onClick={() => setSelectedTags([])}>Show All</button>
        {/* Add checkboxes for tag selection */}
        {allTags.map(tag => (
          <label key={tag}>
            <input
              style={{ cursor: 'pointer' }}
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
            />
            {tag}
          </label>
        ))}
      </div>
    </div>
  );
}

export default TagFilter;
