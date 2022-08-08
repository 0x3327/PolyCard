import { createRef } from "react"
import { Button } from "../button/button"
import { Input } from "../input/input";

export const PasswordInput = ({ onSubmit, onClose }) => {
    const passwordInputFieldRef = createRef();

    return (
        <div className="password-input-wrap" onClick={() => onClose()}>
            <div className="password-input" onClick={(e) => e.stopPropagation()}>
                <p className="title">Input password</p>
                
                <Input 
                    inputRef={passwordInputFieldRef}
                    type="password" 
                    className="password-input-field"
                    placeholder={"password"}
                />

                <div className="actions">
                    <Button 
                        title="Unlock"
                        onClick={() => onSubmit(passwordInputFieldRef.current.value)}
                    />
                    <Button 
                        title="Cancel"
                        onClick={() => onClose()}
                    />
                </div>
            </div>
        </div>
    )
}