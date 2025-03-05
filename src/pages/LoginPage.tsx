import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLoginSuccess = (user: any) => {
        localStorage.setItem('userId', user.id.toString());
        navigate('/chat');
    };

    const handleLoginError = (message: string) => {
        setErrorMessage(message);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <LoginForm onLoginSuccess={handleLoginSuccess} onError={handleLoginError} />
            <p className="mt-4">
                Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;