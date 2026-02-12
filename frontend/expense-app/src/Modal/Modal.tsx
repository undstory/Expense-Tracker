import type { CategoryType, DataType } from '../types/expenses';
import './Modal.scss'

type ModalProps = {
    categories: CategoryType,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess: (newExpense: DataType) => void
}
const Modal = ({ categories, setIsModalOpened, onSuccess } : ModalProps) => {



    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)

        const payload = {
        title: formData.get('title'),
        category: formData.get('category'),
        amount: formData.get('amount'),
        expense_date: formData.get('date')
    }
        try {
            const res = await fetch('http://127.0.0.1:8000/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            onSuccess(data)
            setIsModalOpened(false)
        } catch (e: unknown) {
            console.log(e)
        }
    }
    return (
        <div className='modal-overlay'>

        <div className="modal-wrapper">
            <h2 className='modal-header'>Add expense</h2>
            <form className='modal-form' onSubmit={handleSubmit}>

                <label htmlFor="Title">Title</label>
                <input placeholder="Title" name="title" type="text" />
                <label htmlFor="Category">Category</label>
                <select name="category">
                    <option>Other</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <label htmlFor="Amount">Amount</label>
                <input type="text" name="amount" />
                <label htmlFor="Date">Date</label>
                <input type="date" name="date" />
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