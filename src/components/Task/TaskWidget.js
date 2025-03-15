import React, { useState } from "react";
import TaskItem from './TaskItem';

const TaskWidget = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete homework', reward: '15m', completed: false },
        { id: 2, title: 'Read for 30 minutes', reward: '20m', completed: false },
        { id: 3, title: 'Go for a walk', reward: '25m', completed: true },
        { id: 4, title: 'Practice piano', reward: '15m', completed: false }
    ]);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskReward, setNewTaskReward] = useState('15m');

    const handleCompleteTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? {...task, completed: !task.completed } : task
        ));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: Date.now(),
            title: newTaskTitle,
            reward: newTaskReward,
            completed: false
        };

        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
    };
    
    return (
        <div className="task-widget">
            <h2>Daily Tasks</h2>

            <div className="tasks-list">
                {tasks.map(task => {
                    <TaskItem
                        key={task.id}
                        task={task}
                        onComplete={() => handleCompleteTask(task.id)}
                    />
                })}
            </div>

            <form onSubmit={handleAddTask} className="add-task-form">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <select
                    value={newTaskReward}
                    onChange={(e) => setNewTaskReward(e.target.value)}
                >
                    <option value='5m'>5 minutes</option>
                    <option value="10m">10 minutes</option>
                    <option value="15m">15 minutes</option>
                    <option value="20m">20 minutes</option>
                    <option value="30m">30 minutes</option>
                </select>
                <button type='submit'>Add Task</button>
            </form>
        </div>
    );
};

export default TaskWidget;