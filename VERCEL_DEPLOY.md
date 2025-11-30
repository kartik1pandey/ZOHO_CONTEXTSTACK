# Deploy to Vercel + Render

## Quick Steps

### 1. Deploy Backend to Render (5 min)
- Go to https://dashboard.render.com/
- New Web Service → Connect GitHub
- Root: `backend`
- Build: `npm install`
- Start: `node server.js`
- Add env vars (see below)

### 2. Deploy NLP to Render (7 min)
- New Web Service → Connect GitHub
- Root: `nlp_service`
- Build: `pip install -r requirements.txt && python download_models.py`
- Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### 3. Deploy Frontend to Vercel (3 min)
- Go to https://vercel.com/
- Import GitHub repo
- Root Directory: `frontend`
- Framework: Vite
- Add env vars: `VITE_API_URL=https://your-backend.onrender.com`
- Deploy!

## Environment Variables

**Backend (Render)**:
```
PORT=4000
MONGO_URI=mongodb+srv://kartik:kplogin@codeeditor.0i9zkki.mongodb.net/contextstack?retryWrites=true&w=majority&appName=codeEditor
REDIS_URL=redis://default:2IQ5Zow4P0B6NyEtydZgTn41KkpesEKL@redis-16063.crce263.ap-south-1-1.ec2.cloud.redislabs.com:16063
NLP_URL=https://contextstack-nlp.onrender.com
NODE_ENV=production
```

**Frontend (Vercel)**:
```
VITE_API_URL=https://contextstack-backend-XXXX.onrender.com
VITE_BACKEND_URL=https://contextstack-backend-XXXX.onrender.com
```

## Your URLs
- Frontend: https://contextstack.vercel.app
- Backend: https://contextstack-backend.onrender.com
- NLP: https://contextstack-nlp.onrender.com
