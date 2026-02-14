# Expense Tracker

Simple full-stack expense tracking app

![main view of expense tracking app](image.png)

![view of modal](image-1.png)

## Tech stack

- FRONTEND: React + Vite + TypeScript
- BACKEND: FastAPI (Python)
- Database: MySQL

## Features

- List all expenses
- Add daily expenses
- Delete expense
- Client-side form validation:
  - required fields
  - positive amount validation
  - no future dates allowed
  - title validation (letters only)
- Combined filtering (category + title + date)
- Client-side sorting with memoized data processing
- Reset active filters
- ...

- Planned:
  - Edit expense
  - Pagination
  - Success feedback alert
  - Tests
  - BE-side validation
  - Api Errors handling

# API Documentation

Interactive API documentation is available at: http://localhost:8000/docs (Swagger UI)

# API Endpoints

GET /expenses - fetch all expenses
POST /expenses - add new expense
DELETE /expenses/{id} - delete expense by id

# How to run locally

1. Clone repository

2. Backend setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

3. Frontend setup

```bash
cd frontend/expense-app
npm install
npm run dev
```

Frontend runs on: http://localhost:5173
