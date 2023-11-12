# Real-time Chat

Demo video
[<img src="https://img.youtube.com/vi/oLMrXecIO7Q/hqdefault.jpg" width="900" height="400" />](https://www.youtube.com/embed/oLMrXecIO7Q)

## Features

* Cookied-based authentication (User registration + Login/Logout).
* OAuth2 with Password (and hashing), Bearer with JWT tokens.
* Search users by username and full name.
* Send and receive real-time messages with WebSocket.
* WebSocket connections with auto-reconnection and exponential backoff.
* Support multiple same-user sessions.
* ORMs for database models, with migrations.
* Traefik integration, including Let's Encrypt HTTPS certificates automatic generation.
* Containerized backend with Docker.

## Technology stack

* NextJS + ReactJS
* FastAPI - Python
* PostgreSQL
* WebSocket
* Docker

## Installation

### 1. Pre-requisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Node.js 20](https://nodejs.org/en/)

### 2. Backend

In your Terminal, in the root directory, run:

```bash
docker-compose build
```

### 3. Frontend

In your Terminal, navigate to [frontend/](frontend) directory, and run:

```bash
npm install
```

## Run the project

### 1. Run database and backend

In your Terminal, in the root directory, run :

```bash
docker-compose up -d
```

The backend will be ready to interact after the `INFO` log line `Application startup complete.` appears.

### 2. Run frontend

In your Terminal, navigate to [frontend/](frontend) directory, and run:

```bash
npm run dev
```

## Usage

You can open your browser and interact with these URLs:

* Frontend: http://localhost:3000

* Backend, JSON based web API based on OpenAPI: http://localhost/api/

* Automatic interactive documentation with Swagger UI (from the OpenAPI backend): http://localhost/docs

* Alternative automatic documentation with ReDoc (from the OpenAPI backend): http://localhost/redoc

* Traefik UI, to see how the routes are being handled by the proxy: http://localhost:8090

* Database, in Docker, exposes port 5432 and the credentials are in `.env`.

## Backend development

### General workflow

By default, the dependencies are managed with [Poetry](https://python-poetry.org/), go there and install it.

From `./backend/app/` you can install all the dependencies with:

```console
$ poetry install
```

Next, open your editor at `./backend/app/` (instead of the project root: `./`), so that you see an `./app/` directory with your code inside. That way, your editor will be able to find all the imports, etc. Make sure your editor uses the environment you just created with Poetry.

#### Linting

> Linting and code formatting requires `Poetry` setup in `General workflow` to complete before continuing.

From `./backend/app/`:

##### 1. Linting
Linters: [ruff](https://github.com/astral-sh/ruff), [black](https://github.com/psf/black), [isort](https://pycqa.github.io/isort/)

```bash
poetry run sh ./scripts/lint.sh
```

##### 2. Code formatting

Formaters: [black](https://github.com/psf/black), [isort](https://pycqa.github.io/isort/)

```bash
poetry run sh ./scripts/format.sh
```

## Frontend development

* Enter the `frontend` directory, install the NPM packages and start the live server using the `npm` scripts:

```bash
cd frontend
npm install
npm run dev
```

Then open your browser at http://localhost:3000

### Docker Compose Override

During development, you can change Docker Compose settings that will only affect the local development environment, in the file `docker-compose.override.yml`.

The changes to that file only affect the local development environment, not the production environment. So, you can add "temporary" changes that help the development workflow.

### The .env file

The `.env` file is the one that contains all your configurations, generated keys and passwords, etc.