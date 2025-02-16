import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { RATLRFactory, RATLRToken20, RATLRToken721, RATLRToken1155 } from "../typechain-types";
import { ContractTransactionReceipt, EventLog } from "ethers";

dotenv.config();
dotenv.config({ path: '../../.env' });

async function waitForConfirmation(txHash: string, blocks = 1, maxAttempts = 10) {
  console.log(`Waiting for ${blocks} block confirmation(s)...`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const receipt = await ethers.provider.getTransactionReceipt(txHash);
      if (receipt) {
        const currentBlock = await ethers.provider.getBlockNumber();
        if (currentBlock >= receipt.blockNumber + blocks) {
          console.log("Transaction confirmed");
          return;
        }
        console.log(`Waiting for ${receipt.blockNumber + blocks - currentBlock} more blocks...`);
      }
    } catch (error) {
      console.log(`Attempt ${attempt + 1}/${maxAttempts} failed, retrying...`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts
  }
  throw new Error(`Transaction ${txHash} confirmation timeout after ${maxAttempts} attempts`);
}

async function main() {
  try {
    // Initial setup
    const signers = await ethers.getSigners();
    if (signers.length < 3) {
      throw new Error("Not enough signers. Need at least 3 accounts.");
    }
    const [deployer, user1, user2] = signers;

    console.log("\nDeploying and testing with account:", deployer.address);
    console.log("User1 address:", user1.address);
    console.log("User2 address:", user2.address);
    console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    // Verify network
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 785n) {
      throw new Error(`Wrong network: expected Autheo testnet (785), got ${network.chainId}`);
    }
    console.log("\nConnected to Autheo testnet");

    // Deploy Libraries first
    console.log("\n1. Deploying Libraries...");
    
    console.log("- Deploying ERC20DeployerLib...");
    const ERC20DeployerLib = await ethers.getContractFactory("ERC20DeployerLib");
    const erc20DeployerLib = await ERC20DeployerLib.deploy();
    await erc20DeployerLib.waitForDeployment();
    await waitForConfirmation(erc20DeployerLib.deploymentTransaction()?.hash || "");
    console.log("  ERC20DeployerLib deployed to:", await erc20DeployerLib.getAddress());

    console.log("- Deploying ERC721DeployerLib...");
    const ERC721DeployerLib = await ethers.getContractFactory("ERC721DeployerLib");
    const erc721DeployerLib = await ERC721DeployerLib.deploy();
    await erc721DeployerLib.waitForDeployment();
    await waitForConfirmation(erc721DeployerLib.deploymentTransaction()?.hash || "");
    console.log("  ERC721DeployerLib deployed to:", await erc721DeployerLib.getAddress());

    console.log("- Deploying ERC1155DeployerLib...");
    const ERC1155DeployerLib = await ethers.getContractFactory("ERC1155DeployerLib");
    const erc1155DeployerLib = await ERC1155DeployerLib.deploy();
    await erc1155DeployerLib.waitForDeployment();
    await waitForConfirmation(erc1155DeployerLib.deploymentTransaction()?.hash || "");
    console.log("  ERC1155DeployerLib deployed to:", await erc1155DeployerLib.getAddress());

    console.log("- Deploying TokenTrackerLib...");
    const TokenTrackerLib = await ethers.getContractFactory("TokenTrackerLib");
    const tokenTrackerLib = await TokenTrackerLib.deploy();
    await tokenTrackerLib.waitForDeployment();
    await waitForConfirmation(tokenTrackerLib.deploymentTransaction()?.hash || "");
    console.log("  TokenTrackerLib deployed to:", await tokenTrackerLib.getAddress());

    // Deploy Factory with linked libraries
    console.log("\n2. Deploying Factory Contract...");
    const deploymentFee = ethers.parseEther(process.env.DEPLOYMENT_FEE || "0.01");
    const Factory = await ethers.getContractFactory("RATLRFactory", {
      libraries: {
        ERC20DeployerLib: await erc20DeployerLib.getAddress(),
        ERC721DeployerLib: await erc721DeployerLib.getAddress(),
        ERC1155DeployerLib: await erc1155DeployerLib.getAddress(),
        TokenTrackerLib: await tokenTrackerLib.getAddress(),
      },
    });
    const factory = await Factory.deploy(deployer.address, deploymentFee) as unknown as RATLRFactory;
    await factory.waitForDeployment();
    await waitForConfirmation(factory.deploymentTransaction()?.hash || "");
    console.log("Factory deployed to:", await factory.getAddress());

    // Test Factory Functions
    console.log("\n3. Testing Factory Functions...");
    console.log("- Setting new deployment fee...");
    const newFee = ethers.parseEther("0.02");
    const feeTx = await factory.updateDeploymentFee(newFee, { gasPrice: 10000000000 });
    await waitForConfirmation(feeTx.hash);
    console.log("- Setting new fee collector...");
    const collectorTx = await factory.updateFeeCollector(user1.address, { gasPrice: 10000000000 });
    await waitForConfirmation(collectorTx.hash);

    // Deploy ERC20 Token
    console.log("\n4. Deploying and Testing ERC20 Token...");
    const erc20Params = {
      name: "Test Token",
      symbol: "TEST",
      metadata: "ipfs://metadata",
      feePercentage: 250, // 2.5%
    };
    
    const erc20Tx = await factory.connect(user2).deployERC20(
      erc20Params,
      18,
      ethers.parseEther("1000000"),
      ethers.parseEther("10000000"),
      { value: newFee, gasPrice: 10000000000 }
    );
    console.log("Waiting for ERC20 deployment transaction...");
    const erc20Receipt = await erc20Tx.wait() as ContractTransactionReceipt;
    await waitForConfirmation(erc20Tx.hash);
    
    // Debug log all events
    console.log("Transaction events:");
    for (const log of erc20Receipt.logs) {
      if (log instanceof EventLog) {
        console.log(`- Event: ${log.eventName}`);
        console.log(`  Args:`, log.args);
      }
    }
    
    // Try to find the event
    const erc20Event = erc20Receipt.logs.find(log =>
      log instanceof EventLog && 
      (log.eventName === "TokenDeployed" || log.eventName === "TokenCreated")
    ) as EventLog;
    
    if (!erc20Event) {
      throw new Error("Failed to find token deployment event in transaction logs");
    }
    
    const erc20Address = erc20Event.args[0] as string;
    if (!erc20Address || erc20Address === ethers.ZeroAddress) {
      throw new Error("Invalid token address from deployment event");
    }
    
    console.log("ERC20 deployed to:", erc20Address);
    console.log("Attaching to ERC20 contract...");
    const erc20 = await ethers.getContractAt("RATLRToken20", erc20Address) as unknown as RATLRToken20;
    
    // Verify the contract was deployed successfully
    const code = await ethers.provider.getCode(erc20Address);
    if (code === "0x") {
      throw new Error("ERC20 contract deployment failed - no code at address");
    }

    // Test ERC20 Functions
    console.log("Testing ERC20 functions...");
    console.log("- Minting tokens...");
    // Get the token contract connected with the owner (user2)
    const erc20AsOwner = erc20.connect(user2);
    console.log("- Minting tokens as owner...");
    const mintTx = await erc20AsOwner.mint(user2.address, ethers.parseEther("1000"), { gasPrice: 10000000000 });
    await waitForConfirmation(mintTx.hash);
    console.log("- Transferring tokens...");
    const transferTx = await erc20.connect(user2).transfer(user1.address, ethers.parseEther("100"), { gasPrice: 10000000000 });
    await waitForConfirmation(transferTx.hash);
    console.log("- Checking balances...");
    console.log("  User2 balance:", ethers.formatEther(await erc20.balanceOf(user2.address)));
    console.log("  User1 balance:", ethers.formatEther(await erc20.balanceOf(user1.address)));

    // Save deployment info
    const fs = require('fs');
    const deploymentInfo = {
      network: network.name,
      chainId: Number(network.chainId),
      libraries: {
        erc20DeployerLib: await erc20DeployerLib.getAddress(),
        erc721DeployerLib: await erc721DeployerLib.getAddress(),
        erc1155DeployerLib: await erc1155DeployerLib.getAddress(),
        tokenTrackerLib: await tokenTrackerLib.getAddress(),
      },
      factory: await factory.getAddress(),
      tokens: {
        erc20: erc20Address,
      },
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
      'deployment-test.json',
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\nDeployment info saved to deployment-test.json");

  } catch (error) {
    console.error("\nError during deployment and testing:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });