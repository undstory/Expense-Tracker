import { useEffect, useState } from 'react'
import './App.css'

type DataType = {
  id: number,
  title: string,
  amount: number,
  category: string,
  expense_date: string
}

function App() {
  const [ data, setData ] = useState<DataType[]>([])
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

  return (
  <>
  <div>
    <h2>Expenses</h2>
    {data.map((el) => {
      return (
        <div>
          {el.title}
        </div>
      )
    })}
  </div>
  </>
  )
}

export default App
