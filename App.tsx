import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './style.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("my_tasks_v2");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Complete React Dashboard", completed: false, createdAt: new Date().toLocaleDateString() },
      { id: 2, title: "Review TypeScript Code", completed: true, createdAt: new Date().toLocaleDateString() },
      { id: 3, title: "Deploy to Production", completed: true, createdAt: new Date().toLocaleDateString() }
    ];
  });
  
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("my_tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const chartData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];
  const COLORS = ['#48bb78', '#ed8936'];

  const addTask = () => {
    if (inputValue.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      title: inputValue,
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };
    setTasks([newTask, ...tasks]);
    setInputValue("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark' : ''}`}>
      <div className="app-container">
        <div className="header">
          <div>
            <h1>Task Master</h1>
            <p className="subtitle">Built with React & TypeScript</p>
          </div>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="chart-container">
          <h3>Task Overview</h3>
          {tasks.length > 0 ? (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-msg">No data for chart.</p>
          )}
        </div>

        <div className="input-section">
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="filters">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Active</button>
          <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="empty-msg">No tasks found. Add one above!</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
                <div className="task-content" onClick={() => toggleTask(task.id)}>
                  <span className="checkbox">{task.completed ? "✓" : ""}</span>
                  <div>
                    <p className="task-title">{task.title}</p>
                    <span className="task-date">Created: {task.createdAt}</span>
                  </div>
                </div>
                <button className="del-btn" onClick={() => deleteTask(task.id)}>✕</button>
              </div>
            ))
          )}
        </div>
        
        <div className="footer">
          <p>Total: {tasks.length} | Completed: {completedTasks} | Active: {pendingTasks}</p>
        </div>
      </div>
    </div>
  );
}
