/**
 * ContextStack - Zoho Cliq Extension
 * AI-powered context manager using deployed backend services
 */

// Backend API URLs
const BACKEND_URL = 'https://contextstack-backend.onrender.com';
const NLP_URL = 'https://zoho-contextstack.onrender.com';

/**
 * Command: /contextstack
 * Shows help and available commands
 */
function showHelp() {
  return {
    text: "🧠 **ContextStack** - AI-powered Context Manager\n\n" +
          "**Available Commands:**\n" +
          "• `/contextstack` - Show this help\n" +
          "• `/extract-actions` - Extract AI-powered action items\n" +
          "• `/analyze-context` - Get full context analysis\n" +
          "• `/create-task [title]` - Create a task\n\n" +
          "**Features:**\n" +
          "✅ AI-powered action extraction (NLTK + ML)\n" +
          "✅ Semantic document search\n" +
          "✅ Smart reply suggestions\n" +
          "✅ Context-aware analysis\n" +
          "✅ Task management\n\n" +
          "Powered by advanced NLP technology!"
  };
}

/**
 * Command: /extract-actions
 * Extracts action items using AI/NLP backend
 */
async function extractActions(context) {
  try {
    const { channel } = context;
    
    // Get recent messages from channel
    const messages = await invokeUrl({
      url: `https://cliq.zoho.com/api/v2/channels/${channel.id}/messages?limit=10`,
      type: "GET",
      headers: {
        "Authorization": "Zoho-oauthtoken " + context.authtoken
      }
    });
    
    if (!messages || !messages.data || messages.data.length === 0) {
      return {
        text: "📭 No recent messages found in this channel."
      };
    }
    
    // Combine recent messages for analysis
    const combinedText = messages.data
      .map(m => m.text)
      .filter(t => t)
      .join(' ');
    
    // Call NLP service to extract actions
    const nlpResponse = await invokeUrl({
      url: `${NLP_URL}/nlp/extract_actions`,
      type: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        text: combinedText
      })
    });
    
    const actions = nlpResponse.data || [];
    
    if (actions.length === 0) {
      return {
        text: "✅ No action items detected in recent messages.\n\n" +
              "💡 Tip: Use keywords like 'todo', 'task', 'please', 'need to' to create actionable items."
      };
    }
    
    // Create response card
    const sections = actions.slice(0, 10).map((action, index) => {
      let actionText = `**${index + 1}. ${action.text}**\n`;
      if (action.owner) {
        actionText += `👤 Assignee: ${action.owner}\n`;
      }
      if (action.deadline) {
        actionText += `⏰ Deadline: ${action.deadline}\n`;
      }
      actionText += `📊 AI Confidence: ${(action.score * 100).toFixed(0)}%`;
      
      return {
        type: "text",
        text: actionText
      };
    });
    
    return {
      card: {
        title: `🎯 Found ${actions.length} Action Item${actions.length > 1 ? 's' : ''} (AI-Powered)`,
        theme: "modern-inline",
        sections: sections,
        buttons: [
          {
            label: "View Full Context",
            type: "invoke.function",
            name: "analyzeContext"
          }
        ]
      }
    };
    
  } catch (error) {
    return {
      text: "❌ Error extracting actions: " + error.message + "\n\n" +
            "💡 The backend service may be starting up (takes 30-60 seconds on first request)."
    };
  }
}

/**
 * Command: /analyze-context
 * Gets full context analysis from backend
 */
async function analyzeContext(context) {
  try {
    const { channel, message } = context;
    
    // Get recent messages
    const messages = await invokeUrl({
      url: `https://cliq.zoho.com/api/v2/channels/${channel.id}/messages?limit=10`,
      type: "GET",
      headers: {
        "Authorization": "Zoho-oauthtoken " + context.authtoken
      }
    });
    
    if (!messages || !messages.data || messages.data.length === 0) {
      return {
        text: "📭 No messages to analyze."
      };
    }
    
    // Store messages in backend for context analysis
    const messageData = messages.data.map(m => ({
      channelId: channel.id,
      messageId: m.id,
      authorName: m.sender ? m.sender.name : 'Unknown',
      text: m.text || '',
      createdAt: new Date(m.time).toISOString()
    }));
    
    // Send to backend for storage
    await invokeUrl({
      url: `${BACKEND_URL}/api/messages/ingest`,
      type: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        messages: messageData
      })
    });
    
    // Get context analysis
    const contextResponse = await invokeUrl({
      url: `${BACKEND_URL}/api/context`,
      type: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        channelId: channel.id,
        messageId: messageData[0].messageId,
        limit: 5
      })
    });
    
    const contextData = contextResponse.data || {};
    
    // Build response card
    const sections = [];
    
    // Recent messages summary
    sections.push({
      type: "text",
      text: `**📊 Context Summary**\n` +
            `Messages analyzed: ${contextData.messages ? contextData.messages.length : 0}\n` +
            `Processing time: ${contextData.meta ? contextData.meta.latencyMs : 0}ms\n` +
            `${contextData.fromCache ? '⚡ Cached result' : '🔄 Fresh analysis'}`
    });
    
    // AI-detected actions
    if (contextData.actions && contextData.actions.length > 0) {
      const actionsList = contextData.actions
        .slice(0, 3)
        .map((a, i) => `${i + 1}. ${a.text}${a.owner ? ` (@${a.owner})` : ''}`)
        .join('\n');
      
      sections.push({
        type: "text",
        text: `**✅ AI-Detected Actions:**\n${actionsList}`
      });
    }
    
    // Relevant documents
    if (contextData.relevantDocs && contextData.relevantDocs.length > 0) {
      const docsList = contextData.relevantDocs
        .slice(0, 3)
        .map((d, i) => `${i + 1}. ${d.title} (${(d.score * 100).toFixed(0)}% match)`)
        .join('\n');
      
      sections.push({
        type: "text",
        text: `**📚 Relevant Documents:**\n${docsList}`
      });
    }
    
    // AI suggested reply
    if (contextData.suggestedReply) {
      sections.push({
        type: "text",
        text: `**💡 AI Suggested Reply:**\n"${contextData.suggestedReply}"`
      });
    }
    
    return {
      card: {
        title: "🧠 Full Context Analysis (AI-Powered)",
        theme: "modern-inline",
        sections: sections,
        buttons: [
          {
            label: "Open Web Dashboard",
            type: "open.url",
            url: "https://zoho-contextstack.vercel.app"
          }
        ]
      }
    };
    
  } catch (error) {
    return {
      text: "❌ Error analyzing context: " + error.message + "\n\n" +
            "💡 The backend service may be starting up (takes 30-60 seconds on first request)."
    };
  }
}

/**
 * Command: /create-task
 * Creates a task via backend API
 */
async function createTask(context) {
  try {
    const { arguments: args, user, channel } = context;
    const taskTitle = args.hint || "New Task";
    
    // Create task via backend
    const response = await invokeUrl({
      url: `${BACKEND_URL}/api/tasks`,
      type: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        channelId: channel.id,
        title: taskTitle,
        description: `Created by ${user.name} via Cliq`,
        assigneeName: user.name,
        status: 'todo'
      })
    });
    
    if (response.status === 200 || response.status === 201) {
      return {
        card: {
          title: "✅ Task Created Successfully",
          theme: "modern-inline",
          sections: [
            {
              type: "text",
              text: `**Task:** ${taskTitle}\n` +
                    `**Created by:** ${user.name}\n` +
                    `**Status:** To Do\n` +
                    `**Channel:** ${channel.name || channel.id}`
            }
          ],
          buttons: [
            {
              label: "View All Tasks",
              type: "open.url",
              url: "https://zoho-contextstack.vercel.app"
            }
          ]
        }
      };
    } else {
      return {
        text: "❌ Failed to create task. Please try again."
      };
    }
    
  } catch (error) {
    return {
      text: "❌ Error creating task: " + error.message
    };
  }
}
