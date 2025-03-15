import React, { useState} from "react";
import { postService } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [selectedTask, setSelectedTask] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    // fake task for demo
    const completedTasks = [
        { id: 3, title: 'Go for a walk', reward: '25m' },
        { id: 5, title: 'Finish math assignment', reward: '20m' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        setLoading(true);
        setError('');

        // add task info to the post cintent if a task is selected
        const taskContent = selectedTask
            ? `🏆 Completed: ${selectedTask} (+${completedTasks.find(t => t.title === selectedTask)?.reward} earned)\n\n${content}`
        : content;

        try {
            const response = await postService.createPost(currentUser.uid, taskContent);

            if (response.data.success) {
                setContent('');
                setSelectedTask('');

                // if we have the post ID, fetch the full post data to add to the feed
                if (response.data.postId) {
                    const postResponse = await postService.getPost(response.data.postId);
                    if (postResponse.data.success) {
                        onPostCreated(postResponse.data.post);
                    }
                } 
            } else {
                setError(response.data.error || 'Failed to create post');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post">
            <h3>Share Your Achievement</h3>
            {error && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="task-selection">
                    <label>Share a completed task</label>
                    <select 
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                    >
                        <option value=''>Select a task (optional)</option>
                        {completedTasks.map(task => (
                            <option key={task.id} value={task.title}>
                                {task.title} (+{task.reward})
                            </option>
                        ))}
                    </select>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts about completing this task..."
                    rows={4}
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !content.trim()}>
                    {loading ? 'Posting...' : 'Share Achievements'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;