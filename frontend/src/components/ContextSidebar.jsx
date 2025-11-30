import { useState, useEffect } from 'react';
import { X, FileText, CheckSquare, MessageSquare, Loader, Clock, User as UserIcon } from 'lucide-react';

export default function ContextSidebar({ message, onClose }) {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (message) {
      fetchContext();
    }
  }, [message]);

  const fetchContext = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: message.channelId,
          messageId: message.messageId
        })
      });
      const data = await res.json();
      setContext(data);
      
      // Pre-fill task title from first action
      if (data.actions && data.actions.length > 0) {
        setTaskTitle(data.actions[0].text);
      }
    } catch (error) {
      console.error('Error fetching context:', error);
    }
    setLoading(false);
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;
    
    setCreating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const action = context.actions[0] || {};
      await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: message.channelId,
          title: taskTitle,
          description: message.text,
          assigneeName: action.owner || null,
          dueDate: action.deadline || null
        })
      });
      alert('✅ Task created successfully!');
      setTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
    setCreating(false);
  };

  const copyReply = () => {
    if (context?.suggestedReply) {
      navigator.clipboard.writeText(context.suggestedReply);
      alert('✅ Reply copied to clipboard!');
    }
  };

  return (
    <div className="w-96 bg-white border-l shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-lg">ContextStack</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : context ? (
          <>
            {/* Metadata */}
            <div className="text-xs text-gray-500 flex items-center justify-between px-2">
              <span className={context.fromCache ? 'text-green-600' : ''}>
                {context.fromCache ? '⚡ Cached' : '🔄 Fresh'}
              </span>
              <span>{context.meta?.latencyMs}ms</span>
            </div>

            {/* Recent Messages */}
            <Section title="Recent Messages" icon={MessageSquare}>
              <div className="space-y-2">
                {context.messages?.slice(0, 5).map(msg => (
                  <div key={msg._id} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <UserIcon className="w-3 h-3 text-gray-400" />
                      <span className="font-medium text-xs">{msg.authorName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{msg.text}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Extracted Actions */}
            {context.actions && context.actions.length > 0 && (
              <Section title="Detected Actions" icon={CheckSquare}>
                <div className="space-y-2">
                  {context.actions.map((action, i) => (
                    <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="font-medium text-sm">{action.text}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {action.owner && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            👤 {action.owner}
                          </span>
                        )}
                        {action.deadline && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {action.deadline}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {(action.score * 100).toFixed(0)}% conf
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Relevant Docs */}
            {context.relevantDocs && context.relevantDocs.length > 0 && (
              <Section title="Relevant Docs" icon={FileText}>
                <div className="space-y-2">
                  {context.relevantDocs.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-purple-900">{doc.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {doc.excerpt}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-purple-200 text-purple-700 rounded shrink-0">
                          {(doc.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </Section>
            )}

            {/* Suggested Reply */}
            {context.suggestedReply && (
              <Section title="Suggested Reply" icon={MessageSquare}>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-gray-800 mb-3">{context.suggestedReply}</p>
                  <button
                    onClick={copyReply}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </Section>
            )}

            {/* Quick Actions */}
            <Section title="Quick Actions" icon={CheckSquare}>
              <div className="space-y-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <button
                  onClick={handleCreateTask}
                  disabled={creating || !taskTitle.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 text-sm font-medium"
                >
                  {creating ? 'Creating...' : '➕ Create Task'}
                </button>
              </div>
            </Section>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Failed to load context
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-3 py-2 border-b flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-600" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}