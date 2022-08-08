// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/IAccount.sol";
import "./interfaces/IStore.sol";

contract Store is Ownable, IStore {
    using ECDSA for bytes32;

    bytes32 public storeID;
    mapping(bytes32 => PurchaseData) purchases;

    /**
     * @notice Invalid StoreID. Cannot set empty value as StoreID.
     */
    error InvalidStoreID();

    /**
     * @notice Invalid signature. The data is not signed by a valid transactional key.
     */
    error InvalidSignature();

    /**
     * @notice Insufficient funds. The buyer's account does not have enough funds for payment.
     */
    error InsufficientFunds();

    /**
     * @notice The redeemal function failed to execute.
     */
    error RedeemalFailed();

    /**
     * @notice The buyer's account did not transfer the required funds during redeemal.
     */
    error FundsNotTransferred();

    /**
     * @notice Failed to transfer funds to owner's wallet after sale.
     */
    error TransferFailed();

    constructor(bytes32 _storeID) {
        storeID = _storeID;
    }

    function getStoreID() public view returns (bytes32) {
        return storeID;
    }

    function setStoreID(bytes32 _storeID) public onlyOwner {
        if (_storeID == bytes32(0)) revert InvalidStoreID();

        emit StoreIDUpdated(storeID, _storeID);

        storeID = _storeID;
    }

    function getPurchaseData(bytes32 _transactionID)
        public
        view
        returns (PurchaseData memory purchaseData)
    {
        return purchases[_transactionID];
    }

    function issueService(
        address _buyerAccount,
        uint256 _price,
        bytes32 _transactionID,
        bytes32 _serviceID,
        bytes calldata _signature
    ) public onlyOwner {
        if (_buyerAccount.balance < _price) revert InsufficientFunds();

        bytes32 messageHash = keccak256(
            abi.encode(_transactionID, _serviceID, _price, address(this))
        );

        address signer = messageHash.toEthSignedMessageHash().recover(
            _signature
        );

        if (!IAccount(payable(_buyerAccount)).isRegisteredKey(signer))
            revert InvalidSignature();

        purchases[_transactionID] = PurchaseData(
            _buyerAccount,
            _price,
            block.timestamp,
            _serviceID
        );

        uint256 initialBalance = address(this).balance;
        bool success = IAccount(payable(_buyerAccount)).redeemApproval(
            _transactionID,
            _price,
            _serviceID,
            _signature
        );

        if (!success) revert RedeemalFailed();

        if (initialBalance + _price != address(this).balance)
            revert FundsNotTransferred();

        (success, ) = owner().call{value: _price}("");
        if (!success) {
            revert TransferFailed();
        }

        emit ServiceIssued(_serviceID, _buyerAccount, _price, block.timestamp);
    }

    fallback() external payable {}

    receive() external payable {}
}
