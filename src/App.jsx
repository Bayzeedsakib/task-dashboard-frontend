import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const response = await fetch("http://localhost:5000/api/tasks");

    const data = await response.json();

    setTasks(data);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleEdit(task) {
    setEditingTaskId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (editingTaskId) {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) => (task.id === editingTaskId ? updatedTask : task)),
      );

      setEditingTaskId(null);
    } else {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const newTask = await response.json();

      setTasks([newTask, ...tasks]);
    }

    setFormData({
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium",
      dueDate: "",
    });
  }

  async function handleDelete(id) {
    const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <p>Manage your tasks from one place.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{tasks.filter((task) => task.status === "Pending").length}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{tasks.filter((task) => task.status === "In Progress").length}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{tasks.filter((task) => task.status === "Completed").length}</p>
        </div>
      </div>

      <section className="form-section">
        <h2>{editingTaskId ? "Update Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="primary-button" type="submit">
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </section>

      <section className="tasks-section">
        <h2>Tasks</h2>

        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                <strong>Status:</strong> {task.status}
              </p>

              <p>
                <strong>Priority:</strong> {task.priority}
              </p>

              <p>
                <strong>Due Date:</strong> {task.dueDate || "No due date"}
              </p>

              <div className="task-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
