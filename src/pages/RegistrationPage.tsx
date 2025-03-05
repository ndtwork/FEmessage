import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import { useNavigate, Link } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRegistrationSuccess = (user: any) => {
        alert('Registration successful!');
        navigate('/login');
    };

    const handleRegistrationError = (message: string) => {
        setErrorMessage(message);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} onError={handleRegistrationError} />
            <p className="mt-4">
                Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default RegistrationPage;