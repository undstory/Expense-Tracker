import { useEffect, useState } from 'react'
import './App.css'

import type { DataType } from './types/expenses';
import Modal from './Modal/Modal';
import ExpensesView from './Expenses/ExpensesView';
import Popup from './Popup/Popup';


function App() {
  const [ data, setData ] = useState<DataType[]>([])
  const [ isModalOpened, setIsModalOpened ] = useState(false)
  const [ popup, setPopup ] = useState<string | null>(null)

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

  useEffect(()  => {
    getExpenses()
  }, [])

 const categories = [...new Set(data.map(el => el.category))]

 const refreshExpenses = async () => {
  await getExpenses()
  setPopup("added")
 }

   const handleRemove = async (item: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/expenses/${item}`, {
        method: 'DELETE',
      })
      await getExpenses()
      setPopup("removed")
    }
    catch(e) {
      console.log(e);
    }
  }

  return (
  <>
  <div className='page-wrapper'>
    <div className='page-left'>
    <h2>Expenses</h2>
    <button className='expenses-button' onClick={() => setIsModalOpened(true)}>Add expenses</button>
    </div>
    <ExpensesView data={data} onRemove={handleRemove} categories={categories}/>

    { isModalOpened
      ?
      <Modal onSuccess={refreshExpenses} categories={categories} setIsModalOpened={setIsModalOpened} />
      :
      null
    }
    { popup === "removed" || popup === "added" ? <Popup setPopup={setPopup} activity={popup} /> : null }
  </div>
  </>
  )
}

export default App
