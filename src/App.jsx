import { useEffect, useState } from "react";

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
    <div>
      <h1>Task Dashboard</h1>

      <h2>Add Task</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
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

        <div>
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <hr />

      <h2>Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>Status: {task.status}</p>

          <p>Priority: {task.priority}</p>

          <p>Due Date: {task.dueDate || "No due date"}</p>

          <button onClick={() => handleEdit(task)}>Edit</button>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
