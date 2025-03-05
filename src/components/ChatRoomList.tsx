import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

interface ChatRoom {
    id: number;
    name: string;
}

interface ChatRoomListProps {
    userId: number | null;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ userId }) => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [newChatRoomName, setNewChatRoomName] = useState('');
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        fetchChatRooms();
    }, []);

    const fetchChatRooms = async () => {
        try {
            const response = await api.get('/chat-rooms');
            setChatRooms(response.data);
        } catch (error) {
            console.error("Error fetching chat rooms:", error);
        }
    };

    const handleCreateChatRoom = async () => {
        if (!newChatRoomName.trim()) {
            alert("Chat room name cannot be empty.");
            return;
        }
        try {
            await api.post('/chat-rooms', { name: newChatRoomName, createdByUserId: userId });
            setNewChatRoomName('');
            fetchChatRooms(); // Refresh chat room list
        } catch (error) {
            console.error("Error creating chat room:", error);
        }
    };

    const handleSearchChatRooms = async () => {
        try {
            const response = await api.get(`/chat-rooms/search?name=${searchName}`);
            setChatRooms(response.data);
        } catch (error) {
            console.error("Error searching chat rooms:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search chat rooms..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button onClick={handleSearchChatRooms} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Search</button>
                <button onClick={fetchChatRooms} className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Reset</button>
            </div>


            <ul className="mb-4">
                {chatRooms.map(room => (
                    <li key={room.id} className="mb-2 p-2 border rounded hover:bg-gray-100">
                        <Link to={`/chat/${room.id}`}>{room.name}</Link>
                    </li>
                ))}
            </ul>

            <div className="flex">
                <input
                    type="text"
                    placeholder="Enter new chat room name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                    value={newChatRoomName}
                    onChange={(e) => setNewChatRoomName(e.target.value)}
                />
                <button onClick={handleCreateChatRoom} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Room</button>
            </div>
        </div>
    );
};

export default ChatRoomList;