![Node.js](https://img.shields.io/badge/node.js-runtime-339933)
![Express](https://img.shields.io/badge/express-framework-000000)
![PostgreSQL](https://img.shields.io/badge/postgresql-db-316192)
![JWT](https://img.shields.io/badge/jsonwebtoken-auth-000000)
![bcrypt](https://img.shields.io/badge/bcrypt-hashing-orange)
![CORS](https://img.shields.io/badge/cors-middleware-blue)
![morgan](https://img.shields.io/badge/morgan-logging-lightgrey)
![rate_limit](https://img.shields.io/badge/express--rate--limit-security-red)
![pg](https://img.shields.io/badge/pg-driver-336791)
![speedtest-net](https://img.shields.io/badge/speedtest--net-api-4B8BBE)
![Types](https://img.shields.io/badge/@types-TypeScript%20defs-3178C6)

## Table of Contents

- [About](#about)
- [Build](#build)
- [Documentation](#documentation)
- [License](#license)

## About

A Node.js REST API backend powering the f0rward web application. Built with Express, PostgreSQL, and JWT authentication.

## Build

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone git@github.com:onyxdream/forward-back.git
cd forward-back
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

## Documentation

For detailed API documentation and usage guides, see the [DOCUMENTATION](docs.md).

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
