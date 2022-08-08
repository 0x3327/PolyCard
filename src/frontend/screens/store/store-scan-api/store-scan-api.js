import React, { useState } from 'react';
import QrReader from 'modern-react-qr-reader'
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/header/header';

export const StoreScanApi = () => {
    const navigate = useNavigate();

    const checkCode = (code) => {
        navigate("/store/login"); // !!!!!!!
    }

    return (
        <div className="store-scan-api">
            <Header backPath="/store/init" showProfile={false}/>
            <h2 className="screen-title">Scan api code</h2>

        <QrReader
          onScan={(res) => res != null && checkCode(res)}
          facingmode="environment"
        />
        </div>
    );
}