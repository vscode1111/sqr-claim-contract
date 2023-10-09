// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/IPermitToken.sol";
import "./interfaces/IBalance.sol";

contract SQRClaim is OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable, IBalance {
  using ECDSA for bytes32;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _sqrToken) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();

    sqrToken = IPermitToken(_sqrToken);
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  //Variables, structs, modifiers, events------------------------

  IPermitToken public sqrToken;

  mapping(bytes32 => TransactionItem) private _transactionIds;

  struct TransactionItem {
    address account;
    uint256 amount;
  }

  event Claim(address indexed account, uint256 amount, bytes32 transactionIdHash, uint32 timestamp);

  //Functions-------------------------------------------

  function getBalance() public view returns (uint256) {
    return sqrToken.balanceOf(address(this));
  }

  function getTransactionIdHash(string memory transactionId) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(transactionId));
  }

  function getTransactionItem(
    string memory transactionId
  ) public view returns (bytes32, TransactionItem memory) {
    bytes32 transactionIdHash = getTransactionIdHash(transactionId);
    return (transactionIdHash, _transactionIds[transactionIdHash]);
  }

  function _claim(
    address account,
    uint256 amount,
    string memory transactionId
  ) private nonReentrant {
    require(sqrToken.balanceOf(address(this)) >= amount, "Contract must have sufficient funds");

    (bytes32 transactionIdHash, TransactionItem memory transactionItem) = getTransactionItem(
      transactionId
    );
    require(transactionItem.account == address(0), "This transactionId was used before");

    _transactionIds[transactionIdHash] = TransactionItem(account, amount);
    sqrToken.transfer(account, amount);

    emit Claim(account, amount, transactionIdHash, uint32(block.timestamp));
  }

  function claim(
    address account,
    uint256 amount,
    string memory transactionId,
    uint32 timestampLimit
  ) external payable onlyOwner {
    require(block.timestamp <= timestampLimit, "Timeout blocker");
    _claim(account, amount, transactionId);
  }

  function verifySignature(
    address account,
    uint256 amount,
    string memory transactionId,
    uint32 timestampLimit,
    bytes memory signature
  ) private view returns (bool) {
    bytes32 messageHash = keccak256(
      abi.encodePacked(account, amount, transactionId, timestampLimit)
    );
    address recover = messageHash.toEthSignedMessageHash().recover(signature);
    return recover == owner();
  }

  function claimSig(
    address account,
    uint256 amount,
    string memory transactionId,
    uint32 timestampLimit,
    bytes memory signature
  ) external {
    require(block.timestamp <= timestampLimit, "Timeout blocker");
    require(
      verifySignature(account, amount, transactionId, timestampLimit, signature),
      "Invalid signature"
    );
    _claim(account, amount, transactionId);
  }
}
