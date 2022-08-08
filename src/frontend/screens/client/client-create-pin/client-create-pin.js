import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import PinField from "react-pin-field";

import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { UserContext } from "../../../contexts/user-context";
import { toast } from "react-toastify";
import { Input } from "../../../components/input/input";

export const ClientCreatePin = () => {
    
    const { accountId, setPassword } = useContext(UserContext);

    const passwordRef = createRef();
    const confirmPasswordRef = createRef();

    const navigate = useNavigate();

    if (accountId == null) {
        navigate('/client/init');
    }

    return (
        <div className="client-create-pin">
            <Header backPath="/client/init" showProfile={false}/>
            <h2 className="screen-title">Account Details</h2>
            <div className="account-info">
                <div className="info-field">
                    <h3 className="title">Account Number</h3>
                    <p className="account-id">{ accountId.slice(0, 10) }...{ accountId.slice(30, 40) }</p>
                </div>
            </div>
            <div className="pin-field-wrapper">
                <h2 className="screen-title">Create new password</h2>

                <div className="pin-field">
                    <Input type="password" inputRef={passwordRef} placeholder="password"/>
                </div>
                <h2 className="screen-title">Repeat new password</h2>

                <div className="pin-field">
                    <Input type="password" inputRef={confirmPasswordRef} placeholder="confirm password"/>
                </div>

                <Button
                    type="full-size"
                    title="Confirm New Password"
                    onClick={() => {
                        const pass = passwordRef.current.value;
                        const confirmPass = confirmPasswordRef.current.value;

                        if (pass.length == 0) {
                            toast.error("Please input password!");
                            return;
                        }

                        if (confirmPass.length == 0) {
                            toast.error("Please confirm password!");
                            return;
                        }

                        if (pass != confirmPass) {
                            toast.error("Passwords do not match");
                            return;
                        }

                        setPassword(pass);
                        navigate("/client/enter-pin");
                    }}
                />
            </div>
        </div>
    );
};
