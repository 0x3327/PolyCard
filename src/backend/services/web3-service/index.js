const ethers = require('ethers');
const fs = require('fs');
const axios = require('axios');
require("dotenv").config();

const utils = require("../../utils");

const supported_networks = ['mumbai', 'localhost'];

class Web3Service {
    constructor(_network) {
        this.provider = Web3Service.getProvider(_network);
        this.wallet = Web3Service.getWallet(_network, this.provider);
        this.network = _network;

        this.store = {};
        this.store.abi = Web3Service.getContractAbi("Store");
        this.store.address = Web3Service.getContractAddress("Store", _network);
        this.store.instance = Web3Service.getContractInstance(this.store.address, this.store.abi, this.wallet);

        this.account = {};
        this.account.abi = Web3Service.getContractAbi("Account");
        this.account.address = Web3Service.getContractAddress("Account", _network);
        this.account.instance = Web3Service.getContractInstance(this.account.address, this.account.abi, this.wallet);

        this.fetchStoreID();
    }

    static getProvider(_network) {
        switch (_network) {
            case 'mumbai': {
                const provider = new ethers.providers.AlchemyProvider(
                    'maticmum', process.env.ALCHEMY_MUMBAI_KEY,
                );

                return provider;
            }
            case 'localhost': {
                const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
                return provider;
            }
            default: {
                throw Error(`Network ${_network} is not supported, please use one of the following networks: ${supported_networks}`)
            }
        }
    }

    static getWallet(_network, _provider) {
        switch (_network) {
            case 'mumbai': {
                const wallet = new ethers.Wallet(process.env.PK_DEPLOYER, _provider);

                return wallet;
            }
            case 'localhost': {
                const wallet = new ethers.Wallet(process.env.PK_LOCAL_SELLER, _provider);

                return wallet;
            }
            default: {
                throw Error(`Network ${_network} is not supported, please use one of the following networks: ${supported_networks}`)
            }
        }
    }

    getWallet() {
        return this.wallet;
    }

    static getContractAbi(_contractName) {
        const abiPath = __dirname + `/../../artifacts/contracts/${_contractName}.sol/${_contractName}.json`
        const contractAbi = JSON.parse(fs.readFileSync(abiPath)).abi;

        return contractAbi;
    }

    static getContractAddress(_contractName, _network) {
        const addressPath = __dirname + `/../../addresses/${_contractName}-${_network}.json`
        const contractAddress = JSON.parse(fs.readFileSync(addressPath)).address;

        return contractAddress;
    }

    static getContractInstance(_address, _abi, _walletOrProvider) {
        const contract = new ethers.Contract(_address, _abi, _walletOrProvider);

        return contract;
    }

    getAccountAddress() {
        return this.account.address;
    }

    getStoreAddress() {
        return this.store.address;
    }

    async fetchStoreID() {
        this.store.ID = await this.store.instance.getStoreID();
        this.store.name = utils.convertBytes32ToString(this.store.ID);
    }

    async getStoreID() {
        if (!this.store.ID) await this.fetchStoreID();
        return this.store.ID;
    }

    async getStoreName() {
        if (!this.store.ID) await this.fetchStoreID();
        return this.store.name;
    }

    getStoreIDUpdates() {
        const events = this.store.instance.filters.StoreIDUpdated();
        return events;
    }

    getStoreSales() {
        const events = this.store.instance.filters.ServiceIssued();
        return events;
    }

    getAccountTransactions() {
        const events = this.account.instance.filters.TransactionExecuted();
        return events;
    }

    async updateStoreName(_newStoreName) {
        const oldStoreID = await this.getStoreID();
        const oldStoreName = await this.getStoreName();
        console.log(`oldStoreID: ${oldStoreID}`);
        console.log(`oldStoreName: ${oldStoreName}`);

        const encodedName = utils.convertStringToBytes32(_newStoreName);
        console.log(`New encoded name to be set: ${encodedName.toString()}`);

        const tx = await this.store.instance.setStoreID(encodedName);
        await this.provider.waitForTransaction(tx.hash);

        await this.fetchStoreID();
        const newStoreID = await this.getStoreID();
        const newStoreName = await this.getStoreName();
        console.log(`newStoreID: ${newStoreID}`);
        console.log(`newStoreName: ${newStoreName}`);
    }

    async issueService(_accountAddress, _price, _purchaseID, _serviceID, _signature) {
        const res = await axios.get('https://gasstation-mumbai.matic.today/v2');
        const gasPrice = res.data.fast.maxPriorityFee;

        const tx = await this.store.instance.issueService(
            _accountAddress,
            ethers.BigNumber.from(`${_price}`),
            _purchaseID,
            _serviceID,
            _signature, {
            gasLimit: 2000000,
            gasPrice: parseEther(gasPrice).toString(),
        }
        );

        return await tx.wait(1);
    }

    async getPurchaseData(_purchaseID) {
        return this.store.instance.getPurchaseData(_purchaseID);
    }


    async isRegisteredKey(_key) {
        return this.account.instance.isRegisteredKey(_key);
    }

    async getFeeData() {
        return this.provider.getFeeData();
    }
}

class Web3ServiceSingleton {
    constructor() {
        throw Error('Please use Web3Service.getInstance()');
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Web3Service(process.env.NODE_ENV);
        }

        return this.instance;
    }
}



module.exports = Web3ServiceSingleton;