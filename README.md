# Interactive Prompt Playground

A full-stack playground for experimenting with prompt engineering and language model parameters, featuring a React frontend and an Express/Node.js backend integrated with the OpenAI API.

---

## Features

- **Parameter Control:** Easily adjust model parameters (temperature, max tokens, presence penalty, frequency penalty) for each prompt configuration.
- **Model Selection:** Choose between different OpenAI models (e.g., `gpt-3.5-turbo`, `gpt-4`).
- **Multiple Configurations:** Add and compare multiple prompt configurations in a single run.
- **Result Table:** View outputs for each configuration side-by-side.
- **Automated Reflection:** Generate a 2-paragraph analysis comparing the outputs and explaining the impact of parameter changes.

---

## Project Structure

```
interactive-prompt-playground/
├── backend/          # Express backend (API server)
│   ├── index.js
│   ├── package.json
│   └── .env          # Place your OpenAI API key here
├── src/              # React frontend source code
│   ├── App.jsx
│   └── ...
├── public/
├── package.json      # Frontend dependencies
└── README.md
```

---

## How to Run the Playground

### 1. Backend Setup (Express API)

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Create a `.env` file in `backend/` with your OpenAI API key:
     ```env
     OPENAI_API_KEY=your-openai-key-here
     ```
3. **Start the backend server:**
   ```sh
   npm run dev
   # The backend runs on http://localhost:5000
   ```

### 2. Frontend Setup (React + Vite)

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the frontend dev server:**
   ```sh
   npm run dev
   # The frontend runs on http://localhost:5173 (default)
   ```

> **Note:** The frontend expects the backend to be running at `http://localhost:5000`. You can change this in `src/CommonExports.js` if needed.

---

## Usage Guide

1. Enter a **System Prompt** (e.g., "You are a helpful assistant...") and a **User Prompt** (e.g., "Write a product description for an iPhone.").
2. Add one or more **Prompt Configurations**:
   - **Model:** Select the language model.
   - **Temperature:** Controls randomness/creativity.
   - **Max Tokens:** Limits output length.
   - **Presence Penalty:** Penalizes new topic introduction.
   - **Frequency Penalty:** Penalizes repetition.
3. Click **Generate** to run all configurations. Results are displayed in a table.
4. Click **Generate 2-Paragraph Reflection** to analyze differences between outputs.

---

## Backend API Endpoints

- `POST /api/generate` — Generate a completion for a given prompt and parameter set.
- `POST /api/analyze` — Analyze and reflect on a set of results (requires at least two results).

---

## Requirements
- Node.js (v18+ recommended)
- OpenAI API key

---

