// Runtime config for K8s is managed here, using the vite env var or falling back to localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch (e) {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  // If response is 204 No Content, return null
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const getTasks = (status) => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/api/tasks${query}`);
};

export const getTask = (id) => {
  return request(`/api/tasks/${id}`);
};

export const createTask = (data) => {
  return request(`/api/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTask = (id, data) => {
  return request(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteTask = (id) => {
  return request(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
};
