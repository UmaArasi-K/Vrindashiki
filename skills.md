# Vrindashiki Skills & Scripts

This document outlines the essential commands and scripts needed to manage the repository, run the application, and deploy it to Google Cloud.

## 1. Version Control (Git)

**Initialize Repository:**
```powershell
git init
git add .
git commit -m "Initial commit"
```

**Push to Repository:**
```powershell
# Add remote origin
git remote add origin <repository_url>

# Push changes
git add .
git commit -m "Your commit message"
git push origin main
```

## 2. Frontend (React + Vite)

**Initialize Project:**
```powershell
# We use npm create vite@latest
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

**Run Development Server:**
```powershell
cd frontend
npm run dev
```

**Build for Production:**
```powershell
cd frontend
npm run build
```

## 3. Backend (Node.js/Express)

**Initialize Project:**
```powershell
mkdir backend
cd backend
npm init -y
npm install express cors dotenv firebase-admin
npm install -D typescript @types/express @types/node @types/cors ts-node-dev
npx tsc --init
```

**Run Development Server:**
```powershell
cd backend
npm run dev
```

## 4. Deployment (Google Cloud Run)

**Build and Submit Container Image:**
```powershell
cd backend
gcloud builds submit --tag gcr.io/<PROJECT_ID>/vrindashiki-api
```

**Deploy to Cloud Run:**
```powershell
gcloud run deploy vrindashiki-api --image gcr.io/<PROJECT_ID>/vrindashiki-api --platform managed --region us-central1 --allow-unauthenticated
```
