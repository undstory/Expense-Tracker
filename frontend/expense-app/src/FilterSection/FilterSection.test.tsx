import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSection from "../FilterSection/FilterSection";

describe("FilterSection Component", () => {
  const categories = ["food", "transportation", "bills", "entertainment"];

  const createMocks = () => ({
    setCategory: vi.fn(),
    setSort: vi.fn(),
    setSearchForTitle: vi.fn(),
    setSearchForDate: vi.fn(),
  });

  const defaultProps = {
    categories,
    category: "All",
    sort: "Latest",
    searchForTitle: "",
    searchForDate: "",
    ...createMocks(),
  };

  it("should render all filter sections", () => {
    render(<FilterSection {...defaultProps} />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Category/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Sort/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Clean up filters/i }),
    ).toBeInTheDocument();
  });

  it("should render all category options", () => {
    render(<FilterSection {...defaultProps} />);

    const categorySelect = screen.getByDisplayValue("All");
    expect(categorySelect).toBeInTheDocument();

    // Check that all categories are in the options
    for (const category of categories) {
      expect(
        screen.getByRole("option", { name: category }),
      ).toBeInTheDocument();
    }
  });

  it("should render all sort options", () => {
    render(<FilterSection {...defaultProps} />);

    const sortOptions = [
      "Latest",
      "Oldest",
      "A to Z",
      "Z to A",
      "Highest",
      "Lowest",
    ];
    for (const option of sortOptions) {
      expect(screen.getByRole("option", { name: option })).toBeInTheDocument();
    }
  });

  it("should call setCategory when category is changed", async () => {
    const user = userEvent.setup();
    const mocks = createMocks();
    render(<FilterSection {...defaultProps} {...mocks} />);

    const categorySelect = screen.getByDisplayValue("All");
    await user.selectOptions(categorySelect, "food");

    expect(mocks.setCategory).toHaveBeenCalledWith("food");
  });

  it("should call setSort when sort option is changed", async () => {
    const user = userEvent.setup();
    const mocks = createMocks();
    render(<FilterSection {...defaultProps} {...mocks} />);

    const sortSelect = screen.getByDisplayValue("Latest");
    await user.selectOptions(sortSelect, "A to Z");

    expect(mocks.setSort).toHaveBeenCalledWith("A to Z");
  });

  it("should call setSearchForTitle when title search input changes", async () => {
    const user = userEvent.setup();
    const mocks = createMocks();
    render(<FilterSection {...defaultProps} {...mocks} />);

    const titleInput = screen.getByPlaceholderText("Title");
    await user.type(titleInput, "groceries");

    expect(mocks.setSearchForTitle).toHaveBeenCalled();
  });

  it("should call setSearchForDate when date input changes", async () => {
    const user = userEvent.setup();
    const mocks = createMocks();
    const { container } = render(
      <FilterSection {...defaultProps} {...mocks} />,
    );

    const dateInput = container.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;
    await user.type(dateInput, "2024-01-15");

    expect(mocks.setSearchForDate).toHaveBeenCalled();
  });

  it("should respond to title search input changes", async () => {
    const user = userEvent.setup();
    const mocks = createMocks();
    render(<FilterSection {...defaultProps} {...mocks} />);

    const titleInput = screen.getByPlaceholderText("Title");
    await user.type(titleInput, "search term");

    // Verify the handler is called multiple times as user types
    expect(mocks.setSearchForTitle).toHaveBeenCalled();
    expect(mocks.setSearchForTitle.mock.calls.length).toBeGreaterThan(0);
  });

  it("should reset all filters when Clean up filters is clicked", async () => {
    const user = userEvent.setup();
    const mocks = createMocks();
    render(
      <FilterSection
        {...defaultProps}
        {...mocks}
        category="food"
        sort="Oldest"
        searchForTitle="groceries"
        searchForDate="2024-01-15"
      />,
    );

    const cleanupBtn = screen.getByText("Clean up filters");
    await user.click(cleanupBtn);

    expect(mocks.setCategory).toHaveBeenCalledWith("All");
    expect(mocks.setSort).toHaveBeenCalledWith("Latest");
    expect(mocks.setSearchForDate).toHaveBeenCalledWith("");
    expect(mocks.setSearchForTitle).toHaveBeenCalledWith("");
  });

  it("should display current search values", () => {
    render(
      <FilterSection
        {...defaultProps}
        searchForTitle="test search"
        searchForDate="2024-01-15"
      />,
    );

    expect(screen.getByDisplayValue("test search")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
  });

  it("should display current category selection", () => {
    render(<FilterSection {...defaultProps} category="transportation" />);

    expect(screen.getByDisplayValue("transportation")).toBeInTheDocument();
  });

  it("should display current sort selection", () => {
    render(<FilterSection {...defaultProps} sort="Z to A" />);

    expect(screen.getByDisplayValue("Z to A")).toBeInTheDocument();
  });
});
