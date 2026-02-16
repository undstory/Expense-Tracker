from pydantic import BaseModel, Field, field_validator
from datetime import date

class ExpenseCreate(BaseModel):
    title: str = Field(min_length=3)
    amount: float = Field(gt=0)
    category: str = Field(min_length=3)
    expense_date: date

    @field_validator('expense_date')
    @classmethod
    def validate_date(cls, v: date):
        if(v.year < 2000):
            raise ValueError("Date must be later than year 2000")
        if(v.year > date.today()):
            raise ValueError("Date cannot be in the future")
        return v

class Expense(ExpenseCreate):
    id: int