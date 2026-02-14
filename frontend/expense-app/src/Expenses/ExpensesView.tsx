
import { useState, useMemo } from 'react';
import ExpensesTable from '../ExpensesTable/ExpensesTable';
import FilterSection from '../FilterSection/FilterSection';
import type { DataType, CategoryType } from '../types/expenses';
import './ExpensesView.scss'
import { sanity } from '../utils/utils';

type ExpensesViewProps = {
    data: DataType[],
    categories: CategoryType,
    onRemove: (id: number) => void
}

const ExpensesView = ({ data, categories, onRemove }: ExpensesViewProps) => {

    const [ category, setCategory ] = useState<string>('All')
    const [ sort, setSort ] = useState<string>('Latest')
    const [ searchForTitle, setSearchForTitle ] = useState<string>('')
    const [ searchForDate, setSearchForDate ] = useState<string>('')


    const filteredData = useMemo(() => {
        return data
            .filter((el) => {
                   if(category === 'All') return true
                   return el.category === category
            })
            .filter((el) => {
                 if(!searchForTitle) return true
                 return sanity(el.title).includes(searchForTitle)
            })
            .filter((el) => {
                if(!searchForDate) return true
                return el.expense_date === searchForDate
            })
    }, [data, category, searchForDate, searchForTitle])


    const sortByOption = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const bdate = new Date(b.expense_date).getTime()
            const adate = new Date(a.expense_date).getTime()

       if(sort === 'Oldest') {
            return new Date(adate).getTime() - new Date(bdate).getTime()
        } else if(sort === 'A to Z') {
            return a.title.localeCompare(b.title)
        } else if(sort === 'Z to A') {
             return b.title.localeCompare(a.title)
        } else if(sort === 'Lowest') {
            return a.amount - b.amount
        } else if(sort === 'Highest') {
            return b.amount - a.amount
        }
        return new Date(bdate).getTime() - new Date(adate).getTime()
    })
}, [sort, filteredData])


    return (
    <div className='expenses-wrapper'>
    {
      data.length === 0
      ?
      <p>No expenses found</p>
      :
        (
        <div className='expenses-list'>
          <FilterSection
            categories={categories}
            sort={sort}
            setSort={setSort}
            setCategory={setCategory}
            category={category}
            searchForTitle={searchForTitle}
            setSearchForTitle={setSearchForTitle}
            searchForDate={searchForDate}
            setSearchForDate={setSearchForDate}
            />
            {
                sortByOption.length ?
                <ExpensesTable data={sortByOption} onRemove={onRemove}/>
                :
                <p className='filter-notfound'>Not found</p>
            }
        </div>
        )
    }
    </div>
    )
}

export default ExpensesView