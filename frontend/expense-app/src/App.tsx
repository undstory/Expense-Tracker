import { useEffect, useState } from 'react'
import './App.css'

import type { DataType } from './types/expenses';
import Modal from './Modal/Modal';
import ExpensesView from './Expenses/ExpensesView';


function App() {
  const [ data, setData ] = useState<DataType[]>([])
  const [ isModalOpened, setIsModalOpened ] = useState(false)

  useEffect(()  => {
    const getExpenses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/expenses')
        if(!response.ok) throw new Error('Api error')
        const data = await response.json()
        setData(data)

      } catch (e: unknown) {
        console.log(e)
      }
    }

    getExpenses()
  }, [])

 const categories = [...new Set(data.map(el => el.category))]

 const handleAddExpense = (newExpense: DataType) => {
  setData((prev) => [newExpense, ...prev])
 }


  return (
  <>
  <div className='page-wrapper'>
    <div className='page-left'>
    <h2>Expenses</h2>
    <button className='expenses-button' onClick={() => setIsModalOpened(true)}>Add expenses</button>
    </div>
    <ExpensesView data={data} categories={categories}/>

    { isModalOpened
      ?
      <Modal onSuccess={handleAddExpense} categories={categories} setIsModalOpened={setIsModalOpened} />
      :
      null
    }
  </div>
  </>
  )
}

export default App
