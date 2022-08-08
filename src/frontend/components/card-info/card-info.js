import { useContext } from "react";
import { UserContext } from "../../contexts/user-context";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from "react-toastify";


export const CardInfo = ({ balance, currency }) => {
    const { accountId } = useContext(UserContext);

    return (
        <div className="card-info">
            <span className="card-info-title">Current Balance</span>
            <h2>{ balance } <span className="currency">{ currency }</span></h2>
            <CopyToClipboard 
                text={accountId}
                onCopy={() => toast.info('Account number coppied')}
            >
                <span className="contract-address">{accountId && (accountId.slice(0, 10))}...{accountId && (accountId.slice(30, 40))} CLICK TO COPY</span>
            </CopyToClipboard>
        </div>
    );
};
