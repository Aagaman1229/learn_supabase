
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
function TaskManagement({session}) {
  // FIX 1: Corrected the typo "tsak" to "task".
  const [newTask, setNewTask] = useState({ task: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [newDescription, setNewDescription] = useState(""); 
  const fetchTasks = async () => {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching data:", error);
      return;
    } else {
      console.log("Fetched tasks:", data);
    }
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
    console.log(tasks);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX 2: Ensure the object keys match the state.
    const { data, error } = await supabase.from("tasks").insert({...newTask, email: session.user.email}).single();

    if (error) {
      console.error("Error inserting data:", error);
      return;
    } else {
      console.log("Task added successfully:", data);
    }
    // Reset the form fields after successful submission
    setNewTask({ task: "", description: "" });
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);
      // equivalance condition
    if (error) {
      console.error("Error deleting task:", error);
      return;
    } else {
      console.log("Task deleted successfully:", data);
      // Refresh the task list after deletion
      fetchTasks();
    }
  };


  const updateTask = async (id) => { 
    const { data, error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id);
    
    if (error) {
      console.error("Error updating task:", error);
      return;
    } else {
      console.log("Task updated successfully:", data);
      // Refresh the task list after update
      fetchTasks();
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>

      {/* Form to add a new task */}
      {/* FIX 3: The onSubmit prop must be on the <form> element, not the button. */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, task: e.target.value }))
          }
          // FIX 4: The value prop must match the state property "task".
          value={newTask.task}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Task Description"
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          // FIX 5: Textarea also needs a value prop to be a controlled component.
          value={newTask.description}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        {/* The button's type is "submit", so it automatically triggers the form's onSubmit event */}
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </form>

    
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task,key) => (
        <li
          key={key}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <div>
            <h3>{task.task}</h3>
            <p>{task.description}</p>
            <div>
              <textarea
                placeholder="Update Task description"
                onChange={(e) => {setNewDescription(e.target.value )}}/>
              <button 
              style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
              onClick={() => updateTask(task.id, { task: newDescription })}
              >
                Edit
              </button>
              <button 
                style={{ padding: "0.5rem 1rem" }}
                onClick={() => deleteTask(task.id)}
              >Delete</button>
            </div>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManagement;