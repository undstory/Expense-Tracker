import type { CategoryType } from "../types/expenses";
import './FilterSection.scss'


type FilterSectionProps = {
    categories: CategoryType,
    setCategory: React.Dispatch<React.SetStateAction<string>>,
    category: string,
    sort: string,
    setSort: React.Dispatch<React.SetStateAction<string>>
}

const FilterSection = ({ categories, category, setCategory, setSort, sort }: FilterSectionProps) => {

const sortByOptions = ["Latest", "Oldest", "A to Z", "Z to A", "Highest", "Lowest"];

const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
}

const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
}

  return (
    <div className="filter-section">
        <div className="filter-category">
            <label htmlFor="category">Category:</label>
            <select className="filter-select" name="category" id="category" value={category} onChange={handleCategory}>
                <option value="All">All</option>
                    {categories.map(category => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
        </div>
        <div className="filter-sort">
            <label htmlFor="sort">Sort by:</label>
            <select className="filter-sort" name="sort" value={sort} onChange={handleSort} id="sort">

                {sortByOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}

        </select>
        </div>
        {/* <label htmlFor="date">Filter by date:</label>
        <input type="date" id="date" name="date" /> */}

    </div>
    )
}


export default FilterSection