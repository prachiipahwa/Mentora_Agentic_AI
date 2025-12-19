
# Mentora 
## Not just a mentor, Your multi-agent study navigator.

**Mentora** is an intelligent, multi-agent ecosystem designed to navigate the complexities of your academic journey. It goes beyond simple advice by deploying a squad of specialized AI agents that work in unison to manage your time, strategy, and knowledge.

By coordinating four distinct agents, Mentora ensures you not only have a teacher but also a manager, a strategist, and an analyst dedicated to your success.

## 🎥 Working Demo

<div align="center">
  <a href="https://youtu.be/NiHpreSuUxI" target="_blank">
    <img src="https://github.com/prachiipahwa/Mentora_Agentic_AI/blob/main/frontend/public/demo-thumbnail.jpeg" alt="Watch the Mentora Demo" width="100%" style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.2);" />
  </a>
  <p><i>Click the image above to watch the full walkthrough</i></p>
</div>
## 🎯 The Motive

Modern students face a three-front war: **Information Overload**, **Poor Strategy**, and **Time Mismanagement**. Mentora solves this by fusing four powerful AI agents into a single cohesive platform:

1.  **The Knowledge Navigator**: Your personal researcher that digests textbooks instantly.
2.  **The Logistic Navigator**: Your executive assistant that manages your calendar.
3.  **The Strategist**: Your academic coach that builds personalized study plans.
4.  **The Analyst**: Your performance tracker that reviews your progress and keeps you accountable.

## 🤖 Meet the Agents

### 🧠 Agent 1: The Knowledge Navigator (RAG)
* **Role**: Document Intelligence & Research
* **Capabilities**:
    * **Instant Mastery**: Upload course PDFs and instantly unlock their contents.
    * **Contextual Q&A**: Ask complex questions and get answers grounded in your specific documents, complete with citations.
    * **Local Privacy**: Uses `Transformers.js` for secure, local vector embeddings.

### 🗓️ Agent 2: The Logistic Navigator (Scheduling)
* **Role**: Time Management & Execution
* **Capabilities**:
    * **Smart Sync**: Seamlessly connects with Google Calendar and Tasks via OAuth 2.0 to ensure your schedule is always up to date.
    * **Conflict Resolution**: Checks your existing calendar to prevent double-booking study sessions.
    * **Timezone Awareness**: Intelligently handles scheduling across different time zones.

### 📐 Agent 3: The Strategist (Planning)
* **Role**: Curriculum Design & Strategy
* **Capabilities**:
    * **Intelligent Planning**: Takes your raw syllabus and deadlines to generate structured, step-by-step study plans.
    * **Deadline Back-casting**: Calculates exactly when you need to start studying to finish before the exam.
    * **Adaptive Pacing**: Adjusts the intensity of study sessions based on the difficulty of the material.

### 📈 Agent 4: The Analyst (Tracking)
* **Role**: Performance Review & Analytics
* **Capabilities**:
    * **Progress Tracking**: Monitors which tasks you've completed and which are overdue.
    * **AI Summaries**: Generates intelligent daily and weekly summaries of your productivity using Llama 3.1.
    * **Feedback Loops**: Provides actionable insights on your study habits to improve future efficiency.

## 🏗️ System Architecture

Mentora operates as a modular system where these agents interact via microservices:

```bash
mentora-agentic-ai/
├── frontend/           # The Command Center (User Interface)
├── calendar-agent/     # Houses Agent 2 (Logistics), Agent 3 (Strategy), & Agent 4 (Analyst)
└── rag-backend/        # Houses Agent 1 (Knowledge)

```

## 🛠️ Installation & Setup

To launch your navigator, you must run the full fleet of services.

### Prerequisites

* Node.js (v18+)
* Supabase Account
* Groq API Key
* Google Cloud Console Project (for Calendar integration)

### 1. Environment Configuration

Before running the agents, you need to obtain your API keys:

**Supabase Setup (Database):**

1. Create a new project at [database.new](https://database.new).
2. Navigate to **Project Settings** > **API**.
3. Copy the `Project URL` and `anon public` key.
4. You will use these as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

**Groq Setup (AI Intelligence):**

1. Sign up for an account at [console.groq.com](https://console.groq.com).
2. Navigate to the **API Keys** section and click **Create API Key**.
3. Copy the key immediately (it won't be shown again).
4. You will use this as `GROQ_API_KEY`.

### 2. Database Initialization

Run the SQL schemas provided in the respective backend folders in your Supabase SQL Editor:

* **RAG Tables**: `rag-backend/src/db/schema.sql`.
* **Calendar/Plan/Track Tables**: `calendar-agent/schema.sql`.

### 3. Start the Agents

**Terminal 1: Logistics, Strategy & Analyst Agents**

```bash
cd calendar-agent
npm install
cp .env.example .env # Add Google & Supabase Credentials
npm run dev

```

**Terminal 2: Knowledge Agent**

```bash
cd rag-backend
npm install
cp .env.example .env # Add Groq & Supabase Credentials
npm start

```

**Terminal 3: Command Center (Frontend)**

```bash
cd frontend
npm install
npm run dev

```

## 🤝 Contributing

We welcome fellow navigators!

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/NewCapability`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.
