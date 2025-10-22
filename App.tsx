import React, { useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import type { User, Message } from './types';
import { getBotResponse } from './services/geminiService';

const users: User[] = [
  { id: 'sam', name: 'Sam', role: 'Sales manager', avatarColor: 'bg-green-400', initials: 'S' },
  { id: 'mark', name: 'Mark', role: 'Marketing manager', avatarColor: 'bg-red-500', initials: 'M' },
  { id: 'coby', name: 'Coby', role: 'Content Creator', avatarColor: 'bg-orange-400', initials: 'C' },
  { id: 'ivy', name: 'Ivy', role: 'Inventory Manager', avatarColor: 'bg-purple-400', initials: 'I' },
];

const samInitialMessage = `Hi there! I've just generated the 'Top 10 Customers' report for the last 6 months.

This report includes:
- A detailed breakdown of sales data.
- A pie chart illustrating customer distribution.

You can use the filters to adjust the parameters and rename the template before saving. Let me know if you need any other reports!`;


const initialMessages: Record<string, Message[]> = {
  sam: [
    { id: 1, sender: 'sam', text: samInitialMessage },
  ],
  mark: [{ id: 1, sender: 'mark', text: 'Hello! How can I assist with your marketing questions today?' }],
  coby: [{ id: 1, sender: 'coby', text: 'Hey there! Ready to brainstorm some content ideas?' }],
  ivy: [{ id: 1, sender: 'ivy', text: 'Hi, I can help with any inventory management queries.' }],
};

const currentUser = {
  name: "Jake Williams",
  role: "Your Profile",
  avatarColor: "bg-fuchsia-500",
  initials: "JW"
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('sam');
  const [messagesByBot, setMessagesByBot] = useState<Record<string, Message[]>>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const sidebarTimeout = useRef<number | null>(null);

  const selectedUser = users.find(u => u.id === selectedUserId)!;
  const currentMessages = messagesByBot[selectedUserId] || [];

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  const handleSaveTemplate = useCallback(() => {
    console.log("Template saved!");
    // In a real app, you might save the template configuration
  }, []);

  const handleDiscardTemplate = useCallback(() => {
    console.log("Template discarded.");
    setShowDashboard(false);
  }, []);

  const handleSidebarEnter = useCallback(() => {
    if (sidebarTimeout.current) {
      clearTimeout(sidebarTimeout.current);
      sidebarTimeout.current = null;
    }
    setIsSidebarOpen(true);
  }, []);

  const handleSidebarLeave = useCallback(() => {
    sidebarTimeout.current = window.setTimeout(() => {
      setIsSidebarOpen(false);
    }, 200);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setShowDashboard(false); // Hide dashboard for new questions

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text,
    };

    const newMessages = [...(messagesByBot[selectedUserId] || []), userMessage];

    setMessagesByBot(prev => ({
      ...prev,
      [selectedUserId]: newMessages
    }));

    setIsLoading(true);

    try {
      const botResponseText = await getBotResponse(text, users.find(u => u.id === selectedUserId)!);
      
      let finalBotText = botResponseText;
      if (botResponseText.includes('[generate_graph]')) {
        setShowDashboard(true);
        finalBotText = botResponseText.replace('[generate_graph]', '').trim();
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: selectedUserId,
        text: finalBotText
      };
      setMessagesByBot(prev => ({
        ...prev,
        [selectedUserId]: [...newMessages, botMessage]
      }));
    } catch (error) {
      console.error("Failed to get bot response:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: selectedUserId,
        text: "Sorry, I encountered an error. Please try again."
      };
      setMessagesByBot(prev => ({
        ...prev,
        [selectedUserId]: [...newMessages, errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId, messagesByBot]);

  return (
    <div className="h-screen font-sans antialiased text-gray-800 bg-gray-100 relative flex">
      {/* Desktop hover trigger */}
      <div 
        className="hidden md:block fixed top-0 left-0 h-screen w-4 z-50"
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
      />

      <Sidebar
        users={users}
        currentUser={currentUser}
        selectedUserId={selectedUserId}
        onSelectUser={(id) => {
          setSelectedUserId(id);
          // Show dashboard if Sam is selected, hide for others initially
          setShowDashboard(id === 'sam');
          setIsSidebarOpen(false); // Close sidebar on selection
        }}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
      />

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      <Dashboard
        user={selectedUser}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onToggleSidebar={handleToggleSidebar}
        showDashboard={showDashboard}
        onSaveTemplate={handleSaveTemplate}
        onDiscardTemplate={handleDiscardTemplate}
      />
    </div>
  );
};

export default App;