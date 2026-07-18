import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'todo') return 'var(--status-todo)';
    if (s === 'in-progress') return 'var(--status-in-progress)';
    if (s === 'done') return 'var(--status-done)';
    return 'var(--text-muted)';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = () => {
    if (!task.due_date || task.status?.toLowerCase() === 'done') return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const getDaysAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffTime = Math.abs(new Date() - new Date(dateStr));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div 
      className="task-card" 
      style={{ '--status-color': getStatusColor(task.status) }}
    >
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-status">{task.status || 'todo'}</span>
      </div>
      
      <p className="task-desc">{task.description}</p>
      
      <div className="task-footer">
        <div className={`task-date ${isOverdue() ? 'overdue' : ''}`}>
          📅 {formatDate(task.due_date)} {isOverdue() ? '(Overdue)' : ''}
          {task.created_at && ` • ${getDaysAgo(task.created_at)}`}
        </div>
        
        <div className="task-actions">
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit task">
            ✏️
          </button>
          <button className="btn-icon danger" onClick={() => onDelete(task)} title="Delete task">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
