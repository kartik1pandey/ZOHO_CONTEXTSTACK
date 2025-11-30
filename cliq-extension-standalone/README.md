# ContextStack - Zoho Cliq Extension

AI-powered workspace context manager for Zoho Cliq.

## 📦 Package Contents

This extension package contains:
- `plugin-manifest.json` - Extension configuration
- `functions.js` - All extension logic and commands
- `icon.png` - Extension icon (128x128px)
- `README.md` - This file

## 🚀 Installation Steps

### Step 1: Access Zoho Cliq Developer Console

1. Go to https://cliq.zoho.com/
2. Click on your profile picture (top right)
3. Select **Bots & Tools** → **Extensions**
4. Or go directly to: https://cliq.zoho.com/company/[YOUR_ORG]/extensions

### Step 2: Create New Extension

1. Click **Create Extension** button
2. Fill in the details:
   - **Extension Name**: ContextStack
   - **Description**: AI-powered workspace context manager
   - **Category**: Productivity

### Step 3: Upload Files

1. **Upload Manifest**:
   - Click **Upload Manifest**
   - Select `plugin-manifest.json`
   - Click **Upload**

2. **Upload Functions**:
   - Click **Functions** tab
   - Click **Upload**
   - Select `functions.js`
   - Click **Upload**

3. **Upload Icon**:
   - Click **Settings** tab
   - Under **Icon**, click **Upload**
   - Select `icon.png` (128x128px PNG)
   - Click **Upload**

### Step 4: Save and Publish

1. Click **Save** button
2. Click **Publish** button
3. Select **Publish to Organization** (for internal use)
4. Or select **Publish to Marketplace** (for public use)

### Step 5: Install in Your Workspace

1. After publishing, you'll see an **Install** button
2. Click **Install**
3. Grant the required permissions:
   - Read messages
   - Write messages
   - Read channel information
   - Read user information
4. Click **Authorize**

### Step 6: Get Installation URL

After installation, you'll get a URL like:
```
https://cliq.zoho.com/installapp.do?id=YOUR_EXTENSION_ID
```

**This is your submission URL!**

## 🎯 Available Commands

Once installed, use these commands in any Cliq channel:

### `/contextstack`
Shows help and available commands

### `/extract-actions`
Extracts action items from recent messages using AI/NLP
- Analyzes last 10 messages
- Uses advanced NLP (NLTK + ML)
- Shows assignees and deadlines
- Provides confidence scores

### `/analyze-context`
Gets full context analysis with:
- Recent message summary
- AI-detected actions
- Relevant documents
- Smart reply suggestions

### `/create-task [title]`
Creates a task in the system
Example: `/create-task Review PR #234`

## 🔧 Backend Services

This extension connects to:
- **Backend API**: https://contextstack-backend.onrender.com
- **NLP Service**: https://zoho-contextstack.onrender.com
- **Web Dashboard**: https://zoho-contextstack.vercel.app

## ⚠️ Important Notes

### First Request Delay
The backend services are on free tier and may sleep after inactivity.
- First request may take 30-60 seconds
- Subsequent requests are fast (< 200ms)
- This is normal for free tier hosting

### Permissions Required
- `message.read` - To read channel messages
- `message.write` - To send responses
- `channel.read` - To access channel info
- `user.read` - To get user information

## 🎨 Features

- ✅ AI-powered action extraction
- ✅ Context-aware analysis
- ✅ Smart reply suggestions
- ✅ Document search
- ✅ Task management
- ✅ Real-time processing
- ✅ Cloud-based NLP

## 📊 Technical Details

### Architecture
```
Zoho Cliq Extension
    ↓
Backend API (Render)
    ├── MongoDB Atlas (Data)
    ├── Redis Cloud (Cache)
    └── NLP Service (Render)
        └── NLTK + scikit-learn
```

### Technologies
- **Frontend**: Zoho Cliq Extension API
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud
- **NLP**: Python + FastAPI + NLTK

## 🆘 Troubleshooting

### Extension Not Showing
- Make sure you clicked **Install** after publishing
- Check that permissions were granted
- Try refreshing Cliq

### Commands Not Working
- Verify extension is installed
- Check that backend services are running
- Wait 60 seconds if first request (services waking up)

### "Error" Messages
- Backend may be starting up (wait 60 seconds)
- Check internet connection
- Try command again

## 📞 Support

- **GitHub**: https://github.com/kartik1pandey/ZOHO_CONTEXTSTACK
- **Web App**: https://zoho-contextstack.vercel.app
- **Documentation**: See main README

## 📝 Version

**Version**: 1.0.0
**Last Updated**: 2024

## ✅ Installation Checklist

- [ ] Accessed Cliq Developer Console
- [ ] Created new extension
- [ ] Uploaded plugin-manifest.json
- [ ] Uploaded functions.js
- [ ] Uploaded icon.png
- [ ] Saved extension
- [ ] Published extension
- [ ] Installed in workspace
- [ ] Tested commands
- [ ] Got installation URL
- [ ] Ready to submit!

## 🎉 Success!

Your ContextStack extension is now installed and ready to use!

Try it: Type `/contextstack` in any Cliq channel to get started.
