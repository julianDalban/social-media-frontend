import React, { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import { userService, friendService, postService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PostList from '../components/Post/PostList';

const Profile = () => {
    const { userId } = useParams();
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFriend, setIsFriend] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    // mock screentime stats for demo
    const screentimeStats = {
        daily: '2h 45m',
        weeklyAvg: '3h 20m',
        earned: '4h 15m',
        tasksCompleted: 12
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await userService.getProfile(userId);
                if (response.data.success) {
                    setProfile(response.data.profile);

                    // check if this is the current user's profile
                    setIsOwnProfile(currentUser.uid === userId);

                    //check if the user is a friend
                    if (response.data.profile.friends && currentUser) {
                        setIsFriend(response.data.profile.friends.includes(currentUser.uid));
                    }

                    // get user's posts
                    const postsResponse = await postService.getFriendsPosts(userId);
                    if (postsResponse.data.success) {
                        setPosts(postsResponse.data.posts);
                    }
                }
            } catch (err) {
                setError('Failed to load profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId, currentUser]);

    const handleToggleFriend = async () => {
        try {
            if (isFriend) {
                await friendService.removeFriend(currentUser.uid, userId);
            } else {
                await friendService.addFriend(currentUser.uid, userId);
            }

            setIsFriend(!isFriend);
        } catch (err) {
            console.error('Error toggling friend status:', err);
        }
    };

    const handleToggleFollow = async () => {
        try {
            const response = await friendService.toggleFollow(currentUser.uid, userId);
            if (response.data.success) {
                setIsFollowing(response.data.following);
            }
        } catch (err) {
            console.error('Error toggling follow status:', err);
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!profile) {
        return <div>Profile not found</div>;
    }

    return (
        <div className="profile-container">
          <div className="profile-header">
            {profile.profile_picture && (
              <img
                src={profile.profile_picture}
                alt={`${profile.username}'s profile`}
                className="profile-image"
              />
            )}
            
            <div className="profile-info">
              <h1>{profile.username}</h1>
              
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              
              <div className="profile-stats">
                <div className="stat">Friends: {profile.friends?.length || 0}</div>
                <div className="stat">
                  Followers: {profile.followers_count || 0}
                </div>
              </div>
              
              {!isOwnProfile && (
                <div className="profile-actions">
                  <button onClick={handleToggleFriend}>
                    {isFriend ? 'Remove Friend' : 'Add Friend'}
                  </button>
                  
                  <button onClick={handleToggleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="screentime-dashboard">
              <h2>Your Screentime Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{screentimeStats.daily}</div>
                  <div className="stat-label">Today's Limit</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{screentimeStats.weeklyAvg}</div>
                  <div className="stat-label">Weekly Average</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{screentimeStats.earned}</div>
                  <div className="stat-label">Total Time Earned</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{screentimeStats.tasksCompleted}</div>
                  <div className="stat-label">Tasks Completed</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="profile-achievements">
            <h2>Achievements</h2>
            {posts.length === 0 ? (
              <p>No achievements shared yet.</p>
            ) : (
              <PostList posts={posts} />
            )}
          </div>
        </div>
      );
};

export default Profile;