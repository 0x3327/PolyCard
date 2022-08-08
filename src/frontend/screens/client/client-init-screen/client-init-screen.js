import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/button/button";
import { Logo } from "../../../components/logo/logo";
import { ethers } from "ethers";
import { useContext } from "react";
import { BlockchainContext } from "../../../contexts/blockchain-context";
import { UserContext } from "../../../contexts/user-context";

export const ClientInitScreen = () => {
    const navigate = useNavigate();
    const { connectToMetamask, isMetamaskProvider } = useContext(BlockchainContext);
    const { accountId } = useContext(UserContext);

    if (accountId != null) {
        navigate('/client/enter-pin');
    }

    return (
        <div className="client-init-screen">
            <Logo />

            <div className="login-options">
                <Button
                    title="Login to account"
                    onClick={() => navigate("/client/scan-account")}
                />
                { isMetamaskProvider &&
                    <Button
                        title="Register new account"
                        onClick={async () => {
                            navigate("/client/register-account");
                        }}
                    />
                }
            </div>
        </div>
    );
};

// const enterRegistration = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);

//     const { chainId } = await provider.getNetwork();
//     if (SUPPORTED_CHAIN_ID.includes(chainId) === false) {
//         window.alert(
//             "NETWORK not supported ! : Switch to Polygon Testnet (chainId: 80001) or localhost (chainId: 1337)!"
//         );
//         return false;
//     }
//     const signer = provider.getSigner();
//     const accounts = await provider.send("eth_requestAccounts", []);
//     const balance = await provider.getBalance(accounts[0]);
//     const balanceInEther = ethers.utils.formatEther(balance);
//     // const block = await provider.getBlockNumber();

//     this.app.setState({
//         ...this.state,
//         currentFSM_state: "/register-account",
//         provider,
//         signer,
//         address: accounts[0],
//         balance: balanceInEther,
//     });
// };
