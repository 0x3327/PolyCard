import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/header/header";
import { Button } from "../../../components/button/button";
import { CardInfo } from "../../../components/card-info/card-info";
import { TransactionList } from "../../../components/transaction-list/transaction-list";
import { QrCode } from "@mui/icons-material";
import { useContext } from "react";
import { BlockchainContext } from "../../../contexts/blockchain-context";

export const ClientHome = () => {
    const navigate = useNavigate();
    const { balance } = useContext(BlockchainContext);

    return (
        <div className="client-home">
        <Header/>
            <CardInfo balance={balance} currency="MATIC"/>
            <Button
                type='full-size'
                icon={<QrCode/>}
                title="Scan Payment Code"
                onClick={() => {
                    navigate("/client/scan-payment");
                }}
            ></Button>
            <TransactionList/>
        </div>
    );
};
