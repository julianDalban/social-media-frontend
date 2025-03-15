import React, { useState, useEffect, use } from "react";
import { Link, useAsyncError } from "react-router-dom";
import { postService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import CommentSection from '/CommentSection';

const PostItem = ({ post }) => {
    const [isLiked, setIsLiked] = useState(null);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    // check id post content contains task completion marker
    const isTaskCompletion = post.content && post.content.includes('🏆 Completed:');

    // Extract task info if it's a task completion post
    const getTaskInfo = () => {
        if (!isTaskCompletion) return null;

        const taskLine = post.content.split('\n\n')[0];
        const taskName = taskLine.replace('🏆 Completed: ', '').split(' (+')[0]
        const screentime = taskLine.match(/\(\+([^)]+)\)/)?.[1] || '';

        return {
            taskName,
            screentime,
            message: post.content.split('\n\n')[1] || ''
        };
    };

    const taskInfo = getTaskInfo();

    useEffect(() => {
        // check if current user has liked the post
        const checkLikeStatus = async () => {
            try {
                const response = await postService.checkLikeStatus(post.id, currentUser.uid);
                if (response.data.success) {
                    setIsLiked(response.data.liked);
                }
            } catch (error) {
                console.log('Error checking like status:', error);
            }
        } ;

        if (currentUser) {
            checkLikeStatus();
        }
    }, [post.id, currentUser]);

    const handleToggleLike = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await postService.toggleLike(post.id, currentUser.uid);

            if (response.data.success) {
                const newLikedState = response.data.isLiked;
                setIsLiked(newLikedState);
                setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className={`post-item ${isTaskCompletion ? 'achievment-post' : ''}`}>
            <div className="post-header">
                <Link to={`/profile/${post.userId}`} className="post-author">
                    {post.username}
                </Link>
                <span className="postdate">{formatDate(post.createdAt)}</span>
            </div>

            {isTaskCompletion ? (
                <div className="achievement-content">
                    <div className="achievement-badge">
                        <span role="img" aria-label="trophy">🏆</span>
                    </div>
                    <div className="achievement-details">
                        <h4>Completed: {taskInfo.taskName}</h4>
                        <div className="achievement-reward">
                            Earned: <span className="screentime-reward">{taskInfo.screentime} screentime</span>
                        </div>
                        {taskInfo.message && (
                        <div className="achievement-message">
                            {taskInfo.message}
                        </div>
                        )}
                    </div>
                </div>    
            ) : (
                <div className="post-content">{post.content}</div>
            )}

            <div className="post-actions">
                <button
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleToggleLike}
                    disabled={loading}
                >
                    {isLiked ? 'Liked' : 'Like'} ({likesCount})
                </button>

                <button
                    className="comment-button"
                    onClick={() => setShowComments(!showComments)}
                >
                    Comments ({post.comments?.length || 0})
                </button>
            </div>

            {showComments && <CommentSection postId={post.id} comments={post.comments || []} />}
        </div>
    );
};

export default PostItem;