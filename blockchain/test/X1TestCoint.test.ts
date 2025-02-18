import { expect } from "chai";
import { ethers } from "hardhat";
import { X1TestCoin } from "../typechain-types";

describe("X1TestCoin", function () {
  let token: X1TestCoin;
  let owner: any, user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const X1TestCoin = await ethers.getContractFactory("X1TestCoin");
    token = (await X1TestCoin.deploy()) as X1TestCoin;
  });

  it("Should burn 5% on transfers", async () => {
    
    const initialBalance = await token.balanceOf(owner.address);
    const transferAmount = ethers.parseEther("100");

    await token.transfer(user.address, transferAmount);

    const userBalance = await token.balanceOf(user.address);
    const burnAmount = await token.getBurnAmount(transferAmount);

    expect(userBalance).to.equal(transferAmount - burnAmount);
    expect(await token.balanceOf(owner.address)).to.equal(initialBalance - transferAmount);
  });

  it("Should allow staking and reward 1% daily", async () => {
    
    const stakeAmount = ethers.parseEther("10");

    const tx = await token.transfer(user.address, stakeAmount);
    
    // Wait for the transfer to be mined
    await tx.wait(); 

    // 5% burn on transfer
    const actualStakeAmount = stakeAmount - (stakeAmount * BigInt(5)) / BigInt(100); 

    // Stake the amount the user actually holds
    await token.connect(user).stake(actualStakeAmount);

    // Fast forward 1 day
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    // Claim rewards
    await token.connect(user).claimRewards();

    const expectedReward = actualStakeAmount / BigInt(100); // 1% daily reward
    const userBalance = await token.balanceOf(user.address);

    expect(userBalance).to.equal(expectedReward);
  });
});
