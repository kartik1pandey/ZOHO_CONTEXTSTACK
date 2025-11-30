// ContextStack - Zoho Cliq Extension Functions

const BACKEND_URL = 'https://contextstack-backend.onrender.com';
const NLP_URL = 'https://zoho-contextstack.onrender.com';

/**
 * Extract actions from a message
 */
async function extractActions(request) {
  try {
    const { message } = request;
    
    // Call NLP service to extract actions
    const response = await fetch(`${NLP_URL}/nlp/extract_actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.text })
    });
    
    const actions = await response.json();
    
    if (actions && actions.length > 0) {
      // Format actions as a card
      const card = {
        title: '🎯 Detected Actions',
        theme: 'modern-inline',
        sections: actions.map(action => ({
          type: 'text',
          text: `**${action.text}**\n` +
                `${action.owner ? `👤 Assigned to: ${action.owner}\n` : ''}` +
                `${action.deadline ? `⏰ Deadline: ${action.deadline}\n` : ''}` +
                `📊 Confidence: ${(action.score * 100).toFixed(0)}%`
        }))
      };
      
      return { card };
    } else {
      return {
        text: 'No actionable items detected in this message.'
      };
    }
  } catch (error) {
    console.error('Error extracting actions:', error);
    return {
      text: '❌ Failed to extract actions. Please try again.'
    };
  }
}

/**
 * Get context for a message
 */
async function getContext(request) {
  try {
    const { message, channel } = request;
    
    // Call backend to get context
    const response = await fetch(`${BACKEND_URL}/api/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelId: channel.id,
        messageId: message.id,
        limit: 5
      })
    });
    
    const context = await response.json();
    
    // Format context as a card
    const sections = [];
    
    // Recent messages
    if (context.messages && context.messages.length > 0) {
      sections.push({
        type: 'text',
        text: `**📨 Recent Messages (${context.messages.length})**`
      });
    }
    
    // Actions
    if (context.actions && context.actions.length > 0) {
      sections.push({
        type: 'text',
        text: `**✅ Detected Actions:**\n` +
              context.actions.map(a => `• ${a.text}`).join('\n')
      });
    }
    
    // Relevant docs
    if (context.relevantDocs && context.relevantDocs.length > 0) {
      sections.push({
        type: 'text',
        text: `**📚 Relevant Documents:**\n` +
              context.relevantDocs.map(d => `• [${d.title}](${d.url})`).join('\n')
      });
    }
    
    // Suggested reply
    if (context.suggestedReply) {
      sections.push({
        type: 'text',
        text: `**💡 Suggested Reply:**\n${context.suggestedReply}`
      });
    }
    
    const card = {
      title: '🧠 ContextStack Analysis',
      theme: 'modern-inline',
      sections
    };
    
    return { card };
  } catch (error) {
    console.error('Error getting context:', error);
    return {
      text: '❌ Failed to get context. Please try again.'
    };
  }
}

/**
 * Command: /contextstack
 */
async function contextCommand(request) {
  const { channel } = request;
  
  return {
    text: `🧠 **ContextStack** - AI-powered context manager\n\n` +
          `Use these commands:\n` +
          `• \`/extract-actions\` - Extract action items from recent messages\n` +
          `• \`/create-task [title]\` - Create a task\n\n` +
          `Or click the ContextStack panel in the sidebar to see full context!`
  };
}

/**
 * Command: /extract-actions
 */
async function extractActionsCommand(request) {
  try {
    const { channel } = request;
    
    // Get recent messages from channel
    const messages = await cliq.getMessages(channel.id, { limit: 10 });
    
    if (!messages || messages.length === 0) {
      return { text: 'No recent messages found.' };
    }
    
    // Extract actions from all messages
    const allActions = [];
    
    for (const msg of messages) {
      const response = await fetch(`${NLP_URL}/nlp/extract_actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text })
      });
      
      const actions = await response.json();
      if (actions && actions.length > 0) {
        allActions.push(...actions.map(a => ({
          ...a,
          message: msg.text.substring(0, 50) + '...'
        })));
      }
    }
    
    if (allActions.length === 0) {
      return { text: '✅ No action items detected in recent messages.' };
    }
    
    // Format as card
    const card = {
      title: `🎯 Found ${allActions.length} Action Items`,
      theme: 'modern-inline',
      sections: allActions.map((action, i) => ({
        type: 'text',
        text: `**${i + 1}. ${action.text}**\n` +
              `From: "${action.message}"\n` +
              `${action.owner ? `👤 ${action.owner} ` : ''}` +
              `${action.deadline ? `⏰ ${action.deadline}` : ''}`
      }))
    };
    
    return { card };
  } catch (error) {
    console.error('Error in extractActionsCommand:', error);
    return { text: '❌ Failed to extract actions.' };
  }
}

/**
 * Command: /create-task
 */
async function createTaskCommand(request) {
  try {
    const { arguments: args, channel, user } = request;
    const title = args.title;
    
    if (!title) {
      return { text: '❌ Please provide a task title. Usage: `/create-task [title]`' };
    }
    
    // Create task via backend
    const response = await fetch(`${BACKEND_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelId: channel.id,
        title: title,
        description: `Created by ${user.name} via Cliq`,
        assigneeName: user.name,
        status: 'todo'
      })
    });
    
    if (response.ok) {
      return {
        text: `✅ Task created: **${title}**\n👤 Assigned to: ${user.name}`
      };
    } else {
      return { text: '❌ Failed to create task.' };
    }
  } catch (error) {
    console.error('Error creating task:', error);
    return { text: '❌ Failed to create task.' };
  }
}

// Export functions
module.exports = {
  extractActions,
  getContext,
  contextCommand,
  extractActionsCommand,
  createTaskCommand
};
