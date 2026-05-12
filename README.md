# Expense Tracker

[![CI Pipeline](https://github.com/undstory/Expense-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/undstory/Expense-Tracker/actions/workflows/ci.yml)

Simple full-stack expense tracking app

**LIVE DEMO:** https://expense-tracker-kappa-black-65.vercel.app

IMPORTANT NOTE: The backend is hosted on a free Render instance. It may take up to 2 minutes to load the initial data after a period of inactivity.

## Tech stack

- **FRONTEND:** React + Vite + TypeScript + SCSS
- **BACKEND:** FastAPI (Python) + Pydantic
- **DATABASE:** SQLite (file-based, no setup required, MySQL eqrlier)
- **TESTING:** pytest (backend) + Vitest (frontend)
- **CI/CD & DevOps:** GitHub Actions

## Features

- Modern dark color scheme with high contrast and accessibility
- Add daily expenses
- Delete expense
- Client-side form validation:
  - required fields
  - positive amount validation
  - no future dates allowed
  - title validation (letters only)
- BE-side validation:
  - request body validation with Pydantic
  - business rules validation (e.g. expense date must be later than year 2000)
  - HTTP 422 responses for invalid data (title and category min length, positive amount only)
- Combined filtering (category + title + date)
- Client-side sorting with memoized data processing
- Reset active filters
- Success and error feedback alert
- Basic Api Errors handling
- Tests

## Planned

- Pagination

## Testing

- **Continuous Integration (CI):** Fully automated testing pipeline using GitHub Actions. Both backend (`pytest`) and frontend (`vitest`) test suites are triggered automatically on every push and pull request to the `master` branch, ensuring continuous code quality.

### Backend tests

- Added comprehensive pytest coverage for FastAPI endpoints and database functions with SQLite mocking
- Tests cover all CRUD operations (Create, Read, Delete) with proper mocking of sqlite3 connections
- Includes integration tests combining multiple operations and error handling tests
- Run:

```bash
cd backend
pytest -v
```

### Frontend tests

- Added Vitest coverage for utility functions and React components
- `frontend/expense-app/vitest.config.ts` was updated for ES module support and to avoid plugin typing conflicts
- Run:

```bash
cd frontend/expense-app
npm install
npm test -- --run
```

📖 **Detailed Testing Guide:** See [TESTING.md](TESTING.md) for comprehensive testing instructions, coverage details, and advanced testing options.

## AI-Assisted Development (GitHub Copilot)

This project was developed with the active assistance of **GitHub Copilot** to speed up development and focus on architecture and business logic:

- **Frontend Development (React/TypeScript):** Copilot was utilized to generate boilerplate code for React components, write complex TypeScript interfaces, and assist in creating optimized data processing functions (like memoized sorting and combined filtering).
- **Automated Testing (Vitest & Pytest):** AI assistant significantly accelerated the testing phase. Copilot helped generate comprehensive test cases and edge cases for backend schema validation (FastAPI/Pydantic) as well as unit tests for frontend utility functions and React components.

## API Documentation

Interactive API documentation is available at: [Swagger UI](https://expense-tracker-it7x.onrender.com/docs)

## API Endpoints

```md
| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | /expenses      | fetch all expenses   |
| POST   | /expenses      | add new expense      |
| DELETE | /expenses/{id} | delete expense by id |
```

## How to run locally

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Backend setup**

   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --port 8000
   ```

3. **Frontend setup** (in a new terminal)

   ```bash
   cd frontend/expense-app
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
