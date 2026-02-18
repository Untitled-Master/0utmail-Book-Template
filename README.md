# 📚 Library Notification System

A full-stack playground for testing transactional email notifications. This project consists of a **Node.js/Express backend** that sends HTML emails using `0utmailcore` and a **React frontend** dashboard to trigger them.

## 🚀 Features

*   **3 Email Templates:** New Arrival, Return Reminder, and Event Invitation.
*   **HTML Email Builder:** Generates responsive, professional email layouts.
*   **React Playground:** A dashboard to input data, auto-fill test data, and view server logs in real-time.
*   **Live API Logging:** View request payloads and server status codes directly in the UI.

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Lucide Icons.
*   **Backend:** Node.js, Express, 0utmailcore (Gmail API wrapper).

---

## 📦 Setup & Installation

### 1. Backend (Server)

1.  Navigate to the server directory.
2.  Install dependencies:
    ```bash
    npm install express cors 0utmailcore
    ```
3.  Start the API server:
    ```bash
    node index.js
    ```
    *Server will run at `http://localhost:3000`*

### 2. Frontend (Client)

1.  Navigate to the client directory (where your Vite app is).
2.  Install dependencies:
    ```bash
    npm install lucide-react
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *Open the link provided (usually `http://localhost:5173`) to view the playground.*

---

## 🔌 API Endpoints

The frontend communicates with the backend via these POST routes:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/notify/new-book` | Alerts patrons about a new book arrival. |
| `POST` | `/api/notify/return` | Sends a due date reminder. |
| `POST` | `/api/notify/event` | Invites patrons to a library event. |

## ⚠️ Important Note

The `index.js` file currently contains hardcoded API keys and Tokens. In a production environment, ensure these are moved to a `.env` file and never committed to public repositories or use private repos.
