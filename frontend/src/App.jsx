import { useState } from 'react';
import { MessageSquare, FileText, CheckSquare, Sparkles } from 'lucide-react';
import ContextSidebar from './components/ContextSidebar';
import MessageList from './components/MessageList';

function App() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample channels for demo
  const channels = [
    { id: 'dev-frontend', name: 'dev-frontend' },
    { id: 'marketing', name: 'marketing' },
    { id: 'support', name: 'support' }
  ];

  const [activeChannel, setActiveChannel] = useState('dev-frontend');

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setSidebarOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Channel Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          ContextStack
        </h1>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-400 uppercase mb-2">Channels</div>
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                activeChannel === ch.id 
                  ? 'bg-blue-600' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              #{ch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Message List */}
        <div className="flex-1 overflow-hidden">
          <MessageList 
            channelId={activeChannel}
            onMessageClick={handleMessageClick}
          />
        </div>

        {/* Context Sidebar */}
        {sidebarOpen && (
          <ContextSidebar 
            message={selectedMessage}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;