# Contributing to HealthAI Web Platform

This guide provides essential development guidelines.

## Development Environment

**Principle**: "Use Docker when you develop anything"

### Prerequisites
- Docker & Docker Compose
- Git
- Code editor

### Quick Setup
```bash
git clone <repository-url>
cd HealthAIweb
docker-compose up --build
```

**Access services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Documentation: http://localhost:8001

## Git Workflow

### Branch Strategy
We use **GitHub Flow** with feature branches

### Example
```
demo (main branch)
??? feature/week1-project-setup
??? feature/week2-model-registry
??? hotfix/urgent-fixes
```

### Development Process
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Develop in Docker
docker-compose up --build

# 3. Test and commit
git add .
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/your-feature-name
```

## Project Structure

```
HealthAIweb/
??? backend/           # FastAPI server
??? frontend/          # React app
??? model_registry/    # AI models
??? docs/             # Documentation
```

## Docker Commands

```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down
```

## Week 1 Status ?

- [x] Project structure and Docker setup
- [x] Basic service configuration  
- [x] Documentation framework
- [x] Git workflow established

---

*More guidelines will be added as the project grows.*

