import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../contexts/UserContext';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log(`Submitting with Email: ${email} and Password: ${password}`);
        
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
    
            if (data.success) {
                setUser({ id: data.userId, email, name: data.name });
                onLoginSuccess();
            } else {
                setLoginError(data.error);
            }
        } catch (error) {
            console.error("Error while logging in:", error);
        }
    };
    

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h3>Sign In</h3>
                    {loginError && <p style={{color: 'red'}}>{loginError}</p>}
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                    <button onClick={() => onSwitchToRegister()} className="btn switch-btn">
                        Go to Register
                    </button>
                </form>
            </div>
        </div>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
    onSwitchToRegister: PropTypes.func.isRequired
};

