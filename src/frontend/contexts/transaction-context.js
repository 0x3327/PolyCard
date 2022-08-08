import { useState, createContext, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { BlockchainContext } from "./blockchain-context";
import { UserContext } from "./user-context";

export const TransactionContext = createContext();

const TransactionContextProvider = ({ children }) => {
    const { blockNumber, accountId } = useContext(UserContext);
    const { fetchAccountEvents, contractsLoaded, bnToEth } = useContext(BlockchainContext);
    const [transactions, setTransactions] = useState([]);
    const isBusy = useRef(false);
    const isLoaded = useRef(false);
    
    const loadedTransactions = useRef(null);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    const clearTransactions = () => {
        loadedTransactions.current = null;
        isLoaded.current = false;
        setTransactions([]);
    }

    const onEvent = (
        recipientAddress,
        serviceID,
        recipientID,
        transactionID,
        timestamp,
        amount
    ) => {
        console.log(
            recipientAddress,
            serviceID,
            recipientID,
            transactionID,
            timestamp,
            amount
        );

        if (
            (transactionID == '0x0000000000000000000000000000000000000000000000000000000000000000' && !loadedTransactions.current.find(t => t.id == timestamp))
            || (loadedTransactions.current.find(t => t.id == transactionID) == null)) {

            loadedTransactions.current = [...loadedTransactions.current, {
                id: transactionID,
                serviceID,
                isDeposit: transactionID == 0,
                receiver: recipientID,
                date: new Date(timestamp * 1000).toISOString().split('.')[0].replace('T', ' '),
                amount: bnToEth(amount),
                currency: 'MATIC',
                timestamp,
            }];
        }

        setTransactions(loadedTransactions.current);
    }

    const fetchTransactions = async () => {
        const events = await fetchAccountEvents(accountId, blockNumber, onEvent);
        console.log(events);

        const preparedTransactions = events.map(({ transactionID, recipientID, serviceID, timestamp, amount }) => (
            {
                id: transactionID,
                serviceID,
                isDeposit: transactionID == 0,
                receiver: recipientID,
                date: new Date(timestamp * 1000).toISOString().split('.')[0].replace('T', ' '),
                amount: bnToEth(amount),
                currency: 'MATIC',
                timestamp,
            }
        ))

        loadedTransactions.current = preparedTransactions;
        isLoaded.current = true;
        setTransactions(loadedTransactions.current);
    }

    const setCurrentTransactionData = async (api, transactionId, serviceId, price ) => {
        try {
            const res = await axios.get(`${api}/info`);
            const { storeAddress, storeId, storeName } = res.data;
            console.log(res.data);
            setCurrentTransaction({
                storeAddress, 
                storeId, 
                storeName,
                api, 
                transactionId, 
                serviceId, 
                price
            });
            return true;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    useEffect(() => {
        console.log(blockNumber);
        console.log(!isBusy.current , !isLoaded.current , blockNumber !== null, contractsLoaded);
        if (!isBusy.current && !isLoaded.current && blockNumber !== null && contractsLoaded) {
            isBusy.current = true;
            fetchTransactions();
            isBusy.current = false;
        }

        // setTransactions([
        //     {
        //         id: '122S7GF',
        //         isDeposit: false,
        //         receiver: 'MAXI ONLINE',
        //         date: '01/01/2022 12:34',
        //         amount: 20,
        //         currency: 'MATIC'
        //     },
        //     {
        //         id: 'ABC8S7GF',
        //         isDeposit: false,
        //         receiver: 'COFFE SHOP',
        //         date: '01/01/2022 12:34',
        //         amount: 0.5,
        //         currency: 'SOL'
        //     },
        //     {
        //         id: '1DC8S7GF',
        //         isDeposit: true,
        //         date: '01/01/2022 12:34',
        //         amount: 0.01,
        //         currency: 'ETH'
        //     },
        //     {
        //         id: '1223S7GF',
        //         isDeposit: false,
        //         receiver: 'BUS PLUS',
        //         date: '01/01/2022 12:34',
        //         amount: 11.1,
        //         currency: 'MATIC'
        //     },
        //     {
        //         id: '23C8S7GF',
        //         isDeposit: false,
        //         receiver: 'MAXI ONLINE',
        //         date: '01/01/2022 12:34',
        //         amount: 20,
        //         currency: 'MATIC'
        //     },
        // ])
    }, [blockNumber, contractsLoaded])

    const getTransaction = (paymentId) => {
        return transactions.find(el => el.id == paymentId);
    }

    return (
        <TransactionContext.Provider value={{ transactions: transactions || [], currentTransaction, setCurrentTransactionData, getTransaction, clearTransactions }}>
            { children }
        </TransactionContext.Provider>
    )
}

export default TransactionContextProvider;