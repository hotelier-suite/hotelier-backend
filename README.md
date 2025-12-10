# 🏨 Hotelier Backend - Enterprise Hotel Management System API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A production-ready, enterprise-grade **RESTful API** for comprehensive hotel management operations, built with **NestJS** and **TypeScript**. This backend powers a full-featured hotel management platform with **28 integrated modules** covering every aspect of hotel operations.

🌐 **Live Application:** [https://hotelier-suite.vercel.app](https://hotelier-suite.vercel.app)  
🖥️ **Frontend Repository:** [https://github.com/Nick220505/hotelier-frontend](https://github.com/Nick220505/hotelier-frontend)  
🚀 **Deployment:** Hosted on [Koyeb](https://www.koyeb.com) with [Neon PostgreSQL](https://neon.tech)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Modules](#-modules)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database](#-database)
- [Authentication & Security](#-authentication--security)
- [Deployment](#-deployment)

---

## ✨ Features

### Core Operations
- **Reservations Management** - Real-time room inventory tracking, booking workflows, and availability management
- **Guest Management** - Comprehensive guest profiles, service requests, and preferences tracking
- **Employee Administration** - Staff management with shift scheduling, attendance tracking, and performance monitoring
- **Housekeeping Automation** - Task assignment, room status tracking, and cleaning workflows
- **Maintenance Management** - Work order system with priority levels and completion tracking
- **Restaurant Services** - Menu management, orders, table reservations, and kitchen operations
- **Event Management** - Venue bookings, event planning, catering coordination
- **Recreational Facilities** - Spa, gym, pool, and activity bookings
- **Parking Management** - Vehicle tracking, space allocation, and access control

### Business Intelligence
- **Dashboard Analytics** - Real-time KPIs (occupancy rates, revenue, reservations)
- **Advanced Reporting** - Comprehensive reports with data visualization and export capabilities
- **Financial Tracking** - Revenue analysis, billing, invoicing, and payment processing
- **Audit Logging** - Complete system activity tracking for compliance and security
- **Performance Metrics** - Monthly comparisons, profit tracking, and trend analysis

### Enterprise Features
- **Role-Based Access Control (RBAC)** - Granular permissions for different user roles
- **Secure Authentication** - User authentication and authorization system
- **Automated Database Seeding** - Development data generation for testing
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Multi-Stage Docker Builds** - Optimized containerization for production deployment
- **Type-Safe Architecture** - Full TypeScript implementation with strict typing
- **Audit Logging** - Comprehensive activity tracking with interceptors

---

## 🏗️ Architecture

This application follows **modular architecture** principles with clear separation of concerns:

```
src/
├── auth/                # Authentication & authorization
├── users/               # User management
├── roles/               # Role-based access control
├── reservations/        # Booking system
├── rooms/               # Room inventory
├── guests/              # Guest management
├── employees/           # Staff administration
├── shifts/              # Shift scheduling
├── attendance/          # Attendance tracking
├── housekeeping/        # Cleaning operations
├── maintenance/         # Maintenance workflow
├── restaurant/          # Restaurant services
├── events/              # Event management
├── recreational/        # Recreational facilities
├── parking/             # Parking management
├── billing/             # Financial operations
├── reports/             # Analytics & reporting
├── reports-analytics/   # Advanced analytics
├── guest-requests/      # Guest service requests
├── employee-requests/   # Employee requests
├── inventory/           # Inventory management
├── venues/              # Venue management
├── notifications/       # Notification system
├── currency/            # Currency management
├── audit/               # Audit logging
├── configuration/       # System configuration
├── dashboard/           # Dashboard data
└── database/            # Database configuration
```

Each module is self-contained with:
- **Controllers** - REST endpoint definitions
- **Services** - Business logic implementation
- **Entities** - TypeORM database models
- **DTOs** - Data transfer objects with validation
- **Guards** - Authorization and authentication

---

## 🛠️ Tech Stack

### Core Framework
- **NestJS 11** - Progressive Node.js framework with modular architecture
- **TypeScript 5** - Type-safe development with latest ES features
- **Node.js** - JavaScript runtime environment

### Database & ORM
- **PostgreSQL** - Robust relational database
- **TypeORM 0.3** - Advanced ORM with migration support
- **Database Migrations** - Version-controlled schema management

### Authentication & Security
- **Passport** - Authentication middleware
- **Bcrypt** - Password hashing
- **Class Validator** - Request validation
- **Class Transformer** - Data transformation

### Documentation & Testing
- **Swagger/OpenAPI** - Interactive API documentation
- **Jest** - Testing framework
- **Supertest** - API endpoint testing

### DevOps & Deployment
- **Docker** - Containerization with multi-stage builds
- **Koyeb** - Production deployment platform
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **ESLint & Prettier** - Code quality and formatting

---

## 📦 Modules

The application consists of **28 integrated modules**, each handling specific hotel operations:

| Module | Description | Key Features |
|--------|-------------|--------------|
| **Authentication** | User authentication & authorization | Secure login, role guards, session management |
| **Users** | User account management | Profile management, password reset, user roles |
| **Roles** | Role-based access control | Dynamic permissions, role hierarchy, access management |
| **Reservations** | Booking system | Real-time availability, booking workflow, cancellations |
| **Rooms** | Room inventory management | Room types, status tracking, pricing, availability |
| **Guests** | Guest management | Guest profiles, preferences, history, contact info |
| **Employees** | Staff administration | Employee records, positions, departments, contacts |
| **Shifts** | Shift scheduling | Shift patterns, assignments, coverage, schedules |
| **Attendance** | Attendance tracking | Clock in/out, overtime, reports, time management |
| **Housekeeping** | Cleaning operations | Task assignment, room status, inspection, schedules |
| **Maintenance** | Maintenance workflow | Work orders, priority levels, completion, tracking |
| **Restaurant** | Restaurant services | Menu, orders, tables, kitchen operations, reservations |
| **Events** | Event management | Venue bookings, event planning, catering, coordination |
| **Recreational** | Recreational facilities | Spa, gym, pool bookings, activities, schedules |
| **Parking** | Parking management | Vehicle tracking, space allocation, entry/exit |
| **Billing** | Financial operations | Invoicing, payments, pricing, charges |
| **Reports** | Analytics & reporting | KPIs, data visualization, exports, summaries |
| **Reports Analytics** | Advanced analytics | Detailed reports, trends, forecasting, insights |
| **Guest Requests** | Guest service requests | Request tracking, status management, fulfillment |
| **Employee Requests** | Employee requests | Leave requests, time off, approval workflows |
| **Inventory** | Inventory management | Stock tracking, supplies, orders, restocking |
| **Venues** | Venue management | Venue details, capacity, bookings, availability |
| **Notifications** | Notification system | Alerts, reminders, system notifications, messages |
| **Currency** | Currency management | Multi-currency support, exchange rates, conversions |
| **Audit** | Audit logging | Activity tracking, audit trails, compliance, history |
| **Configuration** | System configuration | Settings, preferences, customization, system options |
| **Dashboard** | Dashboard data | KPIs, statistics, real-time data, overview |
| **Database** | Database configuration | Connection management, migrations, database setup |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nick220505/hotelier-backend.git
cd hotelier-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory based on `.env.example`:

```env
# Application Configuration
NODE_ENV=development
PORT=3001

# PostgreSQL Database
DATABASE_URL="postgresql://hotelier_user:hotelier_password@localhost:5432/hotelier_db?schema=public"

# JWT Secret (change in production)
JWT_SECRET="hotelier_jwt_secret_key_2024_change_this_in_production"

# Authentication Settings
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Frontend URLs
FRONTEND_URL="http://localhost:3000"

# Email Configuration (optional)
EMAIL_HOST=""
EMAIL_PORT=587
EMAIL_USER=""
EMAIL_PASSWORD=""
EMAIL_FROM=""

# Upload Settings
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH="./uploads"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""

# Logging Settings
LOG_LEVEL="debug"
LOG_FILE="logs/app.log"
```

4. **Seed Database (Optional)**

Populate the database with sample data for development:
```bash
npm run seed
```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

### Using Docker (Standalone)

```bash
# Build the image
docker build -t hotelier-backend .

# Run the container with local .env
docker run -p 3001:3001 --env-file .env hotelier-backend
```

### Using Hotelier Infra (Docker Compose)

For running the **full Hotelier platform** (database, backend, frontend, and
future microservices) with Docker, use the dedicated infra repository:

- [`hotelier-infra`](https://github.com/hotelier-suite/hotelier-infra)

That repository contains the canonical Docker Compose configuration and the
step-by-step onboarding guide for spinning up the complete stack.

---

## 📚 API Documentation

Interactive API documentation is available via **Swagger/OpenAPI** when the application is running.

**Access the documentation at:** `http://localhost:3000/api/docs`

### Key Features:
- ✅ Interactive API explorer
- ✅ Request/response schemas
- ✅ Authentication testing
- ✅ Example requests and responses
- ✅ Comprehensive endpoint descriptions

### Authentication

Most endpoints require authentication. To authenticate:
1. **Register** a new user: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. Use the authentication session in subsequent requests

---

## 🗄️ Database

### Schema Design

The database follows a **normalized relational design** with:
- Clear entity relationships
- Foreign key constraints
- Indexing for performance
- Audit fields (createdAt, updatedAt)

### Key Entities

- **Users** - System users with authentication
- **Roles** - User roles and permissions
- **Reservations** - Booking records
- **Rooms** - Hotel room inventory
- **Guests** - Guest profiles
- **Employees** - Staff records
- **Shifts** - Work schedules
- **Attendance** - Time tracking
- **Reports** - Analytics data
- **Venues** - Event venues
- **Notifications** - System notifications
- **Currency** - Currency configurations
- **Audit Logs** - System activity logs

---

## 🔐 Authentication & Security

### Security Features

- ✅ **Secure Authentication** - Passport-based authentication
- ✅ **Password Hashing** - Bcrypt with salt rounds for password security
- ✅ **Role-Based Access Control (RBAC)** - Granular permissions
- ✅ **Request Validation** - Input validation with class-validator
- ✅ **SQL Injection Prevention** - Parameterized queries via TypeORM
- ✅ **CORS Configuration** - Cross-origin resource sharing controls
- ✅ **Audit Logging** - Comprehensive activity tracking with interceptors

### Roles & Permissions

The system supports multiple roles with different access levels:
- **Super Admin** - Full system access
- **Manager** - Operations management
- **Receptionist** - Front desk operations
- **Housekeeper** - Housekeeping tasks
- **Maintenance** - Maintenance operations
- **Employee** - Basic employee access

---

## 🚀 Deployment

### Production Deployment (Koyeb)

This application is deployed on **Koyeb** with **Neon PostgreSQL**.

#### Deployment Steps:

1. **Build the Docker image**
```bash
docker build -f Dockerfile.prod -t hotelier-backend:prod .
```

2. **Push to container registry** (Docker Hub, GitHub Container Registry, etc.)

3. **Deploy to Koyeb**
   - Connect your Git repository
   - Set environment variables
   - Configure build settings
   - Deploy!

#### Environment Variables (Production)

Required environment variables for production:
- `NODE_ENV` - Environment (production)
- `PORT` - API port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `JWT_SECRET` - JWT signing secret (strong secret key)
- `JWT_EXPIRES_IN` - JWT expiration time
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration time
- `FRONTEND_URL` - Frontend application URL

Optional environment variables:
- `REDIS_URL` - Redis connection string
- `REDIS_PASSWORD` - Redis password
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_FROM` - Default sender email
- `UPLOAD_MAX_SIZE` - Maximum upload size in bytes
- `UPLOAD_PATH` - Path for uploaded files
- `LOG_LEVEL` - Logging level (info, debug, error)
- `LOG_FILE` - Log file path

### Docker Production Build

The `Dockerfile.prod` includes:
- Multi-stage build for optimization
- Non-root user for security
- Health checks
- Automated database seeding on first run
- Production-optimized Node.js configuration

---

## 📊 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov

# Watch mode
npm run test:watch
```

---

## 🤝 Contributing

This is a portfolio project showcasing full-stack development skills with enterprise-level architecture and best practices.

---

## 📄 License

This project is private and for portfolio demonstration purposes.

---

## 👨‍💻 Developer

**Juan Nicolas Pardo Torres**

- LinkedIn: [nicolas-pardo-6156a1222](https://linkedin.com/in/nicolas-pardo-6156a1222)
- GitHub: [@Nick220505](https://github.com/Nick220505)
- Email: juannicolaspardo@gmail.com

---

## 🔗 Related Repositories

- **Frontend Application:** [hotelier-frontend](https://github.com/Nick220505/hotelier-frontend)
- **Live Demo:** [https://hotelier-suite.vercel.app](https://hotelier-suite.vercel.app)

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**
