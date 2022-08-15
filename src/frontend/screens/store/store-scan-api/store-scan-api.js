import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/header/header';
import CustomQrReader from '../../../components/qr-reader/qr-reader';

export const StoreScanApi = () => {
    const navigate = useNavigate();

    const checkCode = (code) => {
        navigate("/store/login"); // !!!!!!!
    }

    return (
        <div className="store-scan-api">
            <Header backPath="/store/init" showProfile={false} />
            <h2 className="screen-title">Scan api code</h2>

            <CustomQrReader
                onScan={(res) => res != null && checkCode(res)}
            />
        </div>
    );
}