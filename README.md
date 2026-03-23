# NestJS Prisma Boilerplate API

[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A professional, production-ready NestJS starter kit incorporating Clean Architecture, Prisma ORM, and comprehensive security features. This boilerplate is designed for high scalability and maintainability.

## 🚀 Key Features

- **Architecture**: Domain-Driven Design (DDD) & Clean Architecture.
- **ORM**: Prisma (Multi-schema support).
- **Authentication**: JWT Strategy with Bcrypt password hashing.
- **Validation**: Strict DTO validation using `class-validator` and `class-transformer`.
- **API Documentation**: Automated Swagger (OpenAPI) documentation.
- **Multi-Tenancy**: Built-in tenant-based data isolation.
- **Security**: Environment variable validation (Joi), CORS, and Helmet.
- **Testing**: Unit and E2E testing with Jest.

---

## 🛠 Technology Stack

| Category       | Technology                                                                                |
| :------------- | :---------------------------------------------------------------------------------------- |
| **Framework**  | [NestJS v11+](https://nestjs.com/)                                                        |
| **Language**   | [TypeScript](https://www.typescriptlang.org/)                                             |
| **Database**   | [PostgreSQL](https://www.postgresql.org/)                                                 |
| **ORM**        | [Prisma v7+](https://www.prisma.io/)                                                      |
| **API Docs**   | [Swagger / OpenAPI](https://swagger.io/)                                                  |
| **Validation** | [Joi](https://joi.dev/) & [class-validator](https://github.com/typestack/class-validator) |
| **Testing**    | [Jest](https://jestjs.io/) & [Supertest](https://github.com/visionmedia/supertest)        |

---

## 📂 Project Structure

The project follows a **Clean Architecture** pattern to ensure decoupling and testability:

```text
src/
├── core/                # Core domain and shared infrastructure
│   ├── application/     # Application use-cases and interfaces
│   ├── domain/          # Entities and domain exceptions
│   └── infrastructure/  # Repositories, DB implementations, services
├── common/             # Global decorators, filters, guards, and interceptors
├── config/             # Environment configurations and validation (Joi)
├── modules/            # Feature modules (Auth, User, Tenant, etc.)
│   ├── [feature]/
│   │   ├── controllers/
│   │   ├── dto/
│   │   └── services/
└── main.ts             # Application entry point
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and configure your variables:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   ```

4. **Prisma Setup**:
   Generate Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Seed Database** (Optional):
   ```bash
   npx prisma db seed
   ```

---

## 🏃 Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## 📚 API Documentation

Once the server is running, you can access the Swagger UI:

- **Swagger**: `http://localhost:3000/docs` (Base path)
- **Global Prefix**: `http://localhost:3000/api/v1`

The documentation is automatically generated from the controllers and DTOs using `@nestjs/swagger`.

### Multi-Tenancy

The API supports multi-tenancy. You can provide the `x-tenant-id` header in your requests to filter or isolate data by tenant.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration (E2E) tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🛡 Security & Best Practices

1.  **Strict Typing**: Always use DTOs and interfaces. Avoid `any`.
2.  **Environment Validation**: Managed via `Joi` schema in `src/config`.
3.  **Authentication**: All sensitive routes are protected by JWT Guards.
4.  **Error Handling**: Global Exception Filter for consistent API error responses.
5.  **Prisma Middleware**: Used for soft deletes or logging (if configured).

---

## 📄 License

This project is open-source software licensed under the MIT License.
See the [LICENSE](LICENSE) file for more information.
