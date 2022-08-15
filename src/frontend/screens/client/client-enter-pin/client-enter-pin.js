import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import PinField from "react-pin-field";

import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { UserContext } from "../../../contexts/user-context";
import { Input } from "../../../components/input/input";
import { toast } from "react-toastify";

export const ClientEnterPin = () => {
    const navigate = useNavigate();
    const { isPasswordValid, accountId, removeAccount } = useContext(UserContext);

    if (accountId == null) {
        navigate('/client/init');
    }

    const passwordRef = createRef();

    const resetAccount = () => {
        removeAccount();
        navigate('/client/init');
    }

    const login = () => {
        const password = passwordRef.current.value;

        if (!isPasswordValid(password)) {
            toast.error('Incorrect password');
            return;
        }

        navigate('/client/home');
    }

    return (
        <div className="client-enter-pin">
            <Header backPath="/client/init" showProfile={false} />

            <div className="pin-field-wrapper">
                <p>Enter password</p>
                <div className="pin-field">
                    <Input type="password" inputRef={passwordRef} placeholder="password" />
                </div>
                <Button title="Login" onClick={() => login()} />
                <a href="#" onClick={() => resetAccount()}>Reset account</a>
            </div>
        </div>

    );
};
