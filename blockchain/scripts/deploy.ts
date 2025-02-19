import { ethers } from "hardhat";

async function main() {
  const X1TestCoin = await ethers.getContractFactory("X1TestCoin");
  const token = await X1TestCoin.deploy();

  console.log("✅ X1TestCoin deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
