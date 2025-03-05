import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ChatPage from './pages/ChatPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:chatRoomId" element={<ChatPage />} />
                <Route path="/" element={<LoginPage />} /> {/* Redirect root to login for simplicity */}
            </Routes>
        </Router>
    );
}

export default App;