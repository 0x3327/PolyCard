import React, { useState, useEffect } from 'react';
import QrReader from 'modern-react-qr-reader';

const CustomQrReader = ({ onScan }) => {
    const [facingMode, setFacingMode] = useState('user');

    useEffect(() => {
        setFacingMode('environment');
    }, []);

    return (
        <QrReader onScan={onScan} facingMode={facingMode} />
    )
}

export default CustomQrReader;