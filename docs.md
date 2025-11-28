# f0rward Documentation

1. [Endpoints](#endpoints)
2. [Dependencies](#dependencies)
3. [Source Code](#source-code)
4. [Enviroment Variables (.env)](#environment-variables)
5. [Typescript](#typescript)

# Endpoints

### POST /login

#### Authentication API endpoints

Authenticates a user with email and password credentials

**Request Body:**

```json
{
  "email": "string", // User's email address
  "password": "string" // User's password
}
```

**Response:**

```json
{
  "token": "string", // JWT authentication token
  "user": "object" // User profile information
}
```

**Errors:**

- `401` - Invalid credentials
- `400` - Missing required fields

---

### POST /register

Creates a new user account

**Request Body:**

```json
{
  "email": "string", // User's email address
  "password": "string", // User's password
  "name": "string" // User's full name (optional)
}
```

**Response:**

```json
{
  "token": "string", // JWT authentication token
  "user": "object" // Newly created user profile
}
```

**Errors:**

- `409` - Email already exists
- `400` - Invalid input data

---

### GET /user

Retrieves the authenticated user's profile information

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "user": "object" // User profile information
}
```

**Errors:**

- `401` - Unauthorized - Invalid or missing token
- `404` - User not found

# Dependencies

## Core Dependencies

- **express** - Web application framework for handling HTTP requests and routing
- **typescript** - Adds static typing to JavaScript for improved code quality
- **prisma** - Modern ORM for database operations and schema management
- **bcrypt** - Password hashing and encryption library
- **jsonwebtoken** - JWT token generation and verification for authentication
- **zod** - TypeScript-first schema validation library
- **dotenv** - Environment variable management from .env files
- **express-rate-limit** - API rate limiting middleware
- **winston** - Logging library for application logs
- **cors** - Cross-Origin Resource Sharing middleware

## Development Dependencies

- **@types/node** - TypeScript type definitions for Node.js
- **@types/express** - TypeScript type definitions for Express
- **@types/bcrypt** - TypeScript type definitions for bcrypt
- **@types/jsonwebtoken** - TypeScript type definitions for JWT
- **ts-node** - TypeScript execution environment for Node.js
- **nodemon** - Development server with auto-restart on file changes
- **eslint** - Code linting and style enforcement
- **prettier** - Code formatting tool

# Source Code

# Backend Source Documentation

## Overview

This document provides detailed documentation for the backend application structure, organized in a modular architecture pattern.

## Directory Structure

### Root Files

#### `app.ts`

Main application file that initializes the Express application, configures middleware, and sets up routes.

#### `server.ts`

Entry point that starts the HTTP server and handles server lifecycle events.

---

## `/config`

Configuration files for application-wide settings.

### `db.ts`

Database configuration and connection management:

- Database connection initialization
- Connection pool settings
- Database connection error handling
- Connection lifecycle management

### `env.ts`

Environment variables configuration:

- Environment variable validation
- Type-safe environment variable exports
- Default values for missing variables
- Environment-specific configurations

---

## `/middleware`

Express middleware functions for cross-cutting concerns.

### `authGuard.ts`

Authentication middleware:

- JWT token validation
- User authentication verification
- Protected route access control
- Token refresh logic

### `errorHandler.ts`

Global error handling middleware:

- Centralized error processing
- Error response formatting
- Error logging
- HTTP status code mapping

### `limiter.ts`

Rate limiting middleware:

- API request rate limiting
- IP-based throttling
- Configurable rate limit rules
- Rate limit exceeded responses

### `requestLogger.ts`

HTTP request logging middleware:

- Request/response logging
- Performance metrics tracking
- Request ID generation
- Audit trail creation

---

## `/modules`

Feature-based modules following a layered architecture pattern.

### `/modules/auth`

Authentication and authorization module.

#### `auth.controller.ts`

Authentication HTTP request handlers:

- Login endpoint handler
- Registration endpoint handler
- Token refresh handler
- Logout handler
- Password reset handlers

#### `auth.model.ts`

Authentication data models and types:

- Authentication request/response DTOs
- Token payload interfaces
- Session data structures
- Authentication-related type definitions

#### `auth.repository.ts`

Authentication data access layer:

- User credential queries
- Session management data operations
- Refresh token storage/retrieval
- Authentication audit logging

#### `auth.routes.ts`

Authentication route definitions:

- Route path mappings
- HTTP method bindings
- Middleware application per route
- Route documentation

#### `auth.service.ts`

Authentication business logic:

- User authentication logic
- Token generation and validation
- Password hashing and verification
- Session management
- OAuth integration (if applicable)

#### `auth.utils.ts`

Authentication utility functions:

- Token generation helpers
- Password strength validation
- Authentication helper functions
- Cryptographic utilities

---

### `/modules/users`

User management module.

#### `user.controller.ts`

User HTTP request handlers:

- Get user profile handler
- Update user profile handler
- Delete user handler
- List users handler (admin)
- User search handlers

#### `user.model.ts`

User data models and types:

- User entity interface
- User DTO definitions
- User query parameters
- User-related type definitions

#### `user.repository.ts`

User data access layer:

- User CRUD operations
- User query methods
- User search and filtering
- User relationship queries
- Database transaction handling

#### `user.routes.ts`

User route definitions:

- User endpoint mappings
- Route-level middleware
- Access control per route
- API versioning

#### `user.service.ts`

User business logic:

- User creation and validation
- User profile management
- User permissions handling
- User data transformation
- Business rule enforcement

#### `user.utils.ts`

User utility functions:

- User data sanitization
- User validation helpers
- User formatting utilities
- User-related helper functions

---

## `/utils`

Shared utility functions and helpers.

### `errors.ts`

Custom error classes and error utilities:

- Custom error class definitions
- Error code constants
- Error factory functions
- Error type guards

### `logs.ts`

Logging utilities:

- Logger configuration
- Log level management
- Structured logging helpers
- Log formatting utilities

### `validate.ts`

Validation utilities:

- Schema validation functions
- Input sanitization
- Data validation helpers
- Validation error formatting

---

## Architecture Patterns

### Layered Architecture

Each module follows a layered architecture:

1. **Routes Layer**: HTTP endpoint definitions
2. **Controller Layer**: Request/response handling
3. **Service Layer**: Business logic
4. **Repository Layer**: Data access
5. **Model Layer**: Data structures and types
6. **Utils Layer**: Helper functions

### Separation of Concerns

- Clear separation between layers
- Single responsibility per file
- Dependency injection ready
- Testability focused

### Module Organization

- Feature-based module structure
- Self-contained modules
- Clear module boundaries
- Reusable utilities

# Environment Variables

## Required Variables

### `DATABASE_URL`

- **Type:** `string`
- **Description:** PostgreSQL database connection string
- **Example:** `postgresql://user:password@localhost:5432/dbname`

### `JWT_SECRET`

- **Type:** `string`
- **Description:** Secret key for JWT token signing
- **Example:** `your-secret-key-here`

### `PORT`

- **Type:** `number`
- **Description:** Server port number
- **Default:** `3000`

### `NODE_ENV`

- **Type:** `string`
- **Description:** Application environment
- **Values:** `development` | `production` | `test`
- **Default:** `development`

## Optional Variables

### `JWT_EXPIRES_IN`

- **Type:** `string`
- **Description:** JWT token expiration time
- **Default:** `7d`
- **Example:** `1h`, `7d`, `30d`

### `BCRYPT_ROUNDS`

- **Type:** `number`
- **Description:** Number of bcrypt hashing rounds
- **Default:** `10`

### `RATE_LIMIT_WINDOW_MS`

- **Type:** `number`
- **Description:** Rate limit time window in milliseconds
- **Default:** `900000` (15 minutes)

### `RATE_LIMIT_MAX_REQUESTS`

- **Type:** `number`
- **Description:** Maximum requests per time window
- **Default:** `100`

# Typescript

## TypeScript Configuration

### `tsconfig.json`

The TypeScript compiler configuration for the backend application.

**Key Compiler Options:**

- **target**: ES2020 - Modern JavaScript features
- **module**: commonjs - Node.js module system
- **lib**: ES2020 - Standard library features
- **outDir**: ./dist - Compiled output directory
- **rootDir**: ./src - Source code directory
- **strict**: true - Strict type checking enabled
- **esModuleInterop**: true - CommonJS/ES module compatibility
- **skipLibCheck**: true - Skip type checking of declaration files
- **forceConsistentCasingInFileNames**: true - Enforce consistent file naming

### Type Declarations

#### `/types/express.d.ts`

Custom type declarations extending Express Request interface.

**Request Interface Extension:**

Adds custom properties to Express Request object for authenticated requests:

```typescript
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      // Additional user properties from JWT payload
    };
  }
}
```

This allows TypeScript to recognize the `user` property added by authentication middleware, providing type safety when accessing authenticated user data in route handlers.
