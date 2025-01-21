import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('name, email and password are required');
        }
        try {
            const url = `${APIUrl}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
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
        <div className="signup-container">
            <div className="signup-box">
                <h1 className="signup-title">Finance Tracker</h1>
                <h3 className="signup-welcome">Create your account</h3>
                <form className="signup-form" onSubmit={handleSignup}>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={signupInfo.name}
                        className="signup-input"
                    />
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={signupInfo.email}
                        className="signup-input"
                    />
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={signupInfo.password}
                        className="signup-input"
                    />
                    <button type="submit" className="signup-button">Sign up</button>
                </form>
                <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
