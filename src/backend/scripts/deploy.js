const hre = require("hardhat");
const fs = require("fs");
const utils = require("../utils");

require("dotenv").config();

async function main() {
  const accounts = await hre.ethers.getSigners();
  let buyer, seller, txKey;

  if (hre.network.name === 'localhost') {
    [buyer, seller, txKey] = accounts;
  } else {
    buyer = seller = txKey = accounts[0];
  }

  console.log(`Using network ${hre.network.name}`);

  console.log(`\tBuyer address ${buyer.address}`);
  console.log(`\tSeller address ${seller.address}`);
  console.log(`\tBuyer txKey ${txKey.address}`);
  console.log('');

  // Deployment of Account.sol contract -------------------------------------
  const depositAmountString = "0.02"
  const depositAmountBN = hre.ethers.utils.parseEther(depositAmountString);

  const AccountFactory = await ethers.getContractFactory("Account", buyer);
  const Account = await AccountFactory.deploy(
    txKey.address,
    { value: depositAmountBN }
  );

  await Account.deployed();
  console.log(`Account with ${depositAmountString} ETH deployed to: ${Account.address}`);

  const accountOwner = await Account.owner();
  console.log(`\tGot owner:   ${accountOwner}`);

  // ------------------------------------- Deployment of Account.sol contract

  // Deployment of Store.sol contract -------------------------------------
  // Store name "PolyCard Testnet Store"
  const storeName = "0x506f6c794361726420546573746e65742053746f726500000000000000000000";
  const StoreFactory = await ethers.getContractFactory("Store", seller);
  const Store = await StoreFactory.deploy(storeName);

  await Store.deployed();
  console.log("Store deployed to:", Store.address);

  const storeID = await Store.getStoreID();
  const storeOwner = await Store.owner();
  console.log(`\tGot storeID: ${storeID}`);
  console.log(`\tGot owner:   ${storeOwner}`);

  // ------------------------------------- Deployment of Store.sol contract

  //record all contracts' addresses in the ./addresses folder - to be used by the frontend
  fs.writeFileSync(
    `./addresses/Account-${hre.network.name}.json`,
    JSON.stringify({ address: Account.address })
  );

  fs.writeFileSync(
    `./addresses/Store-${hre.network.name}.json`,
    JSON.stringify({ address: Store.address })
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
