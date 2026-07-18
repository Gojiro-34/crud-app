import React from 'react';

const ConfirmDialog = ({ task, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-danger)' }}>⚠️</span> Delete Task
          </h2>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to delete the task <strong>"{task.title}"</strong>?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This action cannot be undone.</p>
        </div>
        
        <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
