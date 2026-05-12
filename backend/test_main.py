import pytest
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from main import app, create_tables, get_expenses, create_expenses, remove_expense
from schemas import ExpenseCreate
from datetime import date
import sqlite3


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def mock_db_connection():
    """Mock database connection and cursor."""
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_conn.cursor.return_value = mock_cursor
    return mock_conn, mock_cursor


class TestCreateTables:
    """Test the create_tables function."""

    @patch('main.sqlite3.connect')
    def test_create_tables_success(self, mock_connect):
        """Test successful table creation."""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        create_tables()

        mock_connect.assert_called_once_with("expenses.db", check_same_thread=False)
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('main.sqlite3.connect')
    def test_create_tables_connection_error(self, mock_connect):
        """Test table creation with connection error."""
        mock_connect.side_effect = sqlite3.Error("Connection failed")

        # Should not raise exception, just print error
        create_tables()

        mock_connect.assert_called_once_with("expenses.db", check_same_thread=False)


class TestGetExpenses:
    """Test the get_expenses endpoint."""

    @patch('main.get_connection')
    def test_get_expenses_success(self, mock_get_conn, client, mock_db_connection):
        """Test successful retrieval of expenses."""
        mock_conn, mock_cursor = mock_db_connection
        mock_get_conn.return_value = mock_conn

        # Mock the fetchall to return sample data
        mock_cursor.fetchall.return_value = [
            (1, 'Lunch', 15.50, 'Food', '2024-01-15'),
            (2, 'Gas', 45.00, 'Transportation', '2024-01-14')
        ]

        response = client.get("/expenses")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0][1] == 'Lunch'  # title
        assert data[0][2] == 15.50   # amount
        assert data[0][3] == 'Food'  # category

        mock_get_conn.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT * FROM expenses ORDER BY expense_date DESC")
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('main.get_connection')
    def test_get_expenses_empty(self, mock_get_conn, client, mock_db_connection):
        """Test retrieval when no expenses exist."""
        mock_conn, mock_cursor = mock_db_connection
        mock_get_conn.return_value = mock_conn
        mock_cursor.fetchall.return_value = []

        response = client.get("/expenses")

        assert response.status_code == 200
        data = response.json()
        assert data == []

        mock_cursor.execute.assert_called_once_with("SELECT * FROM expenses ORDER BY expense_date DESC")


class TestCreateExpenses:
    """Test the create_expenses endpoint."""

    @patch('main.get_connection')
    def test_create_expenses_success(self, mock_get_conn, client, mock_db_connection):
        """Test successful creation of an expense."""
        mock_conn, mock_cursor = mock_db_connection
        mock_get_conn.return_value = mock_conn

        expense_data = {
            "title": "Coffee",
            "amount": 5.50,
            "category": "Food",
            "expense_date": "2024-01-16"
        }

        response = client.post("/expenses", json=expense_data)

        assert response.status_code == 200
        data = response.json()
        assert data == {"message": "Expense added"}

        mock_get_conn.assert_called_once()
        expected_query = "INSERT INTO expenses (title, category, amount, expense_date) VALUES (?, ?, ?, ?)"
        mock_cursor.execute.assert_called_once_with(
            expected_query,
            ("Coffee", "Food", 5.5, date(2024, 1, 16))
        )
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('main.get_connection')
    def test_create_expenses_invalid_data(self, mock_get_conn, client):
        """Test creation with invalid data."""
        # Test with missing required field
        invalid_data = {
            "title": "Coffee",
            "amount": 5.50,
            # missing category
            "expense_date": "2024-01-16"
        }

        response = client.post("/expenses", json=invalid_data)

        # Should return 422 Unprocessable Entity due to validation
        assert response.status_code == 422


class TestRemoveExpense:
    """Test the remove_expense endpoint."""

    @patch('main.get_connection')
    def test_remove_expense_success(self, mock_get_conn, client, mock_db_connection):
        """Test successful removal of an expense."""
        mock_conn, mock_cursor = mock_db_connection
        mock_get_conn.return_value = mock_conn

        response = client.delete("/expenses/1")

        assert response.status_code == 200
        data = response.json()
        assert data == {"message": "Expense removed"}

        mock_get_conn.assert_called_once()
        expected_query = "DELETE FROM expenses WHERE ID=(?)"
        mock_cursor.execute.assert_called_once_with(expected_query, (1,))
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('main.get_connection')
    def test_remove_expense_nonexistent(self, mock_get_conn, client, mock_db_connection):
        """Test removal of non-existent expense (should still succeed)."""
        mock_conn, mock_cursor = mock_db_connection
        mock_get_conn.return_value = mock_conn

        response = client.delete("/expenses/999")

        assert response.status_code == 200
        data = response.json()
        assert data == {"message": "Expense removed"}

        mock_cursor.execute.assert_called_once_with("DELETE FROM expenses WHERE ID=(?)", (999,))


class TestDatabaseConnection:
    """Test database connection functionality."""

    @patch('main.sqlite3.connect')
    def test_get_connection(self, mock_connect):
        """Test the get_connection function from db module."""
        from db import get_connection

        mock_conn = Mock()
        mock_connect.return_value = mock_conn

        result = get_connection()

        assert result == mock_conn
        mock_connect.assert_called_once_with("expenses.db", check_same_thread=False)


class TestIntegration:
    """Integration tests combining multiple operations."""

    @patch('main.get_connection')
    def test_full_expense_workflow(self, mock_get_conn, client):
        """Test creating, retrieving, and deleting an expense."""
        # Setup mock connection and cursor
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        # Mock the insert operation
        mock_cursor.lastrowid = 1

        # 1. Create expense
        expense_data = {
            "title": "Test Expense",
            "amount": 10.00,
            "category": "Test",
            "expense_date": "2024-01-17"
        }

        response = client.post("/expenses", json=expense_data)
        assert response.status_code == 200

        # Verify create was called
        assert mock_get_conn.call_count == 1

        # 2. Get expenses - mock fetchall to return the created expense
        mock_cursor.fetchall.return_value = [(1, 'Test Expense', 10.00, 'Test', '2024-01-17')]

        response = client.get("/expenses")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0][1] == 'Test Expense'

        # Verify get was called (total 2 calls now)
        assert mock_get_conn.call_count == 2

        # 3. Delete expense
        response = client.delete("/expenses/1")
        assert response.status_code == 200

        # Verify delete was called (total 3 calls)
        assert mock_get_conn.call_count == 3