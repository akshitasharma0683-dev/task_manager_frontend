import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../api/api";

// ✅ user-scoped localStorage key
const getCompletedKey = () => {
  const email = localStorage.getItem("user_email") || "guest";
  return `completed_tasks_${email}`;
};

export default function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // ✅ completed tasks (persisted per user)
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem(getCompletedKey());
    return saved ? JSON.parse(saved) : [];
  });

  // LOAD TASKS
  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // SAVE completed tasks per user
  useEffect(() => {
    localStorage.setItem(
      getCompletedKey(),
      JSON.stringify(completed)
    );
  }, [completed]);

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({ title });
    setTitle("");
    setTasks(await getTasks());
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteTask(id);

    setCompleted((prev) => prev.filter((t) => t !== id));
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // UPDATE
  const handleUpdate = async (id) => {
    await updateTask(id, { title: editTitle });
    setEditingId(null);
    setTasks(await getTasks());
  };

  // TOGGLE COMPLETE
  const toggleComplete = (id) => {
    setCompleted((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // SORT: active first, completed last
  const sortedTasks = [
    ...tasks.filter((t) => !completed.includes(t.id)),
    ...tasks.filter((t) => completed.includes(t.id)),
  ];

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3>Task Manager</h3>
        <p className="muted">Your workspace</p>

        <div className="stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{completed.length}</strong>
            <span>Completed</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        <h2>What’s on your mind today?</h2>

        <form onSubmit={handleCreate} className="task-form">
          <input
            placeholder="Write a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button>Add</button>
        </form>

        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${
              completed.includes(task.id) ? "completed" : ""
            }`}
          >
            {editingId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => handleUpdate(task.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={completed.includes(task.id)}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <span>{task.title}</span>
                </div>

                <div className="task-actions">
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="muted">You’re all clear 🌿</p>
        )}
      </main>

      {/* RIGHT PANEL */}
      <section className="schedule">
        <h3>Planned</h3>

        {tasks.slice(0, 5).map((task) => (
          <div className="schedule-card" key={task.id}>
            <strong>{task.title}</strong>
            <p className="muted">Planned task</p>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="muted">Nothing planned</p>
        )}
      </section>
    </div>
  );
}
