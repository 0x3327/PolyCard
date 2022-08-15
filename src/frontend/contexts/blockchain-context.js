import { createContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";

// Contract ABIs
import ACCOUNT_ABI from "../../backend/artifacts/contracts/Account.sol/Account.json";
import { toast } from "react-toastify";
// import ACCOUNT_ADDR from "../../backend/addresses/Account-localhost.json";

export const BlockchainContext = createContext();

// Constants
const SUPPORTED_CHAIN_ID = [80001, 1337, 137];

const BlockchainContextProvider = ({ children }) => {
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [isMetamaskProvider, setIsMetamaskProvider] = useState(null);
    const [contractsLoaded, setContractsLoaded] = useState(false);

    const isBusy = useRef(false);

    const provider = useRef(null);
    const signer = useRef(null);

    const contracts = useRef(null);

    useEffect(() => {
        if (!isBusy.current && address == null) {
            isBusy.current = true;
            connectToProvider();
            isBusy.current = false;
        }
    }, []);

    /**
     * Initialize contract handlers
     */
    const initContractHandlers = async (address) => {
        //method to create handlers for every contract in the src/contracts
        contracts.current = {
            account: new ethers.Contract(
                address,
                ACCOUNT_ABI.abi,
                provider.current
            ).connect(signer.current),
        };

        setContractsLoaded(true);
    };

    const resetContractHandlers = () => {
        contracts.current = null;
    }

    /**
     * Connect to metamask extension
     * @returns
     */
    const connectToProvider = async () => {
        let metamaskProvider = null;
        if (window.ethereum != null) {
            await window.ethereum.enable();
            metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
        }

        if (metamaskProvider != null) {
            provider.current = metamaskProvider;
        } else {
            provider.current = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today/');

        }

        await provider.current.getBlockNumber();


        const { chainId } = await provider.current.getNetwork();
        if (SUPPORTED_CHAIN_ID.includes(chainId) === false) {
            window.alert(
                "NETWORK not supported ! : Switch to Polygon Testnet (chainId: 80001) or localhost (chainId: 1337)!"
            );
            return;
        }

        setIsMetamaskProvider(metamaskProvider != null);

        signer.current = provider.current.getSigner();

        // initContractHandlers();
    };

    /**
     * Contract call example
     */
    const contractLock_withdrawCall = async () => {
        //call the contract method
        const resp = await this.state.contractHandlers.lock.withdraw();

        window.alert(
            `contractLock_withdrawCall::resp: ${JSON.stringify(resp)}`
        );
    };

    const bnToEth = (bn) => {
        return ethers.utils.formatEther(bn);
    }

    const deployAccount = async (publicTransactionKey, depositAmount) => {
        const AccountFactory = new ethers.ContractFactory(ACCOUNT_ABI.abi, ACCOUNT_ABI.bytecode, signer.current);
        const account = await AccountFactory.deploy(publicTransactionKey, { value: depositAmount });
        await account.deployed();
        setContractsLoaded(false);
        const blockNum = (await provider.current.getBlockNumber()) - 2;
        return { address: account.address, blockNum };
    }

    const findBalance = async (address, listener) => {
        const bal = await provider.current.getBalance(address);
        const parsedBalance = bnToEth(bal);
        setBalance(parseFloat(parsedBalance).toFixed(2));
    }

    const fetchAccountEvents = async (address, fromBlockNum, listener) => {
        const toBlockNum = (await provider.current.getBlockNumber());
        console.log(toBlockNum);

        const res = await contracts.current.account.queryFilter('TransactionExecuted', fromBlockNum, toBlockNum - 1);
        contracts.current.account.on('TransactionExecuted', (...args) => {
            const [
                recipientAddress,
                serviceID,
                recipientID,
                transactionID,
                timestamp,
                amount,
                event,
            ] = args;

            console.log(event);

            if (event.blockNumber >= toBlockNum) {
                toast.success('New payment processed');
                findBalance(address);
                listener(
                    recipientAddress,
                    serviceID,
                    recipientID,
                    transactionID,
                    timestamp,
                    amount
                )
            }
        });
        return res.map(event => event.args);
    }

    const createRandomWallet = () => {
        return ethers.Wallet.createRandom();
    }

    return (
        <BlockchainContext.Provider
            value={{
                provider: provider.current,
                address,
                setAddress,
                findBalance,
                balance,
                setBalance,
                connectToProvider,
                contractLock_withdrawCall,
                isMetamaskProvider,
                ACCOUNT_ABI,
                fetchAccountEvents,
                contractsLoaded,
                bnToEth,
                deployAccount,
                createRandomWallet,
                initContractHandlers,
                resetContractHandlers,
            }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};

export default BlockchainContextProvider;
