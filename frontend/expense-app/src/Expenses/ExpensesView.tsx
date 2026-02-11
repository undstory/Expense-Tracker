
import { useState, useMemo } from 'react';
import ExpensesTable from '../ExpensesTable/ExpensesTable';
import FilterSection from '../FilterSection/FilterSection';
import type { DataType, CategoryType } from '../types/expenses';
import './ExpensesView.scss'
import { parsedDate } from '../utils/utils';

type ExpensesViewProps = {
    data: DataType[],
    categories: CategoryType
}

const ExpensesView = ({ data, categories }: ExpensesViewProps) => {

    const [ category, setCategory ] = useState<string>('All')
    const [ sort, setSort ] = useState<string>('Latest')


    const filterByCategory = useMemo(() => {
        if(category === 'All') {
            return data
        }
        const filteredData : DataType[]= data.filter((el) => el.category === category)
        return filteredData
    },[category, data])

    const sortByOption = useMemo(() => {
        return [...filterByCategory].sort((a, b) => {
            const bdate = parsedDate(b.expense_date)
            const adate = parsedDate(a.expense_date)

       if(sort === 'Oldest') {
            return new Date(adate).getTime() - new Date(bdate).getTime()
        }
        return new Date(bdate).getTime() - new Date(adate).getTime()
    })
}, [sort, filterByCategory])


    return (
    <div className='expenses-wrapper'>
    {
      data.length === 0
      ?
      <p>No expenses found</p>
      :
        (
        <div className='expenses-list'>
          <FilterSection categories={categories} sort={sort} setSort={setSort} setCategory={setCategory} category={category} />
          <ExpensesTable data={sortByOption} />
        </div>
        )
    }
    </div>
    )
}

export default ExpensesView