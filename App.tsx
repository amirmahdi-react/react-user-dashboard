import React, { useState } from 'react';
import './style.css';

interface User {
  id: number;
  name: string;
  role: string;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Ali Rezaei", role: "Frontend Developer" },
    { id: 2, name: "Sara Ahmadi", role: "UI/UX Designer" },
  ]);

  const addUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: "New User",
      role: "Tester"
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="dashboard-container">
      <h1>User Management Dashboard</h1>
      <button className="add-btn" onClick={addUser}>+ Add New User</button>
      
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
