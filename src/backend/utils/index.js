const ethers = require("ethers");

require("dotenv").config();

const fundAddresses = async (funder) => {
  await funder.sendTransaction({
    to: process.env.ADDR0,
    value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
  });

  return [process.env.ADDR0];
};

const convertStringToBytes32 = (string) => {
  return ethers.utils.formatBytes32String(string).toString();
};

const convertBytes32ToString = (bytes32) => {
  return ethers.utils.parseBytes32String(bytes32);;
};

const getRandom32BytesHexString = () => {
  return `0x${Buffer.from(ethers.utils.randomBytes(32)).toString('hex')}`;
}

const createPaymentSignatureHash = (_transactionID, _serviceID, _price, _sellerAddress) => {
  console.log([_transactionID, _serviceID, ethers.BigNumber.from(`${ _price}`), _sellerAddress]);
  return constructHash(
    ["bytes32", "bytes32", "uint256", "address"],
    [_transactionID, _serviceID, ethers.BigNumber.from(`${ _price}`), _sellerAddress]
  );
}

const constructHash = (types, values) => {
  const encoded = ethers.utils.defaultAbiCoder.encode(types, values);
  return ethers.utils.keccak256(encoded);
}

module.exports = {
  fundAddresses,
  convertStringToBytes32,
  convertBytes32ToString,
  getRandom32BytesHexString,
  createPaymentSignatureHash,
  constructHash,
};
