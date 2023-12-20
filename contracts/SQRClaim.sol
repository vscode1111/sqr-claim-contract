// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/IPermitToken.sol";
import "./interfaces/IBalance.sol";

// import "hardhat/console.sol";

contract SQRClaim is OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable, IBalance {
  using ECDSA for bytes32;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _newOwner, address _sqrToken, uint32 _claimDelay) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();

    _transferOwnership(_newOwner);
    sqrToken = IPermitToken(_sqrToken);
    claimDelay = _claimDelay;
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  //Variables, structs, modifiers, events------------------------

  IPermitToken public sqrToken;
  uint32 public claimDelay;
  mapping(address => FundItem) private _balances;
  mapping(bytes32 => TransactionItem) private _transactionIds;

  struct FundItem {
    uint256 amount;
    uint32 permitDate;
  }

  struct TransactionItem {
    address account;
    uint256 amount;
  }

  event Claim(address indexed account, uint256 amount, bytes32 transactionIdHash, uint32 timestamp);

  //Functions-------------------------------------------

  function changeClaimDelay(uint32 _claimDelay) external onlyOwner {
    claimDelay = _claimDelay;
  }

  function getBalance() public view returns (uint256) {
    return sqrToken.balanceOf(address(this));
  }

  function getTransactionIdHash(string memory transactionId) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(transactionId));
  }

  function fetchFundItem(address account) external view returns (FundItem memory) {
    return _balances[account];
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
    string memory transactionId,
    uint32 timestampLimit
  ) private nonReentrant {
    require(amount > 0, "Amount must be greater than zero");
    require(block.timestamp <= timestampLimit, "Timeout blocker for timestampLimit");
    require(sqrToken.balanceOf(address(this)) >= amount, "Contract must have sufficient funds");

    (bytes32 transactionIdHash, TransactionItem memory transactionItem) = getTransactionItem(
      transactionId
    );
    require(transactionItem.account == address(0), "This transactionId was used before");

    FundItem storage fund = _balances[account];
    require(
      fund.permitDate == 0 || fund.permitDate <= block.timestamp,
      "Timeout blocker for account"
    );

    fund.amount += amount;
    fund.permitDate = uint32(block.timestamp + claimDelay);

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
    _claim(account, amount, transactionId, timestampLimit);
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
    require(
      verifySignature(account, amount, transactionId, timestampLimit, signature),
      "Invalid signature"
    );
    _claim(account, amount, transactionId, timestampLimit);
  }
}
