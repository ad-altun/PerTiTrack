## Project Overview

PerTiTrack is a full-stack web application with a React frontend and Spring Boot backend for personal time tracking. The project uses TypeScript, Material-UI, Redux Toolkit Query for state management, and JWT authentication.

## Architecture

**Backend (Spring Boot 3.5.5 + Java 21)**
- Located in `backend/` directory
- Uses Spring Security with JWT authentication
- PostgreSQL database with JPA/Hibernate
- Package structure: `org.pertitrack.backend`
- Key components:
  - Controllers in `controller/` package
  - Entities in `entity/` package  
  - DTOs in `dto/` package
  - Security configuration in `config/` and `security/` packages
  - Repositories in `repository/` package

**Frontend (React 19 + TypeScript + Vite)**
- Located in `frontend/` directory
- Uses Redux Toolkit with RTK Query for API calls
- Material-UI for components
- React Hook Form with Zod validation
- Key structure:
  - Redux store in `src/store/` with API slices and auth slice
  - Service layer in `src/services/`
  - Validation schemas in `src/schemas/`

**Database**
- PostgreSQL (port 5431 in docker-compose)
- H2 for testing

## Development Commands

**Backend (run from `backend/` directory):**
```bash
# Run the application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build
./mvnw clean package

# Run with coverage
./mvnw test jacoco:report
```

**Frontend (run from `frontend/` directory):**
```bash
# Development server (with proxy to backend on :8080)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

**Full Stack Development:**
```bash
# Start database
docker-compose up -d

# Backend runs on :8080, frontend dev server on :5173
# Frontend proxies /api requests to backend
```

## Key Technologies & Dependencies

**Backend:**
- Spring Boot (Web, Security, Data JPA, Validation)
- JWT (io.jsonwebtoken)
- PostgreSQL driver
- Lombok (with custom config in lombok.config)
- JaCoCo for test coverage

**Frontend:**
- React 19 with TypeScript
- Redux Toolkit + RTK Query for state management
- Material-UI (@mui/material) with Emotion styling
- React Hook Form + Zod for form validation
- React Router for navigation
- Axios for HTTP requests (alongside RTK Query)

## Project Configuration

- **Lombok**: Configured with `lombok.config` to add `@Generated` annotations
- **SonarQube**: Integrated for code quality (backend only, frontend disabled)
- **Vite**: Configured to proxy `/api` requests to `localhost:8080`
- **Docker**: PostgreSQL database container setup in docker-compose.yml

## Git Branch Strategy

- Main branch: `main`
- Current development happens on feature branches
- CI/CD configured for backend with SonarQube integration

## Authentication Flow

The application implements JWT-based authentication:
- Backend provides JWT tokens via `/api/auth` endpoints
- Frontend uses RTK Query with auth slice for state management  
- Auth state persisted in Redux store
- API calls include JWT tokens automatically

## Testing

- Backend: JUnit tests with H2 in-memory database
- Test coverage reporting with JaCoCo
- No frontend test setup currently configured
