import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatusFilter from './components/StatusFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import { getTasks, createTask, updateTask, deleteTask } from './api/client';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Always fetch ALL tasks — filter client-side so tab counts stay accurate
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setError(null);
      await createTask(formData);
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setError(null);
      await updateTask(editingTask.id, formData);
      setEditingTask(null);
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setError(null);
      await deleteTask(deleteTarget.id);
      setDeleteTarget(null);
      loadTasks();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Client-side filtering
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  return (
    <div className="app-container">
      <Header onNewTask={handleNewTask} />
      
      <main className="main-content">
        <StatusFilter 
          currentFilter={filter} 
          onFilterChange={handleFilterChange} 
          tasks={tasks}
        />
        
        <TaskList 
          tasks={filteredTasks} 
          loading={loading}
          onEdit={handleEditTask}
          onDelete={setDeleteTarget}
        />
      </main>

      {showForm && (
        <TaskForm 
          task={editingTask}
          onSave={editingTask ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog 
          task={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {error && (
        <div className="error-toast">
          <span>⚠️ {error}</span>
          <button className="btn-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
