import { createContext, useContext } from "react";
import { Base64 } from 'js-base64';
import QRCode from 'qrcode';
import { UserContext } from "./user-context";

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

    return (
        <QRContext.Provider value={{ generateAccountCode, generatePaymentCode }}>
            { children }
        </QRContext.Provider>
    )
}

export default QRContextProvider;