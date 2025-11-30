from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag

app = FastAPI(title="ContextStack NLP Service")

# Download NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', quiet=True)
    
try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger', quiet=True)

try:
    nltk.data.find('taggers/averaged_perceptron_tagger_eng')
except LookupError:
    nltk.download('averaged_perceptron_tagger_eng', quiet=True)

print("✅ NLP Service initialized with NLTK")

# Document store
doc_store = {}  # id -> {title, url, excerpt, vector}
vectorizer = TfidfVectorizer(max_features=100)

# Models
class TextIn(BaseModel):
    text: str

class ActionOut(BaseModel):
    text: str
    owner: Optional[str] = None
    deadline: Optional[str] = None
    score: float

class DocIndexIn(BaseModel):
    id: str
    text: str
    title: Optional[str] = None
    url: Optional[str] = None
    excerpt: Optional[str] = None

class DocSearchIn(BaseModel):
    text: str
    topK: int = 3

# Extraction logic
@app.post("/nlp/extract_actions", response_model=List[ActionOut])
async def extract_actions(inp: TextIn):
    """Extract actionable items from text"""
    actions = []
    
    # Tokenize into sentences
    sentences = sent_tokenize(inp.text)
    
    # Method 1: POS tagging to find verbs
    for sent in sentences:
        tokens = word_tokenize(sent)
        pos_tags = pos_tag(tokens)
        
        # Find verbs
        verbs = [word for word, pos in pos_tags if pos.startswith('VB')]
        
        if verbs:
            # Look for @mentions
            mentions = re.findall(r'@(\w+)', sent)
            owner = mentions[0] if mentions else None
            
            # Look for deadlines
            deadline = extract_deadline(sent)
            
            actions.append(ActionOut(
                text=sent.strip(),
                owner=owner,
                deadline=deadline,
                score=0.7
            ))
    
    # Method 2: Keyword heuristics
    keywords = ['please', 'can you', 'could you', 'assign', 'todo', 'task', 
                'fix', 'review', 'test', 'deploy', 'send', 'schedule', 'need to', 'should']
    
    text_lower = inp.text.lower()
    if any(kw in text_lower for kw in keywords) and len(actions) == 0:
        for sent in sentences:
            if any(kw in sent.lower() for kw in keywords):
                mentions = re.findall(r'@(\w+)', sent)
                owner = mentions[0] if mentions else None
                deadline = extract_deadline(sent)
                
                actions.append(ActionOut(
                    text=sent.strip(),
                    owner=owner,
                    deadline=deadline,
                    score=0.6
                ))
                break
    
    return actions[:5]  # Return top 5 actions

def extract_deadline(text: str) -> Optional[str]:
    """Simple deadline extraction"""
    patterns = [
        r'by\s+(\w+day)',  # by Friday
        r'by\s+(\w+\s+\d+)',  # by Nov 30
        r'due\s+(\w+)',
        r'deadline[:\s]+(\w+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    
    return None

# Embeddings
@app.post("/nlp/embeddings")
async def get_embeddings(inp: TextIn):
    """Generate embedding vector for text using TF-IDF"""
    try:
        # Simple TF-IDF based embedding
        if len(doc_store) > 0:
            all_texts = [doc['text'] for doc in doc_store.values()] + [inp.text]
            vectors = vectorizer.fit_transform(all_texts)
            vector = vectors[-1].toarray()[0]
        else:
            # If no docs yet, create a simple vector
            vector = np.zeros(100)
        
        return {"vector": vector.tolist()}
    except Exception as e:
        return {"vector": np.zeros(100).tolist()}

# Document indexing
@app.post("/nlp/index_doc")
async def index_doc(doc: DocIndexIn):
    """Add document to store"""
    try:
        # Store document
        doc_store[doc.id] = {
            "title": doc.title or "Untitled",
            "url": doc.url,
            "excerpt": doc.excerpt or doc.text[:200],
            "text": doc.text
        }
        
        return {"success": True, "id": doc.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Document search
@app.post("/nlp/search_docs")
async def search_docs(search: DocSearchIn):
    """Search for similar documents using TF-IDF"""
    try:
        if len(doc_store) == 0:
            return []
        
        # Get all documents
        doc_ids = list(doc_store.keys())
        doc_texts = [doc_store[doc_id]['text'] for doc_id in doc_ids]
        
        # Add query to texts
        all_texts = doc_texts + [search.text]
        
        # Calculate TF-IDF vectors
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate cosine similarity
        query_vector = tfidf_matrix[-1]
        doc_vectors = tfidf_matrix[:-1]
        similarities = cosine_similarity(query_vector, doc_vectors)[0]
        
        # Get top K results
        top_indices = np.argsort(similarities)[::-1][:search.topK]
        
        results = []
        for idx in top_indices:
            doc_id = doc_ids[idx]
            doc_data = doc_store[doc_id]
            results.append({
                "id": doc_id,
                "title": doc_data["title"],
                "url": doc_data["url"],
                "excerpt": doc_data["excerpt"],
                "score": float(similarities[idx])
            })
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "docs_indexed": len(doc_store),
        "model": "TF-IDF + NLTK"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)