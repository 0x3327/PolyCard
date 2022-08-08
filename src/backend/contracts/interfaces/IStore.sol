// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IStore {
    event ServiceIssued(
        bytes32 indexed serviceID,
        address indexed buyerAccount,
        uint256 price,
        uint256 timestamp
    );

    event StoreIDUpdated(bytes32 oldStoreID, bytes32 newStoreID);

    function getStoreID() external view returns (bytes32 storeID);

    function setStoreID(bytes32 _storeID) external;

    function getPurchaseData(bytes32 _transactionID)
        external
        view
        returns (PurchaseData memory purchaseData);

    function issueService(
        address _buyerAccount,
        uint256 _price,
        bytes32 _transactionID,
        bytes32 _serviceID,
        bytes calldata _signature
    ) external;

    struct PurchaseData {
        address buyer;
        uint256 price;
        uint256 timestamp;
        bytes32 serviceID;
    }
}
