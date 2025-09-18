# HealthAI Web Platform

A full-stack web platform to run AI models on health data. Backend is FastAPI (Python), frontend is React + TypeScript. Supports uploading data, executing registered models, and viewing/download results.

## Quick Start (Docker Compose)

```bash
# From repo root
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

The backend serves outputs under `/outputs/*` so the frontend can download generated files.

## Project Structure

```
HealthAIweb/
├── backend/            # FastAPI app (APIs, model execution, file validation)
├── frontend/           # React app (UI: upload, models, results)
├── model_registry/     # Pluggable models (each with config.yaml, model.py, docs)
├── docker-compose.yml  # Dev setup for backend + frontend (+ demo)
└── docs/, scripts/, ...
```

## Backend (FastAPI)

- Entry: `backend/main.py`
- Run (local Python):
  ```bash
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```
- Key directories auto-created: `uploads/`, `outputs/`
- CORS: allow origins via `ALLOWED_ORIGINS` env (defaults to `http://localhost:3000`)

### API Endpoints

- `GET /health` → basic health
- `GET /api/health` → API health
- `GET /api/debug/outputs` → list files under `outputs/`
- `GET /api/models` → discover available models (from `model_registry/`)
- `GET /api/models/{model_id}/documentation` → returns model documentation (from `documentation.json` or config)
- `POST /api/predict/{model_id}` → upload file and run model
  - form fields: `file` (required), `parameters` (JSON string, optional)
  - returns `{ task_id, status, message, validation, results? }`
- `GET /api/tasks/{task_id}` → task metadata and results
- `GET /api/tasks` → list recent tasks

### Upload constraints

- Max file size: 500 MB
- Supported extensions: `.csv`, `.h5ad`, `.jpg`, `.jpeg`, `.png`

Validation previews CSV headers, basic H5AD signature, and image dimensions. See `backend/services/file_handler.py`.

### Model execution

- Global executor scans `model_registry/` and loads models dynamically.
- Standard result schema enforced by `backend/core/model_interface.py`:
  ```json
  {
    "status": "success" | "failed",
    "visualizations": { "name": "/outputs/...png" },
    "data_files": { "name": "/outputs/...csv" },
    "metadata": { ... }
  }
  ```
- Results are saved per-task under `outputs/{task_id}/` and exposed from API with web paths.

## Frontend (React + TypeScript)

- Dev run (outside Docker):
  ```bash
  cd frontend
  npm install
  npm start
  ```
- Build for production:
  ```bash
  npm run build
  ```
- In Docker, dev server runs on port 3000 with polling enabled.
- The UI provides:
  - Models page: lists `/api/models`, fetches per-model docs
  - Upload page: selects model, validates file type, posts to `/api/predict/{model}`
  - Results page: polls `/api/tasks/{taskId}`, downloads from `/outputs/*`

Note: `frontend/package.json` defines a Docker dev `proxy` to `http://backend:8000` and the app uses relative paths like `/api/...` and `/outputs/...` in the browser.

## Model Registry

Each model lives under `model_registry/{model_id}/` and typically includes:
- `config.yaml`: metadata, parameters, interface `main_function`
- `model.py`: implements the callable (default `run_model`)
- `documentation.json` (optional): rich docs served to the UI

To add a new model:
1. Create `model_registry/your_model/` with `config.yaml` and `model.py`.
2. Ensure the main function matches `interface.main_function` (default `run_model`).
3. Return the standard result schema from your function.
4. Optionally add `documentation.json` for richer docs in the UI.

## Running the demo (optional)

`docker-compose.yml` includes a `demo` service using `Dockerfile.demo` and `demo.py` (port 7862). Start alongside backend/frontend with the same command:
```bash
docker-compose up --build
```

## Environment variables

- Backend:
  - `ALLOWED_ORIGINS` (comma-separated), defaults to `http://localhost:3000`
  - `PORT` (default 8000)
- Frontend:
  - In Docker: proxy to `backend:8000`; in local dev, ensure backend runs on `http://localhost:8000`

## Development tips

- Outputs: files saved under `backend/outputs/{task_id}/` are served at `/outputs/{task_id}/...`
- If frontend build exists (`frontend/build`), backend serves it for production routing.
- Use `GET /api/debug/outputs` to quickly verify saved result files.

## License

This repository is for educational and internal use during the internship. Update with a proper license if publishing.

