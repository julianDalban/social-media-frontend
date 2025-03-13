import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
    const { currentUser, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Social Media App</Link>
            </div>
            <div className="navbar-menu">
                {isAuthenticated ? (
                    <>
                        <Link to="/">Home</Link>
                        <Link to='/search'>Search</Link>
                        <Link to={`/profile/${currentUser.uid}`}>Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;