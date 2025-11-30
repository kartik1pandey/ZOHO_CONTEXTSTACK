# 📱 Zoho Cliq Extension - Complete Installation Guide

## 🎯 Goal
Get your installation URL: `https://cliq.zoho.com/installapp.do?id=YOUR_ID`

## ⏱️ Time Required
15-20 minutes

---

## 📋 Step-by-Step Instructions

### Step 1: Prepare Extension Files (2 minutes)

You need these 3 files from `cliq-extension-standalone/` folder:
1. ✅ `plugin-manifest.json` - Already created
2. ✅ `functions.js` - Already created
3. ⚠️ `icon.png` - **You need to create this**

#### Create Icon (128x128px PNG):
**Option A - Quick**: Use this online tool:
1. Go to https://www.canva.com/create/logos/
2. Create a 128x128px image with text "CS" or a brain icon
3. Download as PNG
4. Save as `icon.png` in `cliq-extension-standalone/` folder

**Option B - Use existing**: 
- Any 128x128px PNG image will work
- Just rename it to `icon.png`

---

### Step 2: Access Zoho Cliq (2 minutes)

1. **Login to Zoho Cliq**:
   - Go to https://cliq.zoho.com/
   - Login with your Zoho account

2. **Open Extensions Page**:
   - Click your **profile picture** (top right)
   - Select **Bots & Tools**
   - Click **Extensions**
   
   OR go directly to:
   ```
   https://cliq.zoho.com/company/[YOUR_ORG]/extensions
   ```

---

### Step 3: Create Extension (3 minutes)

1. **Click "Create Extension"** button (top right)

2. **Fill in Basic Details**:
   ```
   Extension Name: ContextStack
   Description: AI-powered workspace context manager
   Category: Productivity
   ```

3. **Click "Create"**

---

### Step 4: Upload Manifest (2 minutes)

1. **In the extension editor**, click **"Manifest"** tab (left sidebar)

2. **Click "Upload Manifest"** button

3. **Select file**: `cliq-extension-standalone/plugin-manifest.json`

4. **Click "Upload"**

5. You should see the manifest content displayed

6. **Click "Save"** (top right)

---

### Step 5: Upload Functions (2 minutes)

1. **Click "Functions"** tab (left sidebar)

2. **Click "Upload"** or **"Import"** button

3. **Select file**: `cliq-extension-standalone/functions.js`

4. **Click "Upload"**

5. You should see the function code displayed

6. **Click "Save"** (top right)

---

### Step 6: Upload Icon (1 minute)

1. **Click "Settings"** tab (left sidebar)

2. **Under "Extension Icon"**, click **"Upload"**

3. **Select file**: `cliq-extension-standalone/icon.png`

4. **Click "Upload"**

5. You should see the icon preview

6. **Click "Save"** (top right)

---

### Step 7: Publish Extension (3 minutes)

1. **Click "Publish"** button (top right)

2. **Choose Publishing Option**:
   
   **Option A - Organization Only** (Recommended for testing):
   - Select **"Publish to Organization"**
   - Only your organization can install
   - Instant approval
   - **Choose this for quick submission**
   
   **Option B - Marketplace** (For public use):
   - Select **"Publish to Marketplace"**
   - Anyone can install
   - Requires Zoho review (1-2 weeks)
   - Choose this for wider distribution

3. **Click "Publish"**

4. **Confirm** the publishing

---

### Step 8: Install Extension (2 minutes)

1. After publishing, you'll see an **"Install"** button

2. **Click "Install"**

3. **Grant Permissions**:
   - ✅ Read messages
   - ✅ Write messages
   - ✅ Read channel information
   - ✅ Read user information

4. **Click "Authorize"**

5. Extension is now installed in your workspace!

---

### Step 9: Get Installation URL (1 minute)

After installation, you'll get your URL:

**Format**:
```
https://cliq.zoho.com/installapp.do?id=YOUR_EXTENSION_ID
```

**Where to find it**:
1. Go to **Extensions** page
2. Find your **ContextStack** extension
3. Click on it
4. Look for **"Installation URL"** or **"Share Link"**
5. **Copy this URL** - This is your submission URL!

---

### Step 10: Test Extension (3 minutes)

1. **Open any Cliq channel**

2. **Type**: `/contextstack`
   - Should show help message

3. **Type**: `/extract-actions`
   - Should analyze recent messages
   - May take 30-60 seconds on first request (backend waking up)

4. **Type**: `/create-task Test Task`
   - Should create a task

5. **If all commands work**: ✅ Extension is ready!

---

## 🎯 Your Submission Information

### App Name
```
ContextStack
```

### App Installation URL
```
https://cliq.zoho.com/installapp.do?id=YOUR_EXTENSION_ID
```
*(Replace YOUR_EXTENSION_ID with your actual ID)*

### App Description
```
ContextStack is an AI-powered workspace context manager for Zoho Cliq that extracts actionable insights from team conversations. It automatically identifies tasks, finds relevant documentation, and provides intelligent suggestions using advanced NLP technology. Features include AI-powered action extraction, context analysis, task creation, document search, and smart reply suggestions. Perfect for teams looking to streamline communication and track action items across channels.
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Cannot upload manifest"
**Solution**: 
- Check JSON syntax in `plugin-manifest.json`
- Make sure file is valid JSON
- Try copying content and pasting directly

### Issue 2: "Functions not working"
**Solution**:
- Make sure `functions.js` is uploaded correctly
- Check for JavaScript syntax errors
- Save after uploading

### Issue 3: "Extension not showing in Cliq"
**Solution**:
- Make sure you clicked "Install" after publishing
- Refresh Cliq page
- Check permissions were granted

### Issue 4: "Commands return errors"
**Solution**:
- Backend may be starting up (wait 60 seconds)
- Try command again
- Check backend URL is correct in functions.js

### Issue 5: "Can't find installation URL"
**Solution**:
- Go to Extensions page
- Click on your extension
- Look for "Share" or "Installation Link"
- Or use format: `https://cliq.zoho.com/installapp.do?id=YOUR_ID`

---

## 📞 Quick Help

### If You're Stuck:
1. Make sure all 3 files are uploaded (manifest, functions, icon)
2. Click "Save" after each upload
3. Click "Publish" before installing
4. Click "Install" to use in your workspace

### If Commands Don't Work:
1. Wait 60 seconds (backend waking up)
2. Try command again
3. Check you're in a channel (not DM)

---

## ✅ Final Checklist

Before submitting:
- [ ] Extension created in Cliq
- [ ] Manifest uploaded and saved
- [ ] Functions uploaded and saved
- [ ] Icon uploaded and saved
- [ ] Extension published
- [ ] Extension installed in workspace
- [ ] Tested `/contextstack` command
- [ ] Tested `/extract-actions` command
- [ ] Got installation URL
- [ ] Ready to submit!

---

## 🎉 Success!

You now have:
1. ✅ Working Cliq extension
2. ✅ Installation URL for submission
3. ✅ All commands functional

**Your installation URL is ready to submit!**

---

## 📱 Alternative: Use Web App URL

If you face any issues with Cliq extension, you can submit the web app URL:

```
https://zoho-contextstack.vercel.app
```

This is a fully functional web application that works standalone.

---

## 🚀 You're Done!

Total time: ~15-20 minutes

Your ContextStack extension is ready for submission! 🎉
