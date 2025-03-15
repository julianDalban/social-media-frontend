import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const CommentSection = ({ postId, comments: initialComments = [] }) => {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    const fetchComments = async () => {
        try {
            const response = await postService.getComments(postId);
            if (response.data.success) {
                setComments(response.data.comments.comments || []);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await postService.addComment(
                postId,
                currentUser.uid,
                newComment
            );

            if (response.data.success) {
                setComments([...comments, response.data.comment]);
                setNewComment('');
            } else {
                setError(response.data.error || 'Failed to add comment');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="comment-section">
            <h4>Comments</h4>
        
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <Link to={`/profile/${comment.userId}`} className="comment-author">
                                    {comment.username}
                                </Link>
                                <span className="comment-date">
                                    {formatDate(comment.createdAt)}
                                </span>
                            </div>
                        <div className="comment-content">{comment.content}</div>
                        </div>
                    ))
                )}
            </div>
        
            <form onSubmit={handleSubmitComment} className="comment-form">
                {error && <div className="alert alert-danger">{error}</div>}
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !newComment.trim()}>
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
}

export default CommentSection;