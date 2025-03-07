# AI Agent - CLI Bot

## Overview
This is a simple AI-powered chatbot that uses OpenAI's API. It includes a backend built with **Node.js & Express** and a frontend using **HTML, JavaScript, and NGINX**.

## Prerequisites
Before running the app locally, ensure you have the following installed:
- **Docker** (with Docker Compose)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <repo-url>
cd ai-agent
```

### 2. Set Up Environment Variables
- Create a `.env` file in the **root directory (`ai-agent/`)**.
- Add the following environment variables:
  ```sh
  OPENAI_API_KEY=your_openai_api_key_here
  API_URL=http://localhost:3000/api/chat
```

### 3. Start the Application with Docker Compose
```sh
docker compose up -d --build
```

- **Backend** runs at `http://localhost:3000`
- **Frontend** runs at `http://localhost:5500`

## How to Use
1. Open `http://localhost:5500/` in a browser.
2. Enter a message in the chatbot interface.
3. The chatbot will respond using OpenAI's API.

## Troubleshooting
- **Backend not responding?** Check Docker container logs with `docker logs backend_service`.
- **CORS issue?** Ensure Docker services are running and API URLs are correctly set in the `.env`.
- **API key error?** Ensure your OpenAI API key is correctly set in `.env`.

## License
This project is open-source. Feel free to modify and improve it!