import React, { useState, useEffect } from "react";
import { postService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import CreatePost from "../components/Post/CreatePost";
import PostList from "../components/Post/PostList";
import TaskWidget from '../components/Task/TaskWidget';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState([]);
    const [error, setError] = useState('');
    const [lastPost, setLastPost] = useState(null);
    const { currentUser } = useAuth();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await postService.getFriendsPosts(currentUser.uid);
            if (response.data.success) {
                setPosts(response.data.posts);
            } else {
                setError(response.data.error || 'Failed to load posts');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const loadMorePosts = async () => {
        if (!lastPost) return;

        try {
            const response = await postService.getFeed(currentUser.uid, lastPost);
            if (response.data.success) {
                setPosts([...posts, ...response.data.feed.posts]);
                setLastPost(response.data.feed.last_post);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load more posts');
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchPosts();
        }
    }, [currentUser]);

    const handleNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
    }

    if (loading && posts.length === 0) {
        return <div>Loading posts...</div>;
    }

    return (
        <div className="home-container">
            <h1>Optima Dashboard</h1>

            <div className="dashboard-overview">
                <div className="screentime-stats">
                    <h2>Your Screentime</h2>
                    <div className="stat-card">
                        <div className="stat-value">2h 15m</div>
                        <div className="stat-label">Available Today</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">30m</div>
                        <div className="stat-label">Earned Today</div>
                    </div>
                </div>

                <TaskWidget />
            </div>

            <div className="social-feed-section">
                <h2>Task Accomplishment</h2>
                <CreatePost onPostCreated={handleNewPost} />

                {error && <div className="alert alert-danger">{error}</div>}

                <PostList posts={posts} />

                {lastPost && (
                    <button onClick={loadMorePosts} className="load-more-button">
                        Load More
                    </button>
                )}

                {posts.length === 0 && !loading && (
                    <div className="no-posts-message">
                        No posts to show. Complete tasks and share your achievements!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;