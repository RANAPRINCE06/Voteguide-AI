# VoteGuide AI

An AI-powered full-stack web application designed to educate users about the election process. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, MongoDB, Firebase Auth, and OpenAI.

## Features
- **Firebase Authentication**: Google and Email OTP sign-in.
- **Interactive Learning**: Step-by-step election process guides.
- **AI Chat Assistant**: Ask questions and get answers powered by OpenAI.
- **Election Timeline**: Filter national and state election dates.
- **Dashboard**: Track your progress and earn badges.

## Prerequisites
- Node.js 18+
- MongoDB Atlas cluster
- Firebase Project
- OpenAI API Key

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   Provide valid keys for:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_FIREBASE_*`
   - `OPENAI_API_KEY`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Add all the environment variables from your `.env.local` into the Vercel project settings.
5. Click **Deploy**.

### Docker
1. Build the Docker image:
   ```bash
   docker build -t voteguide-ai .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.local voteguide-ai
   ```

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion
- Backend: Next.js API Routes, Node.js
- Database: MongoDB (Mongoose)
- Auth: Firebase
- AI: OpenAI API
