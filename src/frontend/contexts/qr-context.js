import { createContext, useContext } from "react";
import { Base64 } from 'js-base64';
import QRCode from 'qrcode';
import { UserContext } from "./user-context";
import { ethers } from "ethers";

export const QRContext = createContext();

const QRContextProvider = ({ children }) => {
    const { encryptedTransactionKey, accountId, blockNumber } = useContext(UserContext);

    const generateAccountCode = async (key) => {
        if (encryptedTransactionKey == null || accountId == null) {
            return null;
        }

        const codeValue = JSON.stringify([ key, accountId, blockNumber ]);

        return QRCode.toDataURL(codeValue);
    }

    const generatePaymentCode = async (api, purchaseId, serviceId, price) => {
        const codeValue = Base64.encode(JSON.stringify([ api, purchaseId, serviceId, price ]));

        return QRCode.toDataURL(codeValue);
    }

    const generateReceiptCode = async (key, purchaseId) => {
        const wallet = new ethers.Wallet(key);

        const msgPacked = ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'address'],
            [purchaseId, accountId],
        );

        const signature = await wallet.signMessage(
            ethers.utils.arrayify(`0x${msgPacked}`)
        );
        const codeValue = Base64.encode(JSON.stringify([ purchaseId, accountId, signature ]));

        return QRCode.toDataURL(codeValue);
    }

    return (
        <QRContext.Provider value={{ generateAccountCode, generatePaymentCode, generateReceiptCode }}>
            { children }
        </QRContext.Provider>
    )
}

export default QRContextProvider;