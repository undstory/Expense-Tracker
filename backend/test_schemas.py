import pytest
from datetime import date
from pydantic import ValidationError
from schemas import ExpenseCreate, Expense


class TestExpenseCreateSchema:
    """Test cases for ExpenseCreate schema validation"""

    def test_valid_expense_creation(self):
        """Test creating a valid expense"""
        expense = ExpenseCreate(
            title="Groceries",
            amount=50.00,
            category="Food",
            expense_date=date(2024, 1, 15)
        )
        assert expense.title == "Groceries"
        assert expense.amount == 50.00
        assert expense.category == "Food"
        assert expense.expense_date == date(2024, 1, 15)

    def test_title_too_short(self):
        """Test that title must be at least 3 characters"""
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(
                title="ab",
                amount=50.00,
                category="Food",
                expense_date=date(2024, 1, 15)
            )
        errors = exc_info.value.errors()
        assert any(error['loc'] == ('title',) for error in errors)

    def test_category_too_short(self):
        """Test that category must be at least 3 characters"""
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(
                title="Groceries",
                amount=50.00,
                category="ab",
                expense_date=date(2024, 1, 15)
            )
        errors = exc_info.value.errors()
        assert any(error['loc'] == ('category',) for error in errors)

    def test_negative_amount(self):
        """Test that amount must be greater than 0"""
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(
                title="Groceries",
                amount=-50.00,
                category="Food",
                expense_date=date(2024, 1, 15)
            )
        errors = exc_info.value.errors()
        assert any(error['loc'] == ('amount',) for error in errors)

    def test_zero_amount(self):
        """Test that amount must be greater than 0"""
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(
                title="Groceries",
                amount=0.00,
                category="Food",
                expense_date=date(2024, 1, 15)
            )
        errors = exc_info.value.errors()
        assert any(error['loc'] == ('amount',) for error in errors)

    def test_date_before_2000(self):
        """Test that date must be after year 2000"""
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(
                title="Groceries",
                amount=50.00,
                category="Food",
                expense_date=date(1999, 1, 15)
            )
        errors = exc_info.value.errors()
        assert any(error['loc'] == ('expense_date',) for error in errors)

    def test_date_in_future(self):
        """Test that date cannot be in the future"""
        future_date = date(2030, 1, 15)
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(
                title="Groceries",
                amount=50.00,
                category="Food",
                expense_date=future_date
            )
        errors = exc_info.value.errors()
        assert any(error['loc'] == ('expense_date',) for error in errors)


class TestExpenseSchema:
    """Test cases for Expense schema (with ID)"""

    def test_expense_with_id(self):
        """Test creating an Expense object with ID"""
        expense = Expense(
            id=1,
            title="Groceries",
            amount=50.00,
            category="Food",
            expense_date=date(2024, 1, 15)
        )
        assert expense.id == 1
        assert expense.title == "Groceries"
        assert expense.amount == 50.00
        assert expense.category == "Food"
        assert expense.expense_date == date(2024, 1, 15)
