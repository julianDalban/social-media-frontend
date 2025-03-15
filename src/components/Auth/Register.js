import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

    try {
        const response = await authService.register(email, password, username);
        if (response.data.success) {
            login(response.data.user);
            navigate('/');
        } else {
            setError(response.data.error || 'Failed to register');
        }
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to register');
    } finally {
        setLoading(false);
    }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')}>Login</button>
            </p>
        </div>
    );
};

export default Register;