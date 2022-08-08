export const Input = ({ inputRef, type, size, placeholder, onChange, unit, className, value, defaultValue }) => {
    return (
        <div className="input-wrap">
            <input
                ref={inputRef}
                className={`input ${size || ''} ${className || ''}`}
                type={type}
                placeholder={placeholder}
                onChange={(e) => onChange && onChange(e)}
                value={value}
                defaultValue={defaultValue}
            />
            { unit && <span className="unit">{ unit }</span> }
        </div>
    )
}