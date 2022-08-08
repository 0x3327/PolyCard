import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/button/button";
import { Logo } from "../../../components/logo/logo";
import { ethers } from "ethers";
import { useContext } from "react";
import { BlockchainContext } from "../../../contexts/blockchain-context";

export const StoreInitScreen = () => {
    const navigate = useNavigate();
    const context = useContext(BlockchainContext);

    return (
        <div className="store-init-screen">
            <Logo />
            <p className="subtitle">POS TERMINAL</p>

            <div className="login-options">
                <Button
                    title="Login to account"
                    onClick={() => navigate("/store/login")}
                />
            </div>
        </div>
    );
};