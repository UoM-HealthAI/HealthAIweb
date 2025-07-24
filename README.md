# HealthAI Web Platform

A modular platform for running AI models on health data.

## Quick Start

```bash
git clone <repository-url>
cd HealthAIweb
docker-compose up --build
```

**Access services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Documentation: http://localhost:8001

## Project Structure

```
HealthAIweb/
├── backend/           # FastAPI server
├── frontend/          # React app
├── model_registry/    # AI models
├── docs/              # Documentation
└── docker-compose.yml # Development environment
```

## Technology Stack

- **Backend**: FastAPI + Python
- **Frontend**: React + TypeScript
- **Documentation**: MkDocs
- **Containers**: Docker + Docker Compose

## Development

**Docker-first approach**: All development happens in containers.

```bash
# Start development
docker-compose up --build

# Stop services
docker-compose down
```

## Development Status

- [x] Project structure created
- [x] Docker environment configured
- [x] Basic FastAPI backend
- [x] React frontend setup
- [x] Documentation system
- [x] Git workflow established

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

---

*Built with Docker for consistent development environments.*

