import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    due_date: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status?.toLowerCase() || 'todo',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim() !== '') {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Ensure we send standard status values
    const payload = {
      ...formData,
      due_date: formData.due_date || null
    };
    
    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button type="button" className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                autoFocus
              />
              {error && <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>{error}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="due_date">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                className="form-input"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
