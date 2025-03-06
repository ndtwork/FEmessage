import React, { useState, useEffect, useRef } from "react";
import ChatRoomList from "../components/ChatRoomList";
import MessageDisplay from "../components/MessageDisplay";
import MessageInput from "../components/MessageInput";
import { api } from "../services/api";
import * as Stomp from "@stomp/stompjs"; // Đã sửa import thành '@stomp/stompjs'
import * as SockJS from "sockjs-client";
import { useParams, useNavigate } from "react-router-dom";

export interface Message {
  id: number;
  senderUser: {
    id: number;
    displayName: string;
  };
  chatRoom: {
    id: number;
  };
  content: string;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [messages, setMessages] = useState<Message[]>([]);
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null); // Đã sửa: Truyền 'null' làm argument

  const fetchInitialMessages = async () => {
    if (chatRoomId) {
      try {
        const response = await api.get(`/messages/chat-room/${chatRoomId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect to login if not logged in
      return;
    }

    fetchInitialMessages();

    // WebSocket Connection
    const client = new Stomp.Client({
      // ĐÚNG: Khởi tạo instance của Stomp.Client
      brokerURL: "ws://localhost:8080/ws-chat", // Thay vì 'url' trước đây, dùng 'brokerURL'
      // webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'), // Nếu cần hỗ trợ SockJS, bỏ comment dòng này
      onConnect: () => {
        console.log("WebSocket Connected");
        setStompClient(client);

        if (chatRoomId) {
          client.subscribe(
            `/topic/chat-room/${chatRoomId}`,
            (messageOutput: any) => {
              const message: Message = JSON.parse(messageOutput.body);
              setMessages((prevMessages) => [...prevMessages, message]);
            }
          );
        }
      },
      onDisconnect: () => {
        console.log("WebSocket Disconnected");
      },
      onStompError: (frame: any) => {
        // Đã sửa lỗi 4: Thêm type 'any' cho 'frame'
        console.error("STOMP error:", frame);
      },
    });

    client.activate(); // Thay vì client.connect({}, ...), dùng client.activate() để kích hoạt kết nối

    client.activate(); // Thay vì client.connect({}, ...), dùng client.activate() để kích hoạt kết nối

    return () => {
      // Cleanup on unmount
      if (client && client.connected) {
        client.deactivate(); // ĐÃ SỬA: Gọi deactivate() không có callback
        console.log("WebSocket Disconnected"); // Di chuyển console.log ra ngoài deactivate()
      }
    };
  }, [chatRoomId, navigate, userId]);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    console.log(
      "onSendMessage in ChatPage.tsx is called with message:",
      messageText
    );
    console.log("chatromid", chatRoomId, "+", userId, "+", stompClient);
    if (!chatRoomId || !userId) return;

    try {
      const messagePayload = {
        senderUserId: userId,
        chatRoomId: chatRoomId,
        content: messageText,
      };
      await api.post("/messages", messagePayload); // Message is now broadcasted by backend
      fetchInitialMessages();
      // No need to manually update messages state here, WebSocket subscription handles it
    } catch (error) {
      console.error("Error sending message:", error);
    }
    console.log(
      "After sending message logic (API or WebSocket) - if it reaches here"
    );
  };

  if (!userId) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto h-screen flex">
      <div className="w-1/4 border-r p-4">
        <ChatRoomList userId={parseInt(userId)} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Chat Room: {chatRoomId}</h2>
        </div>
        <MessageDisplay
          messages={messages}
          currentUserId={parseInt(userId)}
          messageAreaRef={messageAreaRef}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
