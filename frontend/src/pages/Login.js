import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required');
        }
        try {
            const url = `${APIUrl}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <span className="login-container">
            <div className="login-box">
                <h1 className="login-title">Finance Tracker</h1>
                <h3 className="login-welcome">Welcome back</h3>
                <h2 className="login-subtitle">Enter your details</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={loginInfo.email}
                        className="login-input"
                    />
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginInfo.password}
                        className="login-input"
                    />
                    <div className="login-options">
                    </div>
                    <button type="submit" className="login-button">login</button>
                </form>
                <p className="signup-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
            <ToastContainer />
        </span>
    );
}

export default Login;