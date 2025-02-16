import { ethers, run } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as dotenv from "dotenv";

// Load both package and root .env files
dotenv.config();
dotenv.config({ path: '../../.env' });

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(deployerBalance));

  // Verify we're on Autheo testnet
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 785n) {
    throw new Error(`Wrong network: expected Autheo testnet (785), got ${network.chainId}`);
  }
  console.log("Deploying to Autheo testnet...");

  // Deploy Factory
  const deploymentFee = ethers.parseEther(process.env.DEPLOYMENT_FEE || "0.1");
  const Factory = await ethers.getContractFactory("RATLRFactory");
  const factory = await Factory.deploy(deployer.address, deploymentFee);
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("RATLRFactory deployed to:", factoryAddress);

  // Wait for a few block confirmations before verification
  console.log("Waiting for block confirmations...");
  await factory.deploymentTransaction()?.wait(5);

  // Verify contract on Autheo Explorer
  console.log("\nVerifying contract on Autheo Explorer...");
  try {
    await run("verify:verify", {
      address: factoryAddress,
      constructorArguments: [deployer.address, deploymentFee],
      contract: "contracts/factory/RATLRFactory.sol:RATLRFactory",
    });
    console.log("Contract verified successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying contract:", error.message);
    } else {
      console.error("Error verifying contract:", error);
    }
  }

  // Log deployment info
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("Network:", network.name);
  console.log("Factory Address:", factoryAddress);
  console.log("Deployment Fee:", ethers.formatEther(deploymentFee), "ETH");
  console.log("Explorer URL:", `${process.env.TESTNET_EXPLORER_URL}/address/${factoryAddress}`);

  // Save deployment info to a file
  const fs = require('fs');
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    factoryAddress,
    deploymentFee: ethers.formatEther(deploymentFee),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });