// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract X1TestCoin is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18; // 1M Tokens
    uint256 public constant BURN_PERCENTAGE = 5; // 5% burn

    struct Stake {
        uint256 amount;
        uint256 lastClaimed;
    }

    mapping(address => Stake) public stakes;

    constructor() ERC20("X1TestCoin", "X1TC") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 burnAmount = (amount * BURN_PERCENTAGE) / 100;
        uint256 transferAmount = amount - burnAmount;

        _burn(_msgSender(), burnAmount);
        return super.transfer(recipient, transferAmount);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        stakes[msg.sender].amount += amount;
        stakes[msg.sender].lastClaimed = block.timestamp;

        _burn(msg.sender, amount); // Burn staked tokens
    }

    function claimRewards() external {
        require(stakes[msg.sender].amount > 0, "No staked balance");

        uint256 rewards = calculateRewards(msg.sender);
        stakes[msg.sender].lastClaimed = block.timestamp;

        _mint(msg.sender, rewards);
    }

    function calculateRewards(address staker) public view returns (uint256) {
        Stake memory userStake = stakes[staker];
        uint256 daysStaked = (block.timestamp - userStake.lastClaimed) / 1 days;
        return (userStake.amount * daysStaked) / 100; // 1% daily
    }

    function getStakeInfo(address staker) external view returns (uint256 amount, uint256 lastClaimed) {
        Stake memory userStake = stakes[staker];
        return (userStake.amount, userStake.lastClaimed);
    }

    function getBurnAmount(uint256 amount) external pure returns (uint256) {
        return (amount * BURN_PERCENTAGE) / 100;
    }
}
