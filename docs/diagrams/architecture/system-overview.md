
```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Frontend Layer"
        React[React 19.1.1<br/>TypeScript 5.8.3<br/>Vite 7.1.2]
        UI[Material-UI 7.3.2]
        Forms[React Hook Form<br/>+ Zod Validation 4.1.5]
        Router[React Router 7.8.2]
        State[Redux Toolkit 2.8.2]
    end
    
    subgraph "Backend Layer - API Gateway"
        SpringBoot[Spring Boot 3.5.5<br/>Java 21<br/>Maven Build]
        Security[Spring Security<br/>JWT Authentication<br/>15-minute Sessions]
        REST[REST API Controllers<br/>/api/* endpoints]
    end
    
    subgraph "Business Logic Layer"
        Services[Service Layer]
        Auth[Authentication Service<br/>JWT + Role Management]
        Employee[Employee Management]
        TimeTrack[Time Tracking Logic]
        UserRole[Role & Permission Service]
    end
    
    subgraph "Data Access Layer"
        JPA[Spring Data JPA<br/>Repository Pattern]
        Mappers[Entity-DTO Mappers<br/>MapStruct Pattern]
        Validation[Bean Validation<br/>Request/Response DTOs]
    end
    
    subgraph "Database Layer"
        PostgreSQL[(PostgreSQL<br/>Production Database)]
        H2[(H2 In-Memory<br/>Testing Database)]
        Flyway[Flyway Migration<br/>Schema Management]
    end
    
    subgraph "DevOps & Quality"
        Docker[Docker Containerization]
        GitHub[GitHub Actions<br/>CI/CD Pipeline]
        Render[Render.com<br/>Cloud Deployment]
        SonarQube[SonarQube Cloud<br/>Code Quality Analysis]
    end
    
    %% Connections
    Browser --> React
    React --> UI
    React --> Forms
    React --> Router
    React --> State
    
    React -.->|HTTP/HTTPS<br/>JWT Bearer Token| SpringBoot
    SpringBoot --> Security
    SpringBoot --> REST
    REST --> Services
    Services --> Auth
    Services --> Employee
    Services --> TimeTrack
    Services --> UserRole
    
    Services --> JPA
    JPA --> Mappers
    JPA --> Validation
    
    JPA --> PostgreSQL
    JPA --> H2
    Flyway --> PostgreSQL
    
    SpringBoot --> Docker
    Docker --> GitHub
    GitHub --> Render
    SpringBoot --> SonarQube
    
  
    
    class Browser,Mobile,React,UI,Forms,Router,State frontend
    class SpringBoot,Security,REST,Services,Auth,Employee,TimeTrack,UserRole,JPA,Mappers,Validation backend
    class PostgreSQL,H2,Flyway database
    class Docker,GitHub,Render,SonarQube devops
