import { useEffect, useState } from 'react'
import './App.css'

import type { DataType } from './types/expenses';
import Modal from './Modal/Modal';
import ExpensesView from './Expenses/ExpensesView';
import Popup from './Popup/Popup';


function App() {
  const [ data, setData ] = useState<DataType[]>([])
  const [ isModalOpened, setIsModalOpened ] = useState(false)
  const [ isPopupOpened, setIsPopupOpened ] = useState(false)
  const [ popupMessage, setPopupMessage ] = useState<string>('')

    const getExpenses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/expenses')
        if(!response.ok) throw new Error('Api error')
        const data = await response.json()
        setData(data)

      } catch (e: unknown) {
        console.log(e)
        setIsPopupOpened(true)
        setPopupMessage("Something went wrong")
      }
    }

  useEffect(()  => {
    getExpenses()
  }, [])

 const categories = [...new Set(data.map(el => el.category))]

 const refreshExpenses = async () => {
  await getExpenses()
  setIsPopupOpened(true)
  setPopupMessage("Expense added successfully")
 }

   const handleRemove = async (item: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/expenses/${item}`, {
        method: 'DELETE',
      })
       if(!response.ok) throw new Error('Api error')
      await getExpenses()
      setIsPopupOpened(true)
      setPopupMessage("Expense removed successfully")
    }
    catch(e) {
      console.log(e);
      setIsPopupOpened(true)
      setPopupMessage("Something went wrong")
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
      <Modal setPopupMessage={setPopupMessage} setIsPopupOpened={setIsPopupOpened} onSuccess={refreshExpenses} categories={categories} setIsModalOpened={setIsModalOpened} />
      :
      null
    }
    { isPopupOpened ? <Popup setIsPopupOpened={setIsPopupOpened} popupMessage={popupMessage} /> : null }
  </div>
  </>
  )
}

export default App
