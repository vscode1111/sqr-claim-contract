// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./interfaces/IPermitToken.sol";

contract SQRClaim is OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _newOwner,
        address _sqrToken,
        address _coldWallet,
        uint256 _balanceLimit
    ) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        _transferOwnership(_newOwner);
        sqrToken = IPermitToken(_sqrToken);
        coldWallet = _coldWallet;
        balanceLimit = _balanceLimit;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    //Variables, structs, modifiers, events------------------------

    IPermitToken public sqrToken;
    address public coldWallet;
    uint256 public balanceLimit;
    uint256 public totalBalance;

    mapping(address => FundItem) private _balances;

    struct FundItem {
        uint256 balance;
        //uint32 lockTime;
    }

    modifier onlySufficentFunds(address account, uint256 amount) {
        FundItem storage fund = _balances[account];
        require(fund.balance >= amount, "Insufficent funds");
        _;
    }

    event Deposit(address indexed account, uint256 amount, uint32 timestamp);

    event Withdraw(address indexed account, uint256 amount, uint32 timestamp);

    //Functions-------------------------------------------

    function fetchFundItem(address account) external view returns (FundItem memory) {
        return _balances[account];
    }

    function balanceOf(address account) external view returns (uint256) {
        FundItem storage fund = _balances[account];
        return fund.balance;
    }

    function getBalance() public view returns (uint256) {
        return sqrToken.balanceOf(address(this));
    }

    function claim(uint256 amount) public payable nonReentrant {
        address sender = _msgSender();

        require(sqrToken.allowance(sender, address(this)) >= amount, "User must allow to use of funds");

        require(sqrToken.balanceOf(sender) >= amount, "User must have funds");

        FundItem storage fund = _balances[sender];

        uint256 supposedBalance = getBalance() + amount;

        if (supposedBalance > balanceLimit) {
            uint256 coldRemains = supposedBalance - balanceLimit;
            uint256 userRemains = amount - coldRemains;

            fund.balance += userRemains;

            sqrToken.transferFrom(sender, address(this), userRemains);
            sqrToken.transferFrom(sender, coldWallet, coldRemains);
        } else {
            fund.balance += amount;

            sqrToken.transferFrom(sender, address(this), amount);
        }

        totalBalance += amount;

        emit Deposit(sender, amount, uint32(block.timestamp));
    }

    function claimSig(uint256 amount) external {
        address sender = _msgSender();

        require(sqrToken.balanceOf(address(this)) >= amount, "Contract must have sufficient funds");

        FundItem storage fund = _balances[sender];
        fund.balance -= amount;
        totalBalance -= amount;

        sqrToken.transfer(sender, amount);

        emit Withdraw(sender, amount, uint32(block.timestamp));
    }
}
