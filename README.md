# Mini AI Intake & Auto-Action Service

> A tiny HTTP service built with Node.js, Express, and TypeScript that serves as a simple intake and automation system.

This service exposes three endpoints to ingest text, perform mock actions based on classified intent, and report on its status. All generated "artifacts" (like leads or tasks) are saved as individual files in a local `out/` folder.

## Features

- **Entity Extraction:** Pulls key information like name, company, email, and phone from text.
- **Intent Classification:** Categorizes messages as `LEAD`, `SUPPORT`, `INVOICE`, or `OTHER`.
- **Automated Actions:** Triggers file-based "actions" based on the classified intent.
- **Health Check:** Provides a simple endpoint to monitor the service status.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed on your machine.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Server

To start the development server, run:

```bash
npm start
```

The server will start and listen on `http://localhost:3000`.

---

## Running with Docker

You can also run this service inside a Docker container.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

### Build the Image

First, build the Docker image from the `Dockerfile`:

```bash
docker build -t automation-service .
```

### Run the Container

Once the image is built, you can run it as a container:

```bash
docker run -p 3000:3000 -d --name automation-app automation-service
```

The service will be running and accessible at `http://localhost:3000`.

---

## API Endpoints

### 1. Ingest Message

This endpoint ingests a free-text message, extracts key information, and returns it as a JSON object.

- **Endpoint:** `POST /ingest`
- **Body:** `JSON`
  ```json
  {
    "message": "Hi, I'm Ahmed from Nile Real Estate, we need a dashboard for sales KPIs next month. Phone 01012345678, email ahmed@nile.com"
  }
  ```
- **Example Request:**
  ```bash
  curl -X POST http://localhost:3000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hi, I''m Ahmed from Nile Real Estate, we need a dashboard for sales KPIs next month. Phone 01012345678, email ahmed@nile.com"
  }'
  ```

### 2. Perform Automatic Action

This endpoint takes the JSON output from `/ingest` and performs a mock action based on the message's intent.

- **Endpoint:** `POST /auto-action`
- **Body:** `JSON` (The output from the `/ingest` endpoint)
  ```json
  {
    "name": "Ahmed",
    "company": "Nile Real Estate",
    "email": "ahmed@nile.com",
    "phone": "01012345678",
    "dates": ["2025-09-25"],
    "keywords": ["ahmed", "nile", "real", "estate", "dashboard"],
    "intent": "LEAD",
    "department": "Sales"
  }
  ```
- **Example Request:**
  ```bash
  curl -X POST http://localhost:3000/auto-action \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed",
    "company": "Nile Real Estate",
    "email": "ahmed@nile.com",
    "phone": "01012345678",
    "dates": ["2025-09-25"],
    "keywords": ["ahmed", "nile", "real", "estate", "dashboard"],
    "intent": "LEAD",
    "department": "Sales"
  }'
  ```

### 3. Health Check

This endpoint returns the service status and a count of the artifacts that have been created in the `out/` folder.

- **Endpoint:** `GET /health`
- **Example Request:**
  ```bash
  curl http://localhost:3000/health
  ```

---

## Intent & Department Rules

The classification logic uses a simple set of rules based on keywords found in the message. The department is then assigned based on the classified intent.

| Keywords                     | Intent    | Department | Action                                          |
| :--------------------------- | :-------- | :--------- | :---------------------------------------------- |
| `dashboard`, `kpis`, `sales` | `LEAD`    | `Sales`    | Creates a `crm_lead_{timestamp}.json` file.     |
| `help`, `issue`, `support`   | `SUPPORT` | `Support`  | Appends a line to `support_queue.log`.          |
| `invoice`, `payment`         | `INVOICE` | `Finance`  | Creates a `finance_task_{timestamp}.json` file. |
| _(None of the above)_        | `OTHER`   | `Unknown`  | No action is taken.                             |
