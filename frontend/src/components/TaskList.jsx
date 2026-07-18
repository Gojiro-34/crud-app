import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No tasks found</h3>
        <p>You're all caught up! Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default TaskList;
