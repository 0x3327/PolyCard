import React, { useContext, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { TransactionContext } from "../../../contexts/transaction-context";
import bytes32 from 'bytes32';

export const ClientPaymentReceipt = () => {
    const navigate = useNavigate();
    const { getTransaction, transactions } = useContext(TransactionContext)
    const { paymentId } = useParams();
    const [isQrVisible, setIsQrVisible] = useState(false);
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        if (transactions.length > 0) {
            setPayment(getTransaction(paymentId));
        }
    }, [transactions])

    return (
            <div className="client-payment-receipt">
                { isQrVisible &&
                    <div className="qr-modal" onClick={() => setIsQrVisible(false)}>
                        <img className="qr-code" src="https://play-lh.googleusercontent.com/ufwUy4SGVTqCs8fcp6Ajxfpae0bNImN1Rq2cXUjWI7jlmNMCsXgQE5C3yUEzBu5Gadkz"></img>        
                    </div>
                }
                <Header backPath="/client/home" />
                { payment ?
                    <>
                        <h2 className="screen-title">Payment Receipt</h2>
                        <div className="qr-wrap">
                            <img 
                                className="qr-code" 
                                src="https://play-lh.googleusercontent.com/ufwUy4SGVTqCs8fcp6Ajxfpae0bNImN1Rq2cXUjWI7jlmNMCsXgQE5C3yUEzBu5Gadkz"
                                onClick={() => setIsQrVisible(true)}
                            />
                            <span>Click to zoom in</span>
                        </div>
                        <div className="info-field">
                            <span className="title">Payment ID</span>
                            <span className="caption small">{ paymentId && `${paymentId.slice(0,10)}...${paymentId.slice(50, 100)}` }</span>
                        </div>
                        <div className="info-field">
                            <span className="title">AMOUNT</span>
                            <span>
                                <span className="payment-amount">{ payment.amount }</span>
                                <span className="currency">MATIC</span>
                            </span>
                        </div>
                        <div className="info-field">
                            <span className="title">Seller</span>
                            <span className="caption">{ payment.receiver == '0x0000000000000000000000000000000000000000000000000000000000000000' ? 'My account' : bytes32({ input: payment.receiver })}</span>
                            <span className="subcaption">{ payment.receiver.slice(0, 10) }...{ payment.receiver.slice(55, 100) }</span>
                        </div>
                        <div className="info-field">
                            <span className="title">Service</span>
                            <span className="caption">{ payment.serviceID == '0x0000000000000000000000000000000000000000000000000000000000000000' ? 'Deposit' : bytes32({ input: payment.serviceID })}</span>
                            <span className="subcaption">{ payment.serviceID.slice(0, 10) }...{ payment.serviceID.slice(55, 100) }</span>
                        </div>
                        <div className="info-field">
                            <span className="title">Timestamp</span>
                            <span className="caption">{ payment.date}</span>
                        </div>
                    </>
                :
                    <p>Loading...</p>
            }
        </div>
    );
};
