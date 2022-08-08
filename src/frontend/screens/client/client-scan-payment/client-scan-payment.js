import React, { createRef, useContext, useEffect, useRef, useState } from "react";
// import { QrReader } from 'react-qr-reader';
// import QrReader from 'react-qr-scanner'
import { Base64 } from 'js-base64';
import QrReader from 'modern-react-qr-reader'


import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../../components/header/header";
import { TransactionContext } from "../../../contexts/transaction-context";

export const ClientScanPayment = () => {
    const { setCurrentTransactionData } = useContext(TransactionContext);
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkCode = async (code) => {
        try {
            const codeData = JSON.parse(Base64.decode(code));
            if (codeData.length != 4) { return; }
            const [api, transactionId, serviceId, price] = codeData;
            const success = await setCurrentTransactionData(api, transactionId, serviceId, price);
            if (success) {
                navigate('/client/payment-details');
            }
        } catch(err) { return; }
    }

    return (
        <div className="client-scan-payment">
            <Header backPath="/client/home" />
            <h2 className="screen-title">Scan payment code</h2>

        <QrReader
          onScan={(res) => res != null && checkCode(res)}
          facingmode="environment"
        />
        {/* <p>{this.state.result}</p> */}
        </div>
    );
};
