import React from "react";

const TaskItem = ({task, onComplete}) => {
    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-checkbox">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onComplete}
                />
            </div>
            <div className="task-details">
                <span className="task-title">{task.title}</span>
                <span className="task-reward">+{task.reward} screentime</span>
            </div>
            <div className="task-actions">
                {task.completed ? (
                    <button className="share-button">Share</button>
                ) : (
                    <button onClick={onComplete} className="complete-button">Complete</button>
                )}
            </div>
        </div>
    );
};

export default TaskItem;