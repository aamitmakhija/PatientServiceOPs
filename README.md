# Patient Information System

A microservices-based Patient Information System built using Node.js, MongoDB, Docker, and GitHub Actions. The system is designed for tertiary care hospitals to manage patient records, admissions, diagnostics, and treatments with role-based access.

---

## 📁 Project Structure

- **auth-service**: Handles authentication and role-based access (JWT).
- **patient-service**: Manages patient registration and updates.
- **admission-service**: Handles ward assignments and patient admissions.
- **ward-service**: Tracks ward availability and occupancy.
- **api-gateway**: Central entry point for routing requests to services.
- **test/**: Centralized testing for all services.

---

## 🚀 Features

- JWT-based authentication
- Role-based access control (Admin, Clerk, Doctor, Nurse, Pathologist)
- Patient registration and ward assignment
- Diagnostic and radiology integration
- CI/CD pipeline with GitHub Actions
- Containerized deployment with Docker & Docker Compose
- Automated testing and health monitoring

---

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB
- Docker & Docker Compose
- Git

### Install Dependencies

```bash
npm install
