import React, { RefObject } from 'react';
import { Message } from '../pages/ChatPage';

interface MessageDisplayProps {
    messages: Message[];
    currentUserId: number | null;
    messageAreaRef?: RefObject<HTMLDivElement | null>; // Thêm messageAreaRef và làm nó optional (?)
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages, currentUserId, messageAreaRef }) => { // Nhận messageAreaRef (optional)
    return (
        <div className="p-4 overflow-y-auto h-[300px] border-b" ref={messageAreaRef}> {/* Gán ref vào div, chỉ khi messageAreaRef được truyền vào */}
            {messages.map(msg => (
                <div key={msg.id} className={`mb-2 p-2 rounded ${msg.senderUser.id === currentUserId ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100 mr-auto text-left'}`}>
                    <strong className="block">{msg.senderUser.displayName}</strong>
                    <span>{msg.content}</span>
                    <em className="block text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</em>
                </div>
            ))}
        </div>
    );
};

export default MessageDisplay;