import type { CategoryType } from '../types/expenses';
import './Modal.scss'

type ModalProps = {
    categories: CategoryType,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const Modal = ({ categories, setIsModalOpened} : ModalProps) => {
    return (
        <div className='modal-overlay'>

        <div className="modal-wrapper">
            <h2 className='modal-header'>Add expense</h2>
            <form className='modal-form'>

                <label htmlFor="Title">Title</label>
                <input placeholder="Title" name="title" type="text" />
                <label htmlFor="Category">Category</label>
                <select>
                    <option>Other</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <label htmlFor="Amount">Amount</label>
                <input type="text" name="amount" />
                <label htmlFor="Date">Date</label>
                <input type="date" />
                <div className='modal-buttons'>
            <button className='modal-button'>Add expense</button>
            <button className='modal-button' onClick={() => setIsModalOpened(false)}>Cancel</button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Modal