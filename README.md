# Quiz Application

A full-stack quiz app with a NestJS backend, React frontend, and PostgreSQL database.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) (for PostgreSQL)
- npm

## Environment Setup

Copy the example environment file at the project root:

```bash
cp .env.example .env
```

Default values in `.env`:

| Variable            | Default     | Description                               |
| ------------------- | ----------- | ----------------------------------------- |
| `BACKEND_PORT`      | `3000`      | Backend API port                          |
| `POSTGRES_PORT`     | `5432`      | PostgreSQL port                           |
| `FRONTEND_PORT`     | `80`        | Frontend port (Docker only)               |
| `POSTGRES_USER`     | `admin`     | Database user                             |
| `POSTGRES_PASSWORD` | `masterkey` | Database password                         |
| `POSTGRES_DB`       | `postgres`  | Database name                             |
| `POSTGRES_HOST`     | `db`        | Database host (`localhost` for local dev) |

### Start PostgreSQL with Docker

From the project root:

```bash
docker compose up db -d
```

When running the backend locally, set the database host to your machine:

```bash
POSTGRES_HOST=localhost
```

Verify the database is running:

```bash
docker compose ps
```

## Start Frontend and Backend

### Backend

```bash
cd backend
npm install
npm run start:dev
```

The API runs at [http://localhost:3000](http://localhost:3000).

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The UI runs at [http://localhost:5173](http://localhost:5173) (Vite default). API requests are proxied to the backend on port 3000.

### Run everything with Docker

To start the database, backend, and frontend together:

```bash
docker compose up --build
```

- Frontend: [http://localhost:80](http://localhost:80)
- Backend: [http://localhost:3000](http://localhost:3000)

## Create a Sample Quiz

### Option 1: Web UI

1. Open [http://localhost:5173/create](http://localhost:5173/create) (or `/create` on the Docker frontend URL).
2. Enter a quiz title.
3. Add questions. Supported types:
   - **input** - free-text answer
   - **boolean** - True/False
   - **checkbox** - multiple choice
4. Click save. You will be redirected to the quiz list.

### Option 2: API (curl)

With the backend running, send a `POST` request to `/quizzes`:

```bash
curl -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Geography Quiz",
    "questions": [
      {
        "title": "What is the capital of France?",
        "type": "input",
        "answer": "Paris"
      },
      {
        "title": "The Earth is flat.",
        "type": "boolean",
        "variants": [
          { "text": "True", "isCorrect": false },
          { "text": "False", "isCorrect": true }
        ]
      },
      {
        "title": "Which are European countries?",
        "type": "checkbox",
        "variants": [
          { "text": "Germany", "isCorrect": true },
          { "text": "Brazil", "isCorrect": false },
          { "text": "Spain", "isCorrect": true }
        ]
      }
    ]
  }'
```
