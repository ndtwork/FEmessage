import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [messageText, setMessageText] = useState('');

    const handleSendMessage = () => {
        console.log('Sending message:', messageText);
        if (messageText.trim()) {
            onSendMessage(messageText);
            setMessageText('');
        }
    };

    return (
        <div className="p-4 flex">
            <input
                type="text"
                placeholder="Type your message..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(event) => event.key === 'Enter' ? handleSendMessage() : null}
            />
            <button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send</button>
        </div>
    );
};

export default MessageInput;