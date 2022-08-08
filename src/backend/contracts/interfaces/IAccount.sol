// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IAccount {
    event KeyAdded(address indexed key);
    event KeyRemoved(address indexed key);

    event TransactionExecuted(
        address indexed recipientAddress,
        bytes32 indexed serviceID,
        bytes32 indexed recipientID,
        bytes32 transactionID,
        uint256 timestamp,
        uint256 amount
    );

    function addKey(address _paymentKey) external;

    function removeKey(address _paymentKey) external;

    function redeemApproval(
        bytes32 _transactionID,
        uint256 _amount,
        bytes32 _serviceID,
        bytes calldata _signature
    ) external returns (bool success);

    function isRegisteredKey(address _key)
        external
        view
        returns (bool isRegisterd);

    receive() external payable;

    function deposit() external payable;
}
