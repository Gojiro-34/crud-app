import React from 'react';

const StatusFilter = ({ currentFilter, onFilterChange, tasks }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'Todo' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' }
  ];

  const getCount = (statusId) => {
    if (statusId === 'all') return tasks.length;
    return tasks.filter(t => t.status && t.status.toLowerCase() === statusId).length;
  };

  return (
    <div className="status-filter">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`filter-tab ${currentFilter === tab.id ? 'active' : ''}`}
          onClick={() => onFilterChange(tab.id)}
        >
          {tab.label}
          <span className="filter-count">{getCount(tab.id)}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
