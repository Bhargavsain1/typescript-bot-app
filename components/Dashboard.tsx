import React, { useState, useRef, useEffect } from 'react';
import type { User, Message } from '../types';
import SendIcon from './icons/SendIcon';
import MenuIcon from './icons/MenuIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import XIcon from './icons/XIcon';

// --- Sub-components for the Dashboard's right panel ---

const TopCustomersTable: React.FC<{ title: string }> = ({ title }) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">
            A detailed breakdown of the top 10 customers based on sales data from the last 6 months.
        </p>
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 h-10 border-r"></td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 h-10 border-r"></td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 h-10"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ParameterInput: React.FC<{ label: string }> = ({ label }) => {
    const [value, setValue] = useState(10);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex items-center justify-between p-1 border border-gray-300 rounded-md">
                <button onClick={() => setValue(v => Math.max(0, v - 1))} className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">-</button>
                <input type="text" readOnly value={value} className="w-full text-center border-none focus:ring-0 p-0 bg-gray-100" />
                <button onClick={() => setValue(v => v + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">+</button>
            </div>
        </div>
    );
}

const TemplateFilters: React.FC = () => (
    <div>
        <h3 className="text-xl font-semibold text-gray-900">Template Filters</h3>
        <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <ParameterInput label="Parameter 1" />
                <ParameterInput label="Parameter 2" />
            </div>
            <div className="flex items-center gap-3">
                <button className="w-full px-4 py-2 bg-blue-600 border border-transparent text-white rounded-md hover:bg-blue-700 text-sm font-semibold">Apply</button>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-semibold">Reset</button>
            </div>
        </div>
    </div>
);

const PieChart: React.FC = () => (
    <div className="flex justify-center items-center h-48">
         <svg viewBox="0 0 100 100" className="w-40 h-40">
            <circle cx="50" cy="50" r="49" fill="#A5B4FC" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M50 1 V99" stroke="#6366F1" strokeWidth="1.5"/>
            <path d="M50 50 H99" stroke="#6366F1" strokeWidth="1.5"/>
        </svg>
    </div>
);

const TemplateActions: React.FC<{ onSave: () => void; onDiscard: () => void }> = ({ onSave, onDiscard }) => (
    <div className="flex items-center gap-3">
        <input
            type="text"
            placeholder="Name Your Template"
            className="flex-grow w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold flex-shrink-0"
        >
            Save
        </button>
        <button
            onClick={onDiscard}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-semibold flex-shrink-0"
        >
            Discard
        </button>
    </div>
);


// --- Main Dashboard Component ---

interface DashboardProps {
  user: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  showDashboard: boolean;
  onSaveTemplate: () => void;
  onDiscardTemplate: () => void;
}

const DashboardHeader: React.FC<{ user: User; onToggleSidebar: () => void }> = ({ user, onToggleSidebar }) => (
    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
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
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-500 ml-14 md:ml-0">
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Chat</a>
                <a href="#" className="hover:text-gray-800">Scheduled Reports</a>
                <a href="#" className="hover:text-gray-800">Saved Templates</a>
            </nav>
        </div>
    </div>
);

const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 max-w-xl">
                    <p>{message.text}</p>
                </div>
            </div>
        )
    }
    
    // Custom rendering for bot's report-style message
    return (
         <div className="prose max-w-none text-gray-800">
            {message.text.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map(item => item.substring(2));
                    return (
                        <ul key={index} className="list-disc pl-5 space-y-1">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }
                if (paragraph.startsWith('> ')) {
                    return (
                        <blockquote key={index} className="bg-gray-100 p-4 rounded-xl text-gray-600 not-italic border-l-4 border-gray-300">
                            <p className="mb-0">{paragraph.substring(2)}</p>
                        </blockquote>
                    );
                }
                return <p key={index}>{paragraph}</p>;
            })}
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

const Dashboard: React.FC<DashboardProps> = ({ user, messages, onSendMessage, isLoading, onToggleSidebar, showDashboard, onSaveTemplate, onDiscardTemplate }) => {
    const [inputValue, setInputValue] = useState('');
    const [isTemplateMinimized, setIsTemplateMinimized] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputSectionRef = useRef<HTMLDivElement>(null);

    const templateSubject = "Top 10 Customers - Last 6 months";

    useEffect(() => {
        const messagesEl = messagesContainerRef.current;
        const inputEl = inputSectionRef.current;

        if (!messagesEl || !inputEl) return;

        const setPadding = () => {
            if (window.innerWidth < 768) { // Tailwind's `md` breakpoint
                const inputHeight = inputEl.offsetHeight;
                messagesEl.style.paddingBottom = `${inputHeight}px`;
            } else {
                messagesEl.style.paddingBottom = ''; // Reset for desktop view
            }
        };

        const observer = new ResizeObserver(setPadding);
        observer.observe(inputEl);
        window.addEventListener('resize', setPadding);

        setPadding(); // Initial call

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', setPadding);
        };
    }, []);

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

    const TemplateContent = () => (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <TopCustomersTable title={templateSubject} />
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-xs">
                            <PieChart />
                        </div>
                        <div className="w-full mt-6">
                            <TemplateActions onSave={onSaveTemplate} onDiscard={onDiscardTemplate} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <TemplateFilters />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <DashboardHeader user={user} onToggleSidebar={onToggleSidebar} />
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Main content area */}
                <div className={`${showDashboard ? 'md:w-2/5' : 'w-full'} w-full h-full flex flex-col transition-all duration-300 ease-in-out min-h-0 relative`}>
                    <main ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6">
                        <div className={`space-y-6 ${!showDashboard ? 'max-w-7xl mx-auto' : ''}`}>
                            {messages.map((msg) => (
                               <MessageContent key={msg.id} message={msg} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>
                    </main>
                    
                    {/* Unified Chat Input Footer */}
                    <div ref={inputSectionRef} className="p-4 bg-white border-t border-gray-200 absolute bottom-0 left-0 w-full md:static md:flex-shrink-0">
                        <div className={!showDashboard ? 'max-w-6xl mx-auto' : ''}>
                            {/* Mobile Template Trigger Card */}
                            {showDashboard && (
                                <div className="md:hidden pb-4">
                                    <button
                                        type="button"
                                        className="w-full flex justify-between items-center p-4 bg-gray-50 cursor-pointer border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        onClick={() => setIsTemplateMinimized(false)}
                                        aria-expanded="false"
                                        aria-controls="template-content-mobile"
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="text-md font-semibold text-gray-800">{templateSubject}</h3>
                                        </div>
                                        <ChevronDownIcon className="w-6 h-6 text-gray-600 transform rotate-180"/>
                                    </button>
                                </div>
                            )}

                            {/* Input Form */}
                            <form onSubmit={handleSubmit} className="relative">
                                 <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                    disabled={isLoading || !inputValue.trim()}
                                    aria-label="Send message"
                                >
                                    <SendIcon />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                {/* Desktop Right Panel */}
                {showDashboard && (
                     <div className="w-full md:w-3/5 flex-shrink-0 bg-gray-50 p-4 hidden md:flex flex-col">
                        <aside className="w-full flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                            <div className="md:flex-1 md:overflow-y-auto">
                               <TemplateContent />
                            </div>
                        </aside>
                    </div>
                )}
            </div>

            {/* Mobile Template Fullscreen Panel */}
            {showDashboard && (
                <div 
                    id="template-content-mobile"
                    className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${isTemplateMinimized ? 'translate-y-full' : 'translate-y-0'}`}
                    aria-hidden={isTemplateMinimized}
                >
                    <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <h3 className="text-xl font-semibold text-gray-900">{templateSubject}</h3>
                        <button 
                            onClick={() => setIsTemplateMinimized(true)} 
                            className="p-2 -mr-2 text-gray-500 hover:text-gray-800"
                            aria-label="Close template"
                        >
                            <XIcon />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <TemplateContent />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;