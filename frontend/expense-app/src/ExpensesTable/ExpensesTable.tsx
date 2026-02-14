
import type { DataType } from '../types/expenses';
import { capitalizeFirstLetter } from '../utils/utils';
import './ExpensesTable.scss'

type ExpensesTableProps = {
  data: DataType[],
  onRemove: (id: number) => void
}


const ExpensesTable = ({ data, onRemove }: ExpensesTableProps) => {



  return (

    <table className='expenses-table'>
      <thead className='table-header'>
        <tr className="table-row">
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Expense Date</th>
          <th>Delete expense</th>
        </tr>
      </thead>
      <tbody>
        {data.map((el: DataType) => {
          return (
            <tr key={el.id} className="table-row">
              <td>{capitalizeFirstLetter(el.title)}</td>
              <td>{el.amount.toFixed(2)}</td>
              <td>{capitalizeFirstLetter(el.category)}</td>
              <td>{new Date(el.expense_date).toLocaleDateString()}</td>
              <td><button className="table-removebtn" onClick={() => onRemove(el.id)}>Delete</button></td>
            </tr>
          )
        })}
    </tbody>
    </table>


  )
}

export default ExpensesTable