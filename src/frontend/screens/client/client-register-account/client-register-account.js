import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";    
import { UserContext } from "../../../contexts/user-context";

export const ClientRegisterAccount = () => {
    const navigate = useNavigate();
    const { createAccount } = useContext(UserContext);
    const amountInputRef = createRef();

    const register = async () => {
        const amount = ethers.utils.parseEther(amountInputRef.current.value);
        const res = await createAccount(amount);

        if (res) {
            navigate("/client/create-pin");
        }
    }

    return (
        <div className="client-register-account">
            <Header backPath="/client/init" showProfile={false}/>
            <h2 className="screen-title">Account Registration</h2>
            
            <div className="info-field">
                <span className="title">Deposit Sum</span>
                <Input type="number" inputRef={amountInputRef} unit="MATIC"/>
            </div>

            <Button
                title={"Create Account"}
                type="full-size"
                onClick={() => {
                    register()
                }}
            />
        </div>
    );
};
