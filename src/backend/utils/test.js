const web3Service = require('../services/web3-service').getInstance();
const { ethers } = require('ethers');
const dbService = require('../services/db-service');
const utils = require('./index');

const card = new ethers.Wallet(process.env.PK_LOCAL_BUYER, web3Service.provider);

function getContractData() {
    const accountAddress = web3Service.getAccountAddress();
    const storeAddress = web3Service.getStoreAddress();

    return {
        accountAddress,
        storeAddress,
    }
}

function getPurchaseData(storeAddress) {
    const purchaseID = utils.getRandom32BytesHexString();
    console.log(`Preparing purchase with purchaseID ${purchaseID}`);
    const serviceID = '0x67656e6572616c207061796d656e740000000000000000000000000000000000';
    const price = ethers.BigNumber.from('100000000000000');

    const hashToSign = utils.createPaymentSignatureHash(purchaseID, serviceID, price, storeAddress);
    console.log(`Hash to sign ${hashToSign}\n`);

    return {
        purchaseID,
        serviceID,
        price,
        hashToSign,
    }
}

async function validateSignature(hashToSign, signature) {
    console.log(`Signature ${signature}`);
    const recoveredAddress = ethers.utils.verifyMessage(
        ethers.utils.arrayify(hashToSign),
        signature,
    );
    console.log(`Recovered address: ${recoveredAddress}`);
    console.log(`Signer address:    ${card.address}\n`);

    const isRegisteredKey = await web3Service.isRegisteredKey(card.address);
    console.log(`The recovered key is${isRegisteredKey ? '' : 'n\'t'} registered`);
}

function getEvents() {
    const storeEvents = web3Service.getStoreSales();
    const accountEvents = web3Service.getAccountTransactions();
    console.log(storeEvents);
    console.log(accountEvents);
}

async function checkServiceIssued(purchaseID) {
    const {
        buyer,
        price,
        timestamp,
        serviceID,
    } = await web3Service.getPurchaseData(purchaseID);

    console.log('Issued service data:');
    console.log(JSON.stringify({
        buyer,
        price: price.toString(),
        timestamp: timestamp.toString(),
        serviceID
    }, null, 4));
    console.log();
}

async function main() {
    const {
        storeAddress,
        accountAddress
    } = getContractData();

    // Create purchase record
    const {
        purchaseID,
        serviceID,
        price,
        hashToSign
    } = getPurchaseData(storeAddress);

    // Sign purchase record
    const signature = await card.signMessage(
        ethers.utils.arrayify(hashToSign)
    );

    // Validate signature
    await validateSignature(hashToSign, signature);

    // Get initial events from Account and Store
    // getEvents();

    const feeData = await web3Service.getFeeData();
    // console.log(feeData);

    await checkServiceIssued(purchaseID)

    // TODO Submit purchase request
    console.log('Calling issue service transaction...');
    const tx = await web3Service.issueService(accountAddress, price, purchaseID, serviceID, signature);
    console.log('Finished issue service call!\n');
    // console.log(JSON.stringify(tx, null, 4));

    // TODO Check final balance of buyer and seller

    // Check that the service is issued
    await checkServiceIssued(purchaseID)

    // Check events
    // Check store owner balance
    // Check account balance

    // const finalStoreEvents = web3Service.getStoreSales();
    // const finalAccountEvents = web3Service.getAccountTransactions();
    // console.log('Final store events', finalStoreEvents);
    // console.log('Final account events', finalAccountEvents);

}

main();
