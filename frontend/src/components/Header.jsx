import React from 'react';

const Header = ({ onNewTask }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">📋 Task Manager</h1>
        <button className="btn-new-task" onClick={onNewTask}>
          <span>+</span> New Task
        </button>
      </div>
    </header>
  );
};

export default Header;
