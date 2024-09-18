import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

            // Check if password and confPassword are equal
            if (password !== confPassword) {
                setError('Passwords do not match');
            }

        try {
            const response = await axios.post('http://localhost:3000/auth/register', { email, password });

            // Make a POST request to the register route
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
            console.log('registration successful');
        } catch (err: any) {
            if (err.response && err.response.status === 400 && err.response.data.message === 'User already exists') {
                setError('User already exists');
            } else {
                setError('Error during registration');
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Confirm password:</label>
                    <input
                        type="password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;