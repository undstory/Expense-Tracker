import { useState } from 'react';
import type { CategoryType } from '../types/expenses';
import './Modal.scss'

type ModalProps = {
    categories: CategoryType,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess: () => void
    setPopupMessage: React.Dispatch<React.SetStateAction<string>>
    setIsPopupOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const Modal = ({ categories, setIsModalOpened, onSuccess, setIsPopupOpened, setPopupMessage } : ModalProps) => {

    const [ errorMessage, setErrorMessage ] = useState<string | null>(null)
    const [ selectedCategory, setSelectedCategory ] = useState<string>('')
    const [ customCategory, setCustomCategory] = useState<string>('')

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(errorMessage) return

        const form = e.currentTarget
        const formData = new FormData(form)

        const title = formData.get('title')?.toString().toLowerCase().trim()
        const amountRaw = formData.get('amount')?.toString()
        const expense = formData.get('date')?.toString()

        const category = selectedCategory === '__ADD_NEW__' ? customCategory.toLowerCase().trim() : selectedCategory.toLowerCase().trim()

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
            const response = await fetch('http://127.0.0.1:8000/expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(!response.ok) throw new Error('Api error')
            onSuccess()
            setIsModalOpened(false)

        } catch (e: unknown) {
            console.log(e)
            setIsModalOpened(false)
            setIsPopupOpened(true)
            setPopupMessage("Something went wrong")
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

    const handleNewCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomCategory(e.target.value)
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
                <select name="category" required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="" disabled>Select category</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="__ADD_NEW__">Add new category</option>
                </select>
                {selectedCategory === "__ADD_NEW__" ? (
                    <>
                        <label htmlFor='newCategory'>New category</label>
                        <input type="text" name="customCategory" value={customCategory} onChange={(e) => handleNewCategory(e) } />
                    </>
                ) : null}
                <label htmlFor="Amount">Amount</label>
                <input type="number" name="amount"  onChange={handleCorrectAmount} min="0.01" step="0.01"/>
                <label htmlFor="Date">Date</label>
                <input type="date" name="date" onChange={handleCorrectDate} />
                { errorMessage ? <p className='modal-errormessage'>{errorMessage}</p> : null }
                <div className='modal-buttons'>
                    <button className='modal-button' type="submit">Add expense</button>
                    <button className='modal-button' onClick={() => setIsModalOpened(false)}>Cancel</button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Modal