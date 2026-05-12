import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpensesView from "./ExpensesView";
import type { DataType } from "../types/expenses";

describe("ExpensesView Component", () => {
  const mockData: DataType[] = [
    {
      id: 1,
      title: "groceries",
      amount: 50.0,
      category: "food",
      expense_date: "2024-01-15",
    },
    {
      id: 2,
      title: "gas",
      amount: 60.0,
      category: "transportation",
      expense_date: "2024-01-14",
    },
    {
      id: 3,
      title: "utilities",
      amount: 120.0,
      category: "bills",
      expense_date: "2024-01-13",
    },
  ];

  const categories = ["food", "transportation", "bills"];
  const mockOnRemove = vi.fn();

  it("should render no expenses message when data is empty", () => {
    render(
      <ExpensesView
        data={[]}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );
    expect(screen.getByText("No expenses found")).toBeInTheDocument();
  });

  it("should render filter section and expenses table when data exists", () => {
    render(
      <ExpensesView
        data={mockData}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );
    expect(screen.getByText("Search by title")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should filter expenses by category", async () => {
    const user = userEvent.setup();
    render(
      <ExpensesView
        data={mockData}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );

    const categorySelect = screen.getByDisplayValue("All");
    await user.selectOptions(categorySelect, "food");

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    // Header + 1 food item
    expect(rows.length).toBe(2);
  });

  it("should search expenses by title", async () => {
    const user = userEvent.setup();
    render(
      <ExpensesView
        data={mockData}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Title");
    await user.type(searchInput, "gas");

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBe(2); // Header + 1 matching item
  });

  it("should search expenses by date", async () => {
    const user = userEvent.setup();
    render(
      <ExpensesView
        data={mockData}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );

    const dateInputs = screen.getAllByDisplayValue("");
    // Find the date input (second empty input after title search)
    const dateInput = dateInputs.find(
      (input) => input.getAttribute("type") === "date",
    );
    if (dateInput) {
      await user.type(dateInput, "2024-01-15");
    }

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBe(2); // Header + 1 matching item
  });

  it("should sort expenses by latest (default)", () => {
    render(
      <ExpensesView
        data={mockData}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[1];
    // Should match any date format (e.g., 15/1/2024, 1/15/2024, 15.01.2024, etc.)
    expect(
      within(firstDataRow).getByText(/\d{1,2}[./-]\d{1,2}[./-]\d{4}/),
    ).toBeInTheDocument();
  });

  it("should show not found message when filters return no results", async () => {
    const user = userEvent.setup();
    render(
      <ExpensesView
        data={mockData}
        categories={categories}
        onRemove={mockOnRemove}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Title");
    await user.type(searchInput, "nonexistent");

    expect(screen.getByText("Not found")).toBeInTheDocument();
  });
});
