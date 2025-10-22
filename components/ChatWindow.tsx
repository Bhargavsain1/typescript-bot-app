import React, { useState, useRef, useEffect } from 'react';
import type { User, Message } from '../types';
import SendIcon from './icons/SendIcon';
import MenuIcon from './icons/MenuIcon';

interface ChatWindowProps {
  user: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
}

const ChatHeader: React.FC<{ user: User; onToggleSidebar: () => void }> = ({ user, onToggleSidebar }) => (
    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-800 p-1 -ml-1">
                    <MenuIcon />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.avatarColor}`}>
                    {user.initials}
                </div>
                <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.role}</p>
                </div>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-500 ml-14">
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Chat</a>
                <a href="#" className="hover:text-gray-800">Scheduled Reports</a>
                <a href="#" className="hover:text-gray-800">Saved Templates</a>
            </nav>
        </div>
    </div>
);

const MessageBubble: React.FC<{ message: Message; user: User }> = ({ message, user }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl ${
                isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
            }`}>
                <p className="leading-relaxed">{message.text}</p>
            </div>
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-200 px-5 py-3">
            <div className="flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ user, messages, onSendMessage, isLoading, onToggleSidebar }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <ChatHeader user={user} onToggleSidebar={onToggleSidebar} />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} user={user} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-6 bg-gray-50">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything..."
                        className="w-full pl-6 pr-16 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;