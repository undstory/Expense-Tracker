import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpensesTable from "./ExpensesTable";
import type { DataType } from "../types/expenses";

describe("ExpensesTable Component", () => {
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
      amount: 60.5,
      category: "transportation",
      expense_date: "2024-01-14",
    },
  ];

  const mockOnRemove = vi.fn();

  it("should render table with correct headers", () => {
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Expense Date")).toBeInTheDocument();
    expect(screen.getByText("Delete expense")).toBeInTheDocument();
  });

  it("should render all expense data rows", () => {
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBe(3); // 1 header + 2 data rows
  });

  it("should capitalize titles and categories", () => {
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Gas")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Transportation")).toBeInTheDocument();
  });

  it("should format amounts to 2 decimal places", () => {
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    expect(screen.getByText("50.00")).toBeInTheDocument();
    expect(screen.getByText("60.50")).toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Check that dates are formatted (format may vary by locale)
    // Matches formats like: 1/15/2024, 15/1/2024, 15.01.2024, etc.
    const firstDataRow = rows[1];
    expect(
      within(firstDataRow).getByText(/\d{1,2}[./-]\d{1,2}[./-]\d{4}/),
    ).toBeInTheDocument();
  });

  it("should call onRemove with correct id when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it("should render empty table with only headers when data is empty", () => {
    render(<ExpensesTable data={[]} onRemove={mockOnRemove} />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBe(1); // Only header row
  });

  it("should render multiple delete buttons for multiple items", () => {
    render(<ExpensesTable data={mockData} onRemove={mockOnRemove} />);

    const deleteButtons = screen.getAllByText("Delete");
    expect(deleteButtons.length).toBe(mockData.length);
  });
});
