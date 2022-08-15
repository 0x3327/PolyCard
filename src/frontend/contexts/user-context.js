import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";
import utils from "../utils";
import { BlockchainContext } from "./blockchain-context";
import { BigNumber, ethers } from "ethers";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const { provider, findBalance, deployAccount, createRandomWallet, initContractHandlers, resetContractHandlers } = useContext(BlockchainContext);
    const [encryptedTransactionKey, setEncryptedTransactionKey] = useState(null);
    const [accountId, setAccountId] = useState(null);
    const [keyHash, setKeyHash] = useState(null);
    const [blockNumber, setBlockNumber] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['account']);

    const tmpKey = useRef(null);

    const tryInit = async () => {
        if (cookies.account != null && accountId == null && provider != null) {
            const {
                accountId: storedAccountId,
                encryptedTransactionKey: storedEncryptedTransactionKey,
                keyHash,
                blockNumber: storedBlockNumber
            } = cookies.account;

            setAccountId(storedAccountId);
            setEncryptedTransactionKey(storedEncryptedTransactionKey);
            setKeyHash(keyHash);
            setBlockNumber(storedBlockNumber);
            findBalance(storedAccountId);

            await initContractHandlers(storedAccountId);
        }
    }

    const createAccount = async (depositAmount) => {
        const toastId = toast('Creating account', { isLoading: true, autoClose: false });
        try {
            const { address, privateKey: transactionKey } = createRandomWallet();
            const { address: accountId, blockNum } = await deployAccount(address, depositAmount);

            console.log(transactionKey);
            initContractHandlers(accountId);
            initAccount(transactionKey.split('0x')[1], accountId, blockNum);
            toast.update(toastId, { render: 'Account created', type: toast.TYPE.SUCCESS, autoClose: 2000, isLoading: false });
            return true;
        } catch (err) {
            console.log(err);
            toast.update(toastId, { render: 'Failed to create account, check your balance', type: toast.TYPE.ERROR, autoClose: 2000, isLoading: false });
            return false;
        }
    }

    const setEncryptedKey = (privateKey, password) => {
        const encryptedKey = utils.aesEncryptKey(privateKey, password);
        const hash = utils.sha3(privateKey);

        setCookie('account', JSON.stringify({ accountId, encryptedTransactionKey: encryptedKey, keyHash: hash, blockNumber }))
        setKeyHash(hash);

        setEncryptedTransactionKey(encryptedKey);
        setAccountId(accountId);
    }

    const isPasswordValid = (password) => {
        const transactionKey = utils.aesDecryptKey(encryptedTransactionKey, password);
        if (utils.sha3(transactionKey) != keyHash) {
            return false;
        }
        return true;
    }

    const getTransactionKey = (password) => {
        return utils.aesDecryptKey(encryptedTransactionKey, password);
    }

    const initAccount = (transactionKey, accountId, blockNum) => {
        tmpKey.current = transactionKey;
        setAccountId(accountId);
        setBlockNumber(blockNum);

        findBalance(accountId);
    }

    const setPassword = (password) => {
        setEncryptedKey(tmpKey.current, password);
        tmpKey.current = null;
    }

    const removeAccount = () => {
        removeCookie('account');
        resetContractHandlers();
        setAccountId(null);
        setEncryptedTransactionKey(null);
    }

    const signPayment = async (key, payment) => {
        console.log(payment);
        const { api } = payment;

        console.log([payment.transactionId, payment.serviceId, BigNumber.from(`${payment.price}`), payment.storeAddress]);

        const msgPacked = ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'bytes32', 'uint256', 'address'],
            [payment.transactionId, payment.serviceId, BigNumber.from(`${payment.price}`), payment.storeAddress],
        );

        const msgHash = ethers.utils.keccak256(msgPacked);
        const wallet = new ethers.Wallet(key);

        const signature = await wallet.signMessage(
            ethers.utils.arrayify(`${msgHash}`)
        );

        const walletAddress = await wallet.getAddress();

        return axios.post(`${api}/approve_purchase`, {
            purchaseID: payment.transactionId,
            cardAddress: walletAddress,
            accountAddress: accountId,
            signature,
        });
    }

    useEffect(() => {
        if (provider != null) {
            tryInit();
        }
    }, [provider]);

    return (
        <UserContext.Provider value={
            {
                encryptedTransactionKey,
                accountId,
                keyHash,
                blockNumber,
                isPasswordValid,
                getTransactionKey,
                initAccount,
                setPassword,
                removeAccount,
                createAccount,
                signPayment,
            }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;