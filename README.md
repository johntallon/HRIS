
# Employee Management System

A full-stack web application for managing employee information, compensation records, and organizational structure.

## Features

- Employee Management (CRUD operations)
- Compensation History Tracking
- Organization Chart Visualization
- Advanced Search and Filtering
- Role-based Access Control
- Site Management
- Job Role Management

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js
- **Database**: SQLite with Drizzle ORM
- **UI Components**: Shadcn/ui
- **State Management**: TanStack Query
- **Routing**: Wouter

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Application pages
├── server/           # Backend Express application
│   ├── services/       # Business logic
│   └── routes.ts       # API endpoints
└── db/              # Database schema and configuration
```

## API Endpoints

- `/api/employees` - Employee management
- `/api/compensation` - Compensation records
- `/api/job-roles` - Job role management
- `/api/sites` - Site management

## Main Features

1. **Employee Management**
   - Create, read, update, and delete employee records
   - Advanced filtering and search capabilities
   - Pagination and sorting

2. **Compensation Tracking**
   - Record employee compensation history
   - View historical compensation data
   - Track changes over time

3. **Organization Chart**
   - Visual representation of company hierarchy
   - Interactive employee cards
   - Dynamic updates

4. **Role Management**
   - Define job roles
   - Assign roles to employees
   - Track role changes
