import { createContext, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PasswordInput } from "../components/password-input/password-input";
import { UserContext } from "./user-context";

export const LockContext = createContext();

const LockContextProvider = ({ children }) => {
    const { isPasswordValid, getTransactionKey } = useContext(UserContext);
    const [isPasswordInputVisible, setIsPasswordInputVisible] = useState(false);
    const waitingAction = useRef(null);

    const requestPassword = (callback) => {
        waitingAction.current = callback;
        setIsPasswordInputVisible(true);
    }

    const hideInput = () => {
        waitingAction.current = null;
        setIsPasswordInputVisible(false);
    }

    const tryUnlock = (password) => {
        if (!isPasswordValid(password)) {
            toast.error('Incorrect password');
            return;
        }

        const key = getTransactionKey(password);

        if (waitingAction.current != null) {
            waitingAction.current(key);
            hideInput();
        }
    }

    return (
        <LockContext.Provider value={{ isPasswordInputVisible, requestPassword }}>
            { isPasswordInputVisible && <PasswordInput onClose={() => hideInput()} onSubmit={(password) => tryUnlock(password)}/> }
            { children }
        </LockContext.Provider>
    )
}

export default LockContextProvider;