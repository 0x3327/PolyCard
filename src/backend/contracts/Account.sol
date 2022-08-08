// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IAccount.sol";
import "./interfaces/IStore.sol";

contract Account is Ownable, ReentrancyGuard, IAccount {
    using ECDSA for bytes32;

    mapping(address => bool) public registeredKeys;

    /**
     * @notice Key already registered, cannot add it again
     */
    error KeyAlreadyRegistered();

    /**
     * @notice Key is not registered, cannot remove it
     */
    error KeyNotRegistered();

    /**
     * @notice Invalid signature. The data is not signed by a valid transactional key.
     */
    error InvalidSignature();

    /**
     * @notice Service not issued. The store contract did not issue the requested service.
     */
    error ServiceNotIssued();

    /**
     * @notice Payment Failed. Transferring funds to the seller failed.
     */
    error PaymentFailed();

    constructor(address _paymentKey) payable {
        if (_paymentKey != address(0)) {
            registeredKeys[_paymentKey] = true;
            emit KeyAdded(_paymentKey);
        }

        if (msg.value != 0) {
            emit TransactionExecuted(
                address(this),
                bytes32(0),
                bytes32(0),
                bytes32(0),
                block.timestamp,
                msg.value
            );
        }
    }

    function addKey(address _paymentKey) public onlyOwner {
        if (!registeredKeys[_paymentKey]) revert KeyAlreadyRegistered();

        registeredKeys[_paymentKey] = true;
        emit KeyAdded(_paymentKey);
    }

    function removeKey(address _paymentKey) public onlyOwner {
        if (!registeredKeys[_paymentKey]) revert KeyAlreadyRegistered();

        registeredKeys[_paymentKey] = true;
        emit KeyRemoved(_paymentKey);
    }

    function isRegisteredKey(address _key)
        public
        view
        returns (bool isRegisterd)
    {
        return registeredKeys[_key];
    }

    function redeemApproval(
        bytes32 _transactionID,
        uint256 _amount,
        bytes32 _serviceID,
        bytes calldata _signature
    ) public nonReentrant returns (bool success) {
        bytes32 messageHash = keccak256(
            abi.encode(_transactionID, _serviceID, _amount, msg.sender)
        );

        if (
            !registeredKeys[
                messageHash.toEthSignedMessageHash().recover(_signature)
            ]
        ) revert InvalidSignature();

        if (
            IStore(msg.sender).getPurchaseData(_transactionID).serviceID !=
            _serviceID
        ) revert ServiceNotIssued();

        if (
            IStore(msg.sender).getPurchaseData(_transactionID).buyer !=
            address(this)
        ) revert ServiceNotIssued();

        (success, ) = msg.sender.call{value: _amount}("");
        if (!success) {
            revert PaymentFailed();
        }

        emit TransactionExecuted(
            msg.sender,
            _serviceID,
            IStore(msg.sender).getStoreID(),
            _transactionID,
            block.timestamp,
            _amount
        );

        return true;
    }

    function deposit() public payable {
        if (msg.value != 0) {
            emit TransactionExecuted(
                address(this),
                bytes32(0),
                bytes32(0),
                bytes32(0),
                block.timestamp,
                msg.value
            );
        }
    }

    receive() external payable {
        if (msg.value != 0) {
            emit TransactionExecuted(
                address(this),
                bytes32(0),
                bytes32(0),
                bytes32(0),
                block.timestamp,
                msg.value
            );
        }
    }
}
