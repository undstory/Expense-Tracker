import './Popup.scss'

type PopupProps = {
    activity: string,
    setPopup: React.Dispatch<React.SetStateAction<string | null>>
}

const Popup = ({ activity, setPopup }: PopupProps) => {
    return (
        <div className="popup-overlay">
            <div className="popup-wrapper">
                <h2 className='popup-header'>Message</h2>
                <p>Expense {activity} successfully</p>
                <button className="popup-button" onClick={() => setPopup(null)}>Close</button>
            </div>
        </div>
    )
}

export default Popup