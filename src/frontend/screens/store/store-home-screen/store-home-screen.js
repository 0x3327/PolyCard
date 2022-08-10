import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../contexts/store-context";
import { toast } from "react-toastify";
import { ethers } from "ethers";

export const StoreHomeScreen = () => {
    const { services, selectedService, setSelectedService, generatePaymentCode, jwt } = useContext(StoreContext);
    const [amount, setAmount] = useState(0.00);
    const [paymentCode, setPaymentCode] = useState(null);
    const [strAmount, setStrAmount] = useState('0.00');
    const [isQrVisible, setIsQrVisible] = useState(false);

    const navigate = useNavigate();

    const addDigitAmount = (digit) => {
        const newAmount = ((amount * 100) * 10 + digit) / 100;
        setAmount(newAmount);
        setStrAmount(newAmount.toLocaleString('en-US', {minimumFractionDigits: 2}))
    }

    const removeLastDigit = () => {
        const newAmount = Math.floor(amount * 10 ) / 100;
        setAmount(newAmount);
        setStrAmount(newAmount.toLocaleString('en-US', {minimumFractionDigits: 2}))
    }

    const clearAmount = () => {
        setAmount(0.00);
        setStrAmount('0.00');
    }

    const generatePayment = async () => {
        const service = services[selectedService];
        const { id: serviceId, price: servicePrice } = service;
        
        let price
        if (servicePrice == null) {
            price = ethers.utils.parseEther(`${amount}`).toString();
        } else {
            price = servicePrice;
        }
        
        const code = await generatePaymentCode(serviceId, price);

        if (code == null) {
            toast.error('Failed to generate payment code');
            return;
        }

        setPaymentCode(code);
        setIsQrVisible(true)
    }

    useEffect(() => {
        if (jwt == null) {
            navigate('/store/login');
        }
    }, [jwt])

    return (
        <div className="store-home-screen">
            { jwt != null &&
            <>
                { isQrVisible &&
                    <div className="qr-modal" onClick={() => setIsQrVisible(false)}>
                        <img className="qr-code" src={paymentCode}></img>        
                    </div>
                }
                <Header profilePath="/store/user-profile"/>
                <div className="info-field">
                    <p className="title">Service</p>
                    <select
                        onChange={(e) => setSelectedService(parseInt(e.target.value))}
                        defaultValue={selectedService}
                    >
                        {
                            services.map((service, index) => (
                                <option key={service.id} value={index}>{ service.title }</option>
                            ))
                        }
                    </select>
                </div>

                <div className="info-field">
                    <p className="title">Amount</p>
                    <Input 
                        type="text" 
                        className="payment-amount-input" 
                        value={services[selectedService].price != null ? parseFloat(ethers.utils.formatEther(`${services[selectedService].price}`)).toFixed(2) : strAmount}
                        unit="MATIC"
                    />
                </div>
                { services[selectedService].price == null && 
                    <div className="keyboard-panel">
                        <Button title="7" onClick={() => addDigitAmount(7)}/>
                        <Button title="8" onClick={() => addDigitAmount(8)}/>
                        <Button title="9" onClick={() => addDigitAmount(9)}/>
                        <Button title="4" onClick={() => addDigitAmount(4)}/>
                        <Button title="5" onClick={() => addDigitAmount(5)}/>
                        <Button title="6" onClick={() => addDigitAmount(6)}/>
                        <Button title="1" onClick={() => addDigitAmount(1)}/>
                        <Button title="2" onClick={() => addDigitAmount(2)}/>
                        <Button title="3" onClick={() => addDigitAmount(3)}/>
                        <div className="zero-wrap">
                            <Button title="<<" onClick={() => removeLastDigit()}/>
                            <Button title="0" onClick={() => addDigitAmount(0)}/>
                            <Button title="CLEAR" onClick={() => clearAmount()}/>
                        </div>
                    </div>
                }
                <Button type="full-size" title="Generate payment code" onClick={() => generatePayment()}/>
            </>
            }
        </div>
    )
}