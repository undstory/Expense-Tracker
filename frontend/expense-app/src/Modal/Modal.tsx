import { useState } from 'react';
import type { CategoryType } from '../types/expenses';
import './Modal.scss'

type ModalProps = {
    categories: CategoryType,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess: () => void
}
const Modal = ({ categories, setIsModalOpened, onSuccess } : ModalProps) => {

    const [ errorMessage, setErrorMessage ] = useState<string | null>(null)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(errorMessage) return

        const form = e.currentTarget
        const formData = new FormData(form)

        const title = formData.get('title')?.toString().toLowerCase().trim()
        const category = formData.get('category')?.toString().toLowerCase().trim()
        const amountRaw = formData.get('amount')?.toString()
        const expense = formData.get('date')?.toString()

        if(!title || !category || !amountRaw || !expense) {
            setErrorMessage('All fields are required')
            return
        }

        const amount = Number(amountRaw)

        if(Number.isNaN(amount) || amount <= 0) {
            setErrorMessage('Amount must be greater than 0')
            return
        }

        const payload = {
        title, category,
        amount,
        expense_date: expense
    }


        try {
             await fetch('http://127.0.0.1:8000/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            await onSuccess()
            setIsModalOpened(false)

        } catch (e: unknown) {
            console.log(e)
        }
    }

    const handleCorrectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null)
        e.target.value = e.target.value.replace(/[^A-Za-ząćęłńóśżźĄĆĘŁŃÓŚŻŹ\s]/g, '')
    }

    const handleCorrectDate = (e:React.ChangeEvent<HTMLInputElement> ) => {
        setErrorMessage(null)
        console.log("data", e.target.value);
        const selectedDate = new Date(e.target.value)
        const today = new Date()
        if(selectedDate > today) {
            setErrorMessage('Date cannot be from the future')
            return
        }
    }

    const handleCorrectAmount = () => {
        setErrorMessage('')
    }

    return (
        <div className='modal-overlay'>

        <div className="modal-wrapper">
            <h2 className='modal-header'>Add expense</h2>
            <form className='modal-form' onSubmit={handleSubmit}>

                <label htmlFor="Title">Title</label>
                <input name="title" type="text" onChange={handleCorrectTitle} />
                <label htmlFor="Category">Category</label>
                <select name="category" required>
                    <option>Other</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <label htmlFor="Amount">Amount</label>
                <input type="number" name="amount"  onChange={handleCorrectAmount} min="0.01" step="0.01"/>
                <label htmlFor="Date">Date</label>
                <input type="date" name="date" onChange={handleCorrectDate} />
                <div className='modal-buttons'>
            { errorMessage ? <p>{errorMessage}</p> : null }
            <button className='modal-button' type="submit">Add expense</button>
            <button className='modal-button' onClick={() => setIsModalOpened(false)}>Cancel</button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Modal