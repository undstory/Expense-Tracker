# Testing Guide

This project includes comprehensive tests for both backend and frontend components.

## Backend Tests

The backend uses **pytest** for testing.

### Setup

Install test dependencies (already in requirements.txt):

```bash
pip install -r requirements.txt
```

### Running Backend Tests

**Run all tests:**

```bash
pytest
```

**Run tests with verbose output:**

```bash
pytest -v
```

**Run specific test file:**

```bash
pytest test_schemas.py
pytest test_main.py
```

**Run specific test class:**

```bash
pytest test_schemas.py::TestExpenseCreateSchema
```

**Run specific test:**

```bash
pytest test_schemas.py::TestExpenseCreateSchema::test_valid_expense_creation
```

**Run with coverage report:**

```bash
pytest --cov=. --cov-report=html
```

### Backend Test Files

- **test_schemas.py** - Tests for Pydantic schema validation
  - `TestExpenseCreateSchema` - Validates expense creation schema
  - `TestExpenseSchema` - Tests Expense schema with ID

- **test_main.py** - Tests for FastAPI endpoints
  - `TestGetExpenses` - Tests GET /expenses endpoint
  - `TestCreateExpense` - Tests POST /expenses endpoint
  - `TestDeleteExpense` - Tests DELETE /expenses/{id} endpoint
  - `TestCreateTablesFunction` - Tests database table creation

## Frontend Tests

The frontend uses **Vitest** with React Testing Library.

### Setup

Install test dependencies:

```bash
cd frontend/expense-app
npm install
```

### Running Frontend Tests

**Run all tests:**

```bash
npm test
```

**Run tests in watch mode:**

```bash
npm test -- --watch
```

**Run tests with UI:**

```bash
npm run test:ui
```

**Run specific test file:**

```bash
npm test -- utils.test.ts
npm test -- ExpensesView.test.tsx
```

**Run with coverage:**

```bash
npm run test:coverage
```

### Frontend Test Files

- **src/utils/utils.test.ts** - Tests for utility functions
  - `parsedDate` - Tests date parsing utility
  - `sanity` - Tests string sanitization utility
  - `capitalizeFirstLetter` - Tests capitalization utility

- **src/Expenses/ExpensesView.test.tsx** - Tests for ExpensesView component
  - Tests rendering with empty data
  - Tests filtering by category
  - Tests searching by title and date
  - Tests sorting functionality

- **src/ExpensesTable/ExpensesTable.test.tsx** - Tests for ExpensesTable component
  - Tests table rendering with headers
  - Tests data formatting (amounts, dates, capitalization)
  - Tests delete button functionality
  - Tests handling empty data

- **src/FilterSection/FilterSection.test.tsx** - Tests for FilterSection component
  - Tests filter controls rendering
  - Tests category filtering
  - Tests sorting options
  - Tests search functionality
  - Tests filter cleanup

## Test Coverage

### Backend Test Coverage

- Schema validation (100%)
- API endpoints (mocked database interactions)
- Error handling

### Frontend Test Coverage

- Utility functions (100%)
- Component rendering (ExpensesView, ExpensesTable, FilterSection)
- User interactions (clicks, selections, typing)
- Data filtering and sorting
- Form submissions

## Running All Tests

From the root directory:

**Backend tests:**

```bash
cd backend && pytest
```

**Frontend tests:**

```bash
cd frontend/expense-app && npm test
```

## Notes

- Backend tests use mocking to avoid requiring a live database connection
- Frontend tests use jsdom for DOM simulation and React Testing Library for component testing
- All tests follow testing best practices with clear descriptions and isolated test cases
- Tests are organized by component/module for easy navigation
