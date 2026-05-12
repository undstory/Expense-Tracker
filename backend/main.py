from fastapi import FastAPI
from db import get_connection
from schemas import ExpenseCreate
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager, contextmanager
import sqlite3

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan,title="Daily Expense Tracker API")
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://expense-tracker-kappa-black-65.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_tables():
    try:
        connection = sqlite3.connect("expenses.db", check_same_thread=False)
        cursor = connection.cursor()
    except sqlite3.Error as err:
        print(f"Error connecting to database: {err}")
        return
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(50) NOT NULL,
            expense_date DATE NOT NULL
        )
    """)
    connection.commit()
    cursor.close()
    connection.close()





@app.get("/expenses")
def get_expenses():
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM expenses ORDER BY expense_date DESC")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return data

@app.post("/expenses")
def create_expenses(expense: ExpenseCreate):
    db = get_connection()
    cursor = db.cursor()
    query="""INSERT INTO expenses (title, category, amount, expense_date) VALUES (?, ?, ?, ?)"""
    cursor.execute(
        query,
        (expense.title, expense.category, expense.amount, expense.expense_date)
    )
    db.commit()
    cursor.close()
    db.close()

    return {"message": "Expense added"}

@app.delete("/expenses/{id}")
def remove_expense(id: int):
    db = get_connection()
    cursor = db.cursor()
    query ="""DELETE FROM expenses WHERE ID=(?)"""
    cursor.execute(
        query,
        (id,)
    )
    db.commit()
    cursor.close()
    db.close()

    return { "message": "Expense removed"}