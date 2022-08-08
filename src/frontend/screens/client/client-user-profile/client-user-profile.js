import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/button/button"
import { Header } from "../../../components/header/header"
import { LockContext } from "../../../contexts/lock-context";
import { QRContext } from "../../../contexts/qr-context";
import { TransactionContext } from "../../../contexts/transaction-context";
import { UserContext } from "../../../contexts/user-context";

export const ClientUserProfile = () => {
    const navigate = useNavigate();

    const { generateAccountCode } = useContext(QRContext);
    const { removeAccount } = useContext(UserContext);
    const { requestPassword } = useContext(LockContext);
    const { clearTransactions } = useContext(TransactionContext);

    const [isQrVisible, setIsQrVisible] = useState(false);
    const [qrCode, setQrCode] = useState(null);

    const generateCode = async () => {
        requestPassword(async (key) => {
            const code = await generateAccountCode(key);
            setQrCode(code);
            setIsQrVisible(true);
        })
    }

    const resetAccount = () => {
        clearTransactions();
        removeAccount();
        navigate('/client/init');
    }

    const logoutUser = () => {
        navigate('/client/enter-pin');
    }

    return (
        <div className="client-user-profile">
            { isQrVisible && qrCode &&
                <div className="qr-modal" onClick={() => setIsQrVisible(false)}>
                    <img className="qr-code" src={qrCode}></img>        
                </div>
            }

            <Header backPath="/client/home"/>
            <p className="screen-title">User Profile</p>

            <Button
                title="Reset account"
                type="full-size"
                onClick={() => resetAccount()}
            />
            <Button
                title="Show account code"
                type="full-size"
                onClick={() => generateCode()}
            />
            <Button
                onClick={() => logoutUser()}
                title="Logout"
                type="full-size"
            />
        </div>
    )
}