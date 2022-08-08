export const Button = ({ title, icon, onClick, type }) => {
    return (
        <button 
            className={`button ${type}`}
            onClick={() => onClick && onClick()}
        >
            { icon && <span className="icon">{ icon }</span>} { title }
        </button>
    )
}