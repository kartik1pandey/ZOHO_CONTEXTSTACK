# ContextStack - AI-Powered Workspace Context Manager

ContextStack is an intelligent workspace assistant that helps teams manage conversations, extract actionable tasks, and maintain context across channels. Built with React, Node.js, and Python NLP services.

## 🌟 Features

- **Smart Message Management**: Organize conversations across multiple channels
- **AI-Powered Action Extraction**: Automatically identify tasks and action items from messages
- **Document Search**: Find relevant documentation using semantic search
- **Context Awareness**: Get intelligent suggestions based on conversation context
- **Real-time Caching**: Fast performance with Redis Cloud
- **Cloud-Native**: MongoDB Atlas for data persistence

## 🚀 Live Demo

**App Name**: ContextStack
**Installation URL**: [Will be added after deployment]
**Description**: AI-powered workspace context manager that extracts actionable insights from team conversations

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- React 18 with Vite
- Tailwind CSS for styling
- Lucide React for icons

**Backend**:
- Node.js with Express
- MongoDB Atlas (cloud database)
- Redis Cloud (caching layer)
- Mongoose ODM

**NLP Service**:
- Python FastAPI
- NLTK for natural language processing
- scikit-learn for ML features
- TF-IDF for document similarity

## 📦 Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (optional)
- MongoDB Atlas account
- Redis Cloud account

### Option 1: Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/contextstack.git
cd contextstack
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas and Redis Cloud credentials
```

3. **Install and run Backend**
```bash
cd backend
npm install
npm start
```

4. **Install and run Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Install and run NLP Service**
```bash
cd nlp_service
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Linux/Mac
pip install -r requirements.txt
python download_models.py
python app.py
```

6. **Load sample data**
```bash
cd backend
node load-sample-data.js
```

7. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- NLP Service: http://localhost:8000

### Option 2: Docker Compose

1. **Clone and configure**
```bash
git clone https://github.com/YOUR_USERNAME/contextstack.git
cd contextstack
cp .env.example .env
# Edit .env with your credentials
```

2. **Build and run**
```bash
docker-compose build
docker-compose up -d
```

3. **Load sample data**
```bash
docker-compose exec backend node load-sample-data.js
```

4. **Access the application**
- Frontend: http://localhost:5173

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/contextstack?retryWrites=true&w=majority
REDIS_URL=redis://default:password@host:port
NLP_URL=http://localhost:8000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:4000
```

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address (or 0.0.0.0/0 for development)
4. Get your connection string
5. Update `MONGO_URI` in `.env`

### Redis Cloud Setup

1. Create a free database at [Redis Cloud](https://redis.com/try-free/)
2. Get your connection details
3. Update `REDIS_URL` in `.env`

## � APeI Documentation

### Backend Endpoints

#### Health Check
```
GET /health
Response: {"status":"ok","timestamp":"..."}
```

#### Messages
```
GET /api/messages/:channelId?limit=20
POST /api/messages/ingest
```

#### Tasks
```
GET /api/tasks
POST /api/tasks
```

#### Documents
```
GET /api/docs
POST /api/docs
```

#### Context (with NLP)
```
POST /api/context
Body: {"channelId":"dev-frontend","messageId":"M_001","limit":5}
Response: {messages, actions, relevantDocs, suggestedReply}
```

### NLP Service Endpoints

#### Action Extraction
```
POST /nlp/extract_actions
Body: {"text":"Please review the PR by Friday"}
Response: [{text, owner, deadline, score}]
```

#### Document Search
```
POST /nlp/search_docs
Body: {"text":"authentication", "topK":3}
Response: [{id, title, url, excerpt, score}]
```

## 🎯 Features in Detail

### 1. Channel-Based Organization
- Organize messages by channels (dev-frontend, marketing, support)
- Switch between channels seamlessly
- View message history per channel

### 2. AI Action Extraction
- Automatically detect actionable items from messages
- Extract assignees from @mentions
- Identify deadlines from natural language
- Score actions by confidence

### 3. Context Sidebar
- Click any message to see full context
- View related tasks and documents
- Get AI-generated suggested replies
- See conversation history

### 4. Document Management
- Store and index documentation
- Semantic search using TF-IDF
- Find relevant docs based on message content

### 5. Performance Optimization
- Redis caching for frequently accessed data
- Optimized database queries
- Fast response times

## 🚢 Deployment

### Deploy to Render (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/contextstack.git
git push -u origin main
```

2. **Deploy Backend**
- Go to [Render Dashboard](https://dashboard.render.com/)
- New → Web Service
- Connect your GitHub repository
- Settings:
  - Name: contextstack-backend
  - Root Directory: backend
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Add environment variables from `.env`

3. **Deploy Frontend**
- New → Static Site
- Connect your GitHub repository
- Settings:
  - Name: contextstack-frontend
  - Root Directory: frontend
  - Build Command: `npm install && npm run build`
  - Publish Directory: dist
  - Add environment variable: `VITE_API_URL=https://contextstack-backend.onrender.com`

4. **Deploy NLP Service**
- New → Web Service
- Connect your GitHub repository
- Settings:
  - Name: contextstack-nlp
  - Root Directory: nlp_service
  - Runtime: Python 3
  - Build Command: `pip install -r requirements.txt && python download_models.py`
  - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Deploy to Railway

Similar steps, but use [Railway](https://railway.app/) instead.

### Deploy to Heroku

Use the included `Procfile` and deploy each service separately.

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/messages/dev-frontend?limit=5
```

### Test NLP Service
```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/nlp/extract_actions \
  -H "Content-Type: application/json" \
  -d '{"text":"Please review the PR by Friday"}'
```

### Test Frontend
Open http://localhost:5173 in your browser

## 📊 Project Structure

```
contextstack/
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (cache, etc.)
│   ├── server.js           # Main server file
│   └── Dockerfile          # Backend Docker config
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js      # Vite configuration
│   └── Dockerfile          # Frontend Docker config
├── nlp_service/            # Python NLP service
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # NLP Docker config
├── data/                   # Sample data
├── scripts/                # Utility scripts
├── docker-compose.yml      # Docker orchestration
└── README.md              # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React, Node.js, and Python
- Uses MongoDB Atlas for database
- Uses Redis Cloud for caching
- NLP powered by NLTK and scikit-learn

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for better team collaboration**
