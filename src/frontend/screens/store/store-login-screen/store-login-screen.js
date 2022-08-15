import { createRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../components/button/button";
import { Header } from "../../../components/header/header";
import { Input } from "../../../components/input/input";
import { StoreContext } from "../../../contexts/store-context";

export const StoreLoginScreen = () => {
    const { login } = useContext(StoreContext);
    const navigate = useNavigate();

    const apiInputRef = createRef();
    const usernameInputRef = createRef();
    const passwordInputRef = createRef();

    const storeLogin = async () => {
        const api = apiInputRef.current.value;
        const username = usernameInputRef.current.value;
        const password = passwordInputRef.current.value;

        if (api == null || api.length == 0) {
            toast.error('Api address is empty');
            return;
        }

        if (username == null || username.length == 0) {
            toast.error('Username is empty');
            return;
        }

        if (password == null || password.length == 0) {
            toast.error('Password is empty');
            return;
        }

        const res = await login(api, username, password);

        if (res == false) {
            toast.error('Invalid credentials');
            return;
        }

        navigate('/store/home');
    }

    return (
        <div className="store-login-screen">
            <Header showProfile={false} />

            <div className="login-wrap">
                <div className="info-field">
                    <p className="title">API</p>
                    <Input
                        inputRef={apiInputRef}
                        type="text"
                        defaultValue="https://polycard.3327.io/api"
                    />
                </div>
                <div className="info-field">
                    <p className="title">Username</p>
                    <Input
                        inputRef={usernameInputRef}
                        type="text"
                        defaultValue="admin"
                    />
                </div>
                <div className="info-field">
                    <p className="title">Pasword</p>
                    <Input
                        inputRef={passwordInputRef}
                        type="password"
                        defaultValue="admin"
                    />
                </div>
                <Button onClick={() => storeLogin()} type="full-size" title="Login" />
            </div>
        </div>
    )
}