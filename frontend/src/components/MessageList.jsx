import { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';

export default function MessageList({ channelId, onMessageClick }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [channelId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/messages/${channelId}?limit=20`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">#{channelId}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Add sample data to get started.
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg._id}
              onClick={() => onMessageClick(msg)}
              className="group p-4 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-blue-200 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{msg.authorName || 'User'}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.text}</p>
                  
                  <button className="mt-2 opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-medium transition-opacity">
                    Open ContextStack →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}