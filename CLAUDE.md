# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ackee is a self-hosted, Node.js based analytics tool focused on privacy. It provides web analytics without tracking individual users, using MongoDB as the database and serving both a GraphQL API and a React-based web interface.

## Architecture

- **Backend**: Node.js with micro framework for HTTP server
- **Database**: MongoDB with Mongoose ODM
- **API**: GraphQL with Apollo Server
- **Frontend**: React with custom build system (not webpack/vite)
- **Build System**: Custom build script in `build.js` using Rosid handlers

### Key Directories

- `src/` - Main application code
  - `aggregations/` - Data aggregation logic for analytics
  - `database/` - Database interaction layers
  - `models/` - Mongoose models (Action, Domain, Event, etc.)
  - `resolvers/` - GraphQL resolvers
  - `types/` - GraphQL type definitions
  - `utils/` - Utility functions and configuration
  - `ui/` - Frontend React application and styles
- `test/` - Test files mirroring src structure
- `docs/` - Documentation files
- `functions/` - Serverless function handlers

### Data Flow

1. Analytics data comes in through GraphQL mutations
2. Data is processed and stored in MongoDB via Mongoose models
3. Statistics are calculated by aggregation functions
4. UI queries data through GraphQL API and displays analytics

## Development Commands

**Important**: This project uses **Yarn** as the package manager (not npm). All commands should be run with yarn.

**Note**: The development server is managed by the user. Do not start or stop the server automatically.

```bash
# Start development server with auto-reload
yarn start:dev

# Build the application
yarn build

# Build for pre-production (different from dev)
yarn build:pre

# Start production server
yarn start
# or
yarn server

# Run tests with coverage
yarn test

# Run linting
yarn lint

# Generate coverage report
yarn coveralls
```

## Testing

- Uses **AVA** as test runner with nyc for coverage
- Tests are in `test/` directory mirroring `src/` structure
- Run single test: `npx ava test/path/to/test.js`
- Test timeout: 20 seconds
- Uses `mongodb-memory-server` for test database

## Configuration

- Uses environment variables with `.env` file support
- Key config in `src/utils/config.js`
- MongoDB connection required via `ACKEE_MONGO` or similar env var
- Supports development, demo, and production modes

## GraphQL API

- Main endpoint: `/api`
- Playground available in development
- Authentication via tokens (permanent and temporary)
- Resolvers handle domains, events, records, and statistics

## Build System

- Custom build in `build.js` using Rosid handlers
- Builds to `dist/` directory
- Handles CSS (SCSS), JS (React), and HTML
- Custom tracker.js for analytics collection
- Pre-build mode for static assets

## Key Files

- `src/index.js` - Application entry point
- `src/server.js` - HTTP server setup with routes
- `src/utils/config.js` - Configuration management
- `src/utils/connect.js` - Database connection
- `build.js` - Custom build system

## Commit Guidelines

**IMPORTANT**: Do not add Claude Code signatures, promotional content, or Anthropic branding to commit messages. Keep all commit messages clean and professional without any tool attribution or marketing content.