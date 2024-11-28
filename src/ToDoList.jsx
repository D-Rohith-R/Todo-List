import React, { useState } from 'react';

// Modal component for confirmation
function DeleteConfirmationModal({ onConfirm, onCancel, taskName }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Are you sure you want to delete the task: "{taskName}"?</h2>
                <div>
                    <button className="confirm-button" onClick={onConfirm}>Yes, Delete</button>
                    <button className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [showModal, setShowModal] = useState(false); // Controls the visibility of the delete confirmation modal
    const [taskToDelete, setTaskToDelete] = useState(null); // Stores the task to be deleted
    const [filter, setFilter] = useState('all'); // Filter state to show all, finished, or unfinished tasks

    // Handle input change (for adding or editing tasks)
    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    // Add a new task
    function addTask() {
        if (newTask.trim() !== "") {
            if (editIndex === null) {
                setTasks((prevTasks) => [...prevTasks, { text: newTask, completed: false }]);
            } else {
                const updatedTasks = [...tasks];
                updatedTasks[editIndex] = { ...updatedTasks[editIndex], text: newTask }; // Update the task at the editIndex
                setTasks(updatedTasks);
                setEditIndex(null); // Reset editing mode
            }
            setNewTask(""); // Clear the input field
        }
    }

    // Show the delete confirmation modal
    function showDeleteModal(index) {
        setTaskToDelete(index); // Store the task index to be deleted
        setShowModal(true); // Show the modal
    }

    // Confirm delete action
    function confirmDelete() {
        if (taskToDelete !== null) {
            const updatedTasks = tasks.filter((_, i) => i !== taskToDelete);
            setTasks(updatedTasks);
            setShowModal(false); // Close the modal after confirming delete
            setTaskToDelete(null); // Reset the task to delete
        }
    }

    // Cancel delete action
    function cancelDelete() {
        setShowModal(false); // Close the modal without deleting
        setTaskToDelete(null); // Reset the task to delete
    }

    // Move a task up in the list
    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    // Move a task down in the list
    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    // Start editing a task
    function startEditing(index) {
        setEditIndex(index);
        setNewTask(tasks[index].text); // Populate the input field with the task's current text
    }

    // Toggle the completion status of a task
    function toggleCompletion(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed; // Toggle the completed status
        setTasks(updatedTasks);
    }

    // Filter tasks based on their completion status
    function filteredTasks() {
        if (filter === 'finished') {
            return tasks.filter(task => task.completed);
        } else if (filter === 'unfinished') {
            return tasks.filter(task => !task.completed);
        }
        return tasks; // Show all tasks by default
    }

    return (
        <div className="to-do-list">
            <h1>To-Do-List</h1>

            <div>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>
                    {editIndex === null ? "Add" : "Update"} {/* Change button text based on edit state */}
                </button>
            </div>

            {/* Filter options */}
            <div className='filter'>
                <button 
                    className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button 
                    className={`filter-button ${filter === 'unfinished' ? 'active' : ''}`} 
                    onClick={() => setFilter('unfinished')}
                >
                    Unfinished
                </button>
                <button 
                    className={`filter-button ${filter === 'finished' ? 'active' : ''}`} 
                    onClick={() => setFilter('finished')}
                >
                    Finished
                </button>
            </div>

            <ol>
                {filteredTasks().map((task, index) => (
                    <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleCompletion(index)} 
                        />
                        <span className="text">{task.text}</span>
                        <button className="delete-button" onClick={() => showDeleteModal(index)}>
                        🗑️ Delete
                        </button>
                        <button className="move-button" onClick={() => startEditing(index)}>
                            ✏️ Edit
                        </button>
                        <button className="move-button" onClick={() => moveTaskUp(index)}>
                            ☝
                        </button>
                        <button className="move-button" onClick={() => moveTaskDown(index)}>
                            👇
                        </button>
                    </li>
                ))}
            </ol>

            {/* Modal for delete confirmation */}
            {showModal && (
                <DeleteConfirmationModal 
                    onConfirm={confirmDelete} 
                    onCancel={cancelDelete} 
                    taskName={tasks[taskToDelete]?.text} 
                />
            )}
        </div>
    );
}

export default ToDoList;
