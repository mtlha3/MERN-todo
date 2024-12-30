import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [taskName, setTaskName] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');

  const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (taskName.trim()) {
      try {
        const newTask = { name: taskName, status: 'active' };
        const response = await axios.post(API_URL, newTask);
        setTasks([...tasks, response.data]);
        setTaskName('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const task = tasks.find((task) => task._id === id);
      const updatedTask = { ...task, status: task.status === 'active' ? 'completed' : 'active' };
      const response = await axios.put(`${API_URL}/${id}`, updatedTask);
      setTasks(tasks.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async () => {
    if (editTaskId && editTaskName.trim()) {
      try {
        const updatedTask = { name: editTaskName };
        const response = await axios.put(`${API_URL}/${editTaskId}`, updatedTask);
        setTasks(tasks.map((t) => (t._id === editTaskId ? response.data : t)));
        setEditTaskId(null);
        setEditTaskName('');
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === 'All' ? true : filter === 'Active' ? task.status === 'active' : task.status === 'completed'
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Todo List</h1>
      <div className="w-full max-w-md flex mb-4">
        <input
          type="text"
          placeholder="Enter task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <div className="flex space-x-4 mb-6">
        {['All', 'Active', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="w-full max-w-md bg-white rounded-md shadow-md divide-y divide-gray-200">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span
                onClick={() => toggleStatus(task._id)}
                className={`cursor-pointer ${
                  task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {task.name}
              </span>
              <div className="flex space-x-4">
                {task.status === 'active' && (
                  <button
                    onClick={() => toggleStatus(task._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                  >
                    Mark as Complete
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditTaskId(task._id);
                    setEditTaskName(task.name);
                  }}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500 text-center">No tasks found</li>
        )}
      </ul>
      {editTaskId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Edit Task</h2>
            <input
              type="text"
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={updateTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditTaskId(null);
                  setEditTaskName('');
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
