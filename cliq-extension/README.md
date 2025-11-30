# ContextStack - Zoho Cliq Extension

AI-powered workspace context manager for Zoho Cliq that extracts actionable insights from team conversations.

## Features

- 🎯 **Action Extraction**: Automatically detect tasks and action items from messages
- 🧠 **Context Analysis**: Get AI-powered context for any conversation
- 📚 **Document Search**: Find relevant documentation based on conversation
- ✅ **Task Creation**: Create tasks directly from Cliq
- 💡 **Smart Suggestions**: Get AI-generated reply suggestions

## Installation

### Option 1: Install from Zoho Marketplace (Recommended)

1. Go to your Zoho Cliq workspace
2. Click on **Apps** → **Marketplace**
3. Search for "ContextStack"
4. Click **Install**

### Option 2: Manual Installation

1. Download the extension package
2. Go to Zoho Cliq → **Apps** → **Manage Apps**
3. Click **Upload Extension**
4. Select the `contextstack-cliq-extension.zip` file
5. Click **Install**

### Option 3: Developer Installation

1. Go to https://cliq.zoho.com/api/v2/extensions
2. Click **Create Extension**
3. Upload `plugin-manifest.json`
4. Upload `functions.js`
5. Add icon.png
6. Click **Publish**

## Usage

### Commands

#### `/contextstack`
Shows help and available commands

```
/contextstack
```

#### `/extract-actions`
Extracts action items from recent messages in the channel

```
/extract-actions
```

#### `/create-task [title]`
Creates a new task

```
/create-task Review PR #234
```

### Sidebar Panel

Click the **ContextStack** icon in the sidebar to:
- View recent messages
- See extracted actions
- Find relevant documents
- Get suggested replies
- Create tasks

### Message Actions

Right-click any message and select:
- **Extract Actions** - Get action items from this message
- **Get Context** - See full context analysis

## Configuration

### Backend Settings

The extension connects to:
- **Backend API**: https://contextstack-backend.onrender.com
- **NLP Service**: https://zoho-contextstack.onrender.com

To use your own backend:
1. Go to Extension Settings
2. Update Backend API URL
3. Update NLP Service URL
4. Save changes

## Permissions

This extension requires:
- `message.read` - Read messages in channels
- `message.write` - Send messages and cards
- `channel.read` - Access channel information
- `user.read` - Get user information

## Support

- **Documentation**: https://github.com/kartik1pandey/ZOHO_CONTEXTSTACK
- **Issues**: https://github.com/kartik1pandey/ZOHO_CONTEXTSTACK/issues
- **Email**: [Your Email]

## Privacy

- Messages are processed by our NLP service for action extraction
- No messages are stored permanently
- All data is encrypted in transit
- See our Privacy Policy for details

## License

MIT License - See LICENSE file

## Version History

### 1.0.0 (Current)
- Initial release
- Action extraction
- Context analysis
- Task creation
- Document search
- Smart suggestions
