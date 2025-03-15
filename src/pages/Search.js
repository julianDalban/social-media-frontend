import React, { useState } from "react";
import { Link } from "react-router-dom";
import { userService, friendService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await userService.searchUsers(searchTerm);

            if (response.data.success) {
                setSearchResults(response.data.users);
            } else {
                setError(response.data.error || 'Search failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFriend = async (friendId, isFriend) => {
        try {
            if (isFriend) {
                await friendService.removeFriend(currentUser.uid, friendId);
            } else {
                await friendService.addFriend(currentUser.uid, friendId);
            }

            // update the search results to reflect the new friend status
            setSearchResults(
                searchResults.map((user) => 
                user.id === friendId
                    ? { ...user, isFriend: !isFriend }
                    : user
                )
            );
        } catch (err) {
            console.error('Error toggling friend status:', err);
        }
    };

    return (
        <div className="search-container">
          <h1>Find Friends</h1>
          <p>Connect with other Optima users to see their achievements and progress</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" disabled={loading} className="search-button">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="search-results">
            {searchResults.length === 0 && searchTerm && !loading ? (
              <p>No users found. Try a different search term.</p>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    {user.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt={user.username} 
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="user-details">
                      <Link to={`/profile/${user.id}`} className="user-name">
                        {user.username}
                      </Link>
                      {user.bio && <p className="user-bio">{user.bio}</p>}
                    </div>
                  </div>
                  <div className="user-actions">
                    <button 
                      onClick={() => handleToggleFriend(user.id, user.isFriend)}
                      className={user.isFriend ? 'remove-friend-btn' : 'add-friend-btn'}
                    >
                      {user.isFriend ? 'Remove Friend' : 'Add Friend'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
};

export default Search;