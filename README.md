# AI Agent - CLI Bot

## Overview
This is a simple AI-powered chatbot that uses OpenAI's API. It includes a backend built with **Node.js & Express** and a frontend using **HTML, JavaScript, and Python's HTTP server**.

## Prerequisites
Before running the app locally, ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Python 3** (for serving the frontend)

## Setup Instructions

### 1 Clone the Repository
```sh
git clone <repo-url>
cd ai-agent
```

### 2 Set Up Environment Variables
- Create a `.env` file in the **root directory (`ai-agent/`)**.
- Add the following environment variable:
  ```sh
  OPENAI_API_KEY=your_openai_api_key_here
  ```

### 3️⃣ Install Backend Dependencies
```sh
cd cli-bot-backend
npm install
```

### 4️ Start the Backend Server
```sh
node index.js
```
The backend should now be running at `http://localhost:3000/`.

### 5 Start the Frontend Server
Open a new terminal and run:
```sh
cd cli-bot-frontend
python3 -m http.server 5500
```
The frontend should now be accessible at `http://localhost:5500/`.

## How to Use
1. Open `http://localhost:5500/` in a browser.
2. Enter a message in the chatbot interface.
3. The chatbot will respond using OpenAI's API.

## Troubleshooting
- **Backend not responding?** Ensure your `.env` file is correctly set and restart `node index.js`.
- **CORS issue?** Ensure the frontend is running on **port 5500** and the backend on **port 3000**.
- **API key error?** Make sure the OpenAI API key is correctly set in `.env`.

## License
This project is open-source. Feel free to modify and improve it!