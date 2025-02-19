# 🪙 X1TestCoin

X1TestCoin is an ERC-20 token deployed on the Sepolia testnet, featuring a burn mechanism and a staking system with daily rewards.

## 📊 Contract Details

- **Contract Name:** X1TestCoin
- **Network:** Sepolia Testnet
- **Contract Address:** [0xe038B1f7809C77dbe87400c6389704c90883E99E](https://sepolia.etherscan.io/address/0xe038B1f7809C77dbe87400c6389704c90883E99E)
- **Supply:** 1,000,000 X1TC

## 🛠️ Features

### 1. Fixed Supply
- Initial supply of **1,000,000 X1TestCoins**.

### 2. Burn on Transfer
- **5%** of the transferred amount is burned (permanently removed from supply).

Example:
If a user transfers 100 tokens:
- **5 tokens** are burned.
- **95 tokens** are received by the recipient.

### 3. Staking System
- Users can **stake** their X1TestCoins to earn **1% daily rewards**.
- **No lockup period**: Users can claim rewards anytime.

#### Stake Calculation
- 1% of the staked amount is rewarded after every 24 hours.

Example:
If a user stakes 1000 X1TC:
- After 1 day: User earns **10 X1TC**.

### 4. Security & Standards
- Built using **OpenZeppelin’s ERC-20** implementation for security and gas efficiency.

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/Harshcreator/x1-assignment
cd blockchain
```

2. Install dependencies:

```bash
npm install
```

3. Configure Environment Variables:

Create a `.env` file and add:

```env
SEPOLIA_RPC_URL=<Your Alchemy/Infura URL>
PRIVATE_KEY=<Your Wallet Private Key>
```

4. Compile the contract:

```bash
npx hardhat compile
```

## 🚀 Deployment

Deploy the contract to Sepolia testnet:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## 🧪 Testing

1. Run unit tests (burn & staking checks):

```bash
npx hardhat test
```

2. Ensure the following tests pass:

- ✅ Should burn 5% on transfers
- ✅ Should allow staking and reward 1% daily

## 📜 Functions Overview

### Transfer

```solidity
function transfer(address recipient, uint256 amount) public override returns (bool);
```
- Transfers `amount` to `recipient`.
- **5%** of the amount is burned automatically.

### Stake

```solidity
function stake(uint256 amount) external;
```
- Stake tokens to earn 1% daily rewards.

### Claim Rewards

```solidity
function claimRewards() external;
```
- Claim accumulated staking rewards.

### Get Stake Info

```solidity
function getStakeInfo(address staker) external view returns (uint256 amount, uint256 lastClaimed);
```
- Retrieve stake details for a given address.

## 🔍 Verification

Verify the contract on **Sepolia Etherscan**:

1. Flatten the contract:

```bash
npx hardhat flatten > X1TestCoin_flat.sol
```

2. Submit the flattened file to Etherscan for verification.

---

