import React, { useContext, useEffect, useRef, useState } from "react";
import bytes32 from "bytes32";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { CheckCircleOutline, DoubleArrow, Fingerprint } from "@mui/icons-material";
import Loader from "../../../assets/images/loader.svg";
import { TransactionContext } from "../../../contexts/transaction-context";
import { BlockchainContext } from "../../../contexts/blockchain-context";
import { UserContext } from "../../../contexts/user-context";
import { LockContext } from "../../../contexts/lock-context";
import { BigNumber, ethers } from "ethers";
import { toast } from "react-toastify";

export const ClientPaymentDetails = () => {
    const navigate = useNavigate();
    const { currentTransaction, transactions } = useContext(TransactionContext);
    const { balance } = useContext(BlockchainContext);
    const { signPayment } = useContext(UserContext);
    const { requestPassword } = useContext(LockContext);
    const [isBusy, setIsBusy] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const currentBalance = useRef(balance);

    if (currentTransaction == null) {
        navigate('/client/scan-payment');
    }

    useEffect(() => {
        console.log(transactions);
        console.log(currentTransaction.transactionId);
        if (transactions.find(el => el.id == currentTransaction.transactionId)) {
            setIsBusy(false);
            setIsConfirmed(true);
        }
    });

    console.log(currentTransaction);

    const authorizePayment = () => {
        requestPassword(async (key) => {
            try {
                setIsBusy(true);
                await signPayment(key, currentTransaction);
            } catch (err) {
                toast.error('Payment failed');
            } finally {
                setIsBusy(false);
            }
        })
        
        // console.log("//TODO: payment authorization callback");
        // navigate("/client/payment-receipt");
    }

    return (
        <div className="client-payment-details">
            <Header backPath="/client/home" />
            <h2 className="screen-title">Payment Details</h2>
            <div className="info-field">
                <span className="title">AMOUNT</span>
                <span>
                    <span className="payment-amount">{ parseFloat(ethers.utils.formatUnits(BigNumber.from(`${currentTransaction.price}`))).toFixed(2) }</span>
                    <span className="currency">MATIC</span>
                </span>
            </div>
            <div className="info-field">
                <span className="title">Remaining Balance</span>
                <span>
                    <span className="payment-remaining-amount">{ (currentBalance.current - parseFloat(ethers.utils.formatUnits(BigNumber.from(`${currentTransaction.price}`)))).toFixed(2)}</span>
                    <span className="currency">MATIC</span>
                </span>
            </div>
            <div className="info-field">
                <span className="title">Seller</span>
                <span className="caption">{ currentTransaction.storeName }</span>
                <span className="subcaption">{ currentTransaction.storeAddress && `${currentTransaction.storeAddress.slice(0, 10)}...${currentTransaction.storeAddress.slice(30, 40)}`}</span>
            </div>
            <div className="info-field">
                <span className="title">Service</span>
                <span className="caption">{ bytes32({ input: currentTransaction.serviceId }) }</span>
                <span className="subcaption">{ currentTransaction.serviceId.slice(0, 10) }...{ currentTransaction.serviceId.slice(55, 100) }</span>
            </div>

            <div className="authorization-wrap">
                {
                    isConfirmed ?
                        <>
                            <p className="confirmed-payment"><CheckCircleOutline className="status-icon"/> Payment confirmed</p>
                            <Link className="receipt-link" to={`/client/payment-receipt/${currentTransaction.transactionId}`}>View receipt <DoubleArrow/></Link>
                        </>
                    :
                    isBusy ?
                        <>
                            <p className="pending-confirmation"><img className="status-icon" src={Loader}/> Pending payment</p>
                            <span className="status-info">Waiting for confirmation</span>
                        </>
                    :
                    <Button
                        title="Authorize Payment"
                        type="full-size"
                        icon={<Fingerprint/>}
                        onClick={() => authorizePayment()}
                    />
                }
            </div>
        </div>
    );
};
