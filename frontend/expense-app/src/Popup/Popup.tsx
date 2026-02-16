import './Popup.scss'

type PopupProps = {
    popupMessage: string,
    setIsPopupOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const Popup = ({ popupMessage, setIsPopupOpened }: PopupProps) => {
    return (
        <div className="popup-overlay">
            <div className="popup-wrapper">
                <h2 className='popup-header'>Message</h2>
                <p>{popupMessage}</p>
                <button className="popup-button" onClick={() => setIsPopupOpened(false)}>Close</button>
            </div>
        </div>
    )
}

export default Popup