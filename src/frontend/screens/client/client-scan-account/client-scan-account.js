import React, { useContext, useState } from 'react';
import QrReader from 'modern-react-qr-reader'
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/header/header';
import { UserContext } from '../../../contexts/user-context';

export const ClientScanAccount = () => {
    const navigate = useNavigate();
    const { initAccount } = useContext(UserContext);

    const checkCode = (code) => {
        try {
            const codeData = JSON.parse(code);
            if (codeData.length != 3) { return; }
            const [key, accountId, blockNum] = codeData;
            initAccount(key, accountId, blockNum);
            navigate("/client/create-pin");
        } catch(err) { return; }
    }

    return (
        <div className="client-scan-account">
            <Header backPath="/client/init" showProfile={false}/>
            <h2 className="screen-title">Scan account code</h2>

        <QrReader
          onScan={(res) => res != null && checkCode(res)}
          facingmode="environment"
        />
        </div>
    );
}