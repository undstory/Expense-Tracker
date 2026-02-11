
import type { DataType } from '../types/expenses';
import './ExpensesTable.scss'



const ExpensesTable = ({ data }: { data: DataType[] }) => {

  return (

    <table className='expenses-table'>
      <thead className='table-header'>
        <tr className="table-row">
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Expense Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((el: DataType) => {
          return (
            <tr key={el.id} className="table-row">
              <td>{el.title}</td>
              <td>{el.amount.toFixed(2)}</td>
              <td>{el.category}</td>
              <td>{new Date(el.expense_date).toLocaleDateString()}</td>
            </tr>
          )
        })}
    </tbody>
    </table>


  )
}

export default ExpensesTable