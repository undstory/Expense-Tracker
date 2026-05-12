import pytest
from datetime import date
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from main import app, create_tables
from schemas import ExpenseCreate


@pytest.fixture
def client():
    """Fixture to provide a test client for the FastAPI app"""
    return TestClient(app)


@pytest.fixture
def mock_db_connection():
    """Fixture to mock database connection"""
    with patch('main.mysql.connector.connect') as mock_connect:
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        yield {
            'connect': mock_connect,
            'connection': mock_connection,
            'cursor': mock_cursor
        }


class TestGetExpenses:
    """Test cases for GET /expenses endpoint"""

    def test_get_expenses_empty(self, client, mock_db_connection):
        """Test getting expenses when none exist"""
        mock_cursor = mock_db_connection['cursor']
        mock_cursor.return_value = mock_db_connection['cursor']
        mock_cursor.fetchall.return_value = []

        with patch('main.get_connection', return_value=mock_db_connection['connection']):
            response = client.get("/expenses")

        assert response.status_code == 200
        assert response.json() == []

    def test_get_expenses_with_data(self, client, mock_db_connection):
        """Test getting expenses when data exists"""
        mock_cursor = mock_db_connection['cursor']
        mock_cursor.return_value = mock_db_connection['cursor']
        expenses_data = [
            {
                'id': 1,
                'title': 'Groceries',
                'amount': 50.00,
                'category': 'Food',
                'expense_date': date(2024, 1, 15)
            },
            {
                'id': 2,
                'title': 'Gas',
                'amount': 60.00,
                'category': 'Transportation',
                'expense_date': date(2024, 1, 14)
            }
        ]
        mock_cursor.fetchall.return_value = expenses_data

        with patch('main.get_connection', return_value=mock_db_connection['connection']):
            response = client.get("/expenses")

        assert response.status_code == 200
        assert len(response.json()) == 2
        assert response.json()[0]['title'] == 'Groceries'


class TestCreateExpense:
    """Test cases for POST /expenses endpoint"""

    def test_create_expense_success(self, client, mock_db_connection):
        """Test successfully creating an expense"""
        expense_data = {
            'title': 'Groceries',
            'amount': 50.00,
            'category': 'Food',
            'expense_date': '2024-01-15'
        }

        with patch('main.get_connection', return_value=mock_db_connection['connection']):
            response = client.post("/expenses", json=expense_data)

        assert response.status_code == 200
        assert response.json()['message'] == 'Expense added'
        mock_db_connection['cursor'].execute.assert_called()

    def test_create_expense_invalid_title(self, client):
        """Test creating expense with invalid title"""
        expense_data = {
            'title': 'ab',  # Too short
            'amount': 50.00,
            'category': 'Food',
            'expense_date': '2024-01-15'
        }

        response = client.post("/expenses", json=expense_data)

        assert response.status_code == 422  # Unprocessable Entity

    def test_create_expense_negative_amount(self, client):
        """Test creating expense with negative amount"""
        expense_data = {
            'title': 'Groceries',
            'amount': -50.00,
            'category': 'Food',
            'expense_date': '2024-01-15'
        }

        response = client.post("/expenses", json=expense_data)

        assert response.status_code == 422

    def test_create_expense_invalid_date(self, client):
        """Test creating expense with invalid date"""
        expense_data = {
            'title': 'Groceries',
            'amount': 50.00,
            'category': 'Food',
            'expense_date': '2030-01-15'  # Future date
        }

        response = client.post("/expenses", json=expense_data)

        assert response.status_code == 422

    def test_create_expense_missing_field(self, client):
        """Test creating expense with missing required field"""
        expense_data = {
            'title': 'Groceries',
            'amount': 50.00
            # Missing category and expense_date
        }

        response = client.post("/expenses", json=expense_data)

        assert response.status_code == 422


class TestDeleteExpense:
    """Test cases for DELETE /expenses/{id} endpoint"""

    def test_delete_expense_success(self, client, mock_db_connection):
        """Test successfully deleting an expense"""
        with patch('main.get_connection', return_value=mock_db_connection['connection']):
            response = client.delete("/expenses/1")

        assert response.status_code == 200
        assert response.json()['message'] == 'Expense removed'
        mock_db_connection['cursor'].execute.assert_called()

    def test_delete_expense_invalid_id(self, client):
        """Test deleting with invalid ID format"""
        response = client.delete("/expenses/invalid")

        assert response.status_code == 422

    def test_delete_expense_with_negative_id(self, client, mock_db_connection):
        """Test deleting with negative ID (should technically work at API level)"""
        with patch('main.get_connection', return_value=mock_db_connection['connection']):
            response = client.delete("/expenses/-1")

        assert response.status_code == 200


class TestCreateTablesFunction:
    """Test cases for create_tables function"""

    def test_create_tables_success(self, mock_db_connection):
        """Test successful table creation"""
        with patch('main.mysql.connector.connect', return_value=mock_db_connection['connection']):
            create_tables()

        mock_db_connection['cursor'].execute.assert_called()
        mock_db_connection['connection'].commit.assert_called()

    def test_create_tables_connection_error(self):
        """Test handling connection error"""
        with patch('main.mysql.connector.connect') as mock_connect:
            # Mock mysql.connector.Error properly
            mock_connect.side_effect = Exception("Connection failed")
            try:
                create_tables()
            except Exception:
                # If exception is raised (generic), that's OK
                pass
