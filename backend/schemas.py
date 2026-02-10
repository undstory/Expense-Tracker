from pydantic import BaseModel
from datetime import date

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str | None = None
    expense_date: date

class Expense(ExpenseCreate):
    id: int