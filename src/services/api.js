import axios from 'axios'

const API_URL = 'https://social-media-api-73bqxnmzma-uc.a.run.app/api' // change based on API port

// create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Authentication services
export const authService = {
    register: (email, password, username) => {
        return api.post('/auth/register', { email, password, username });
    },
    login: (email, password) => {
        return api.post('/auth/login', {email, password });
    },
};

// User services
export const userService = {
    getProfile: (userId) => {
        return api.get(`/users/${userId}`);
    },
    searchUsers: (searchTerm) => {
        return api.get(`/users/search/${searchTerm}`);
    },
    updateProfile: (userId, updates) => {
        return api.post(`/user/profile/update`, { userId, updates });
    },
    uploadProfilePicture: (userId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        return api.post('/user/profile/picture', formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            },
        });
    },
};

// Friend services
export const friendService = {
    addFriend: (userId, friendId) => {
        return api.post('/friends/add', { userId, friendId });
    },
    removeFriend: (userId, friendId) => {
        return api.post('/friend/remove', { userId, friendId });
    },
    toggleFollow: (followerId, targetUserId) => {
        return api.post('/user/follow', { followerId, targetUserId });
    },
};

// Post services
export const postService = {
    createPost: (userId, content) => {
        return api.post('/posts', { userId, content });
    },
    getPost: (postId) => {
        return api.get(`/posts/${postId}`);
    },
    getFriendsPosts: (userId) => {
        return api.get(`/posts/friends/${userId}`);
    },
    getFeed: (userId, lastPost = null) => {
        return api.get(`/feed/${userId}${lastPost ? `?lastPost=${lastPost}` : ''}`);
    },
    toggleLike: (postId, userId) => {
        return api.post('/posts/like', { postId, userId });
    },
    checkLikeStatus: (postId, userId) => {
        return api.get(`/posts/like/status?postId=${postId}&userId=${userId}`);
    },
    getLikeDetails: (postId) => {
        return api.get(`/posts/${postId}/likes`);
    },
    addComment: (postId, userId, content) => {
        return api.post('/posts/comment', { postId, userId, content });
    },
    getComments: (postId, lastComment = null) => {
        return api.get(`/posts/${postId}/comments${lastComment ? `?lastComment=${lastComment}` : ''}`);
    },
};

export default {
    auth: authService,
    user: userService,
    friend: friendService,
    post: postService,
};