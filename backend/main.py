from fastapi import FastAPI
from db import get_connection
from schemas import ExpenseCreate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Daily Expense Tracker API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow all origins (you can be more specific in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/expenses")
def get_expenses():
    db = get_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM expenses ORDER BY expense_date DESC")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return data

@app.post("/expenses")
def create_expenses(expense: ExpenseCreate):
    db = get_connection()
    cursor = db.cursor()
    query="""INSERT INTO expenses (title, amount, category, expense_date) VALUES (%s, %s, %s, %s)"""
    cursor.execute(
        query,
        (expense.title, expense.amount, expense.category, expense.expense_date)
    )
    db.commit()
    cursor.close()
    db.close()

    return {"message": "Expense added"}

@app.get("/health")
def health():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT 1")
    cursor.fetchone()
    cursor.close()
    db.close()
    return {"status": "ok"}