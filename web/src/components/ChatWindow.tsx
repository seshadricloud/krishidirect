import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  productId?: string;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  recipientId,
  recipientName,
  productId,
  onClose
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/messages/${recipientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Setup Socket.io
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('new_message', (message: Message) => {
      if (message.senderId === recipientId || message.recipientId === recipientId) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('message_sent', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId === recipientId) {
        setIsTyping(true);
      }
    });

    newSocket.on('user_stop_typing', (data) => {
      if (data.userId === recipientId) {
        setIsTyping(false);
      }
    });

    setSocket(newSocket);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      newSocket.disconnect();
    };
  }, [recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      recipientId,
      content: newMessage.trim(),
      productId
    });

    setNewMessage('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('stop_typing', { recipientId });
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!socket) return;

    socket.emit('typing', { recipientId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { recipientId });
    }, 1000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 20,
      width: 360,
      height: 500,
      backgroundColor: 'white',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#10b981',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '16px' }}>{recipientName}</div>
          {isTyping && (
            <div style={{ fontSize: '12px', opacity: 0.9 }}>typing...</div>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: 0,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => {
          const isOwn = message.senderId === user?.id;
          return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: '12px',
                backgroundColor: isOwn ? '#10b981' : '#f3f4f6',
                color: isOwn ? 'white' : '#1f2937'
              }}>
                <div style={{ fontSize: '14px', wordBreak: 'break-word' }}>
                  {message.content}
                </div>
                <div style={{
                  fontSize: '10px',
                  marginTop: '4px',
                  opacity: 0.7,
                  textAlign: 'right'
                }}>
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            opacity: newMessage.trim() ? 1 : 0.5
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};
