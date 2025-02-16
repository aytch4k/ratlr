import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  RATLRFactory,
  RATLRToken20,
  RATLRToken721,
  RATLRToken1155,
} from "../typechain-types";

describe("RATLRFactory", function () {
  // This test suite is configured to run on Autheo testnet
  let factory: RATLRFactory;
  let owner: SignerWithAddress;
  let feeCollector: SignerWithAddress;
  let user: SignerWithAddress;
  
  const DEPLOYMENT_FEE = ethers.parseEther(process.env.DEPLOYMENT_FEE || "0.1");
  const TOKEN_PARAMS = {
    name: "Test Token",
    symbol: "TEST",
    metadata: "ipfs://metadata",
    feePercentage: parseInt(process.env.FEE_PERCENTAGE || "250"), // 2.5%
  };
  
  before(async function () {
    // Ensure we're on Autheo testnet
    const network = await ethers.provider.getNetwork();
    expect(network.chainId).to.equal(785n); // Autheo testnet chain ID
  });
  
  beforeEach(async function () {
    [owner, feeCollector, user] = await ethers.getSigners();
    
    // Request testnet tokens from faucet if needed
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    if (ownerBalance < DEPLOYMENT_FEE) {
      console.log("Warning: Low balance on testnet. Please use the faucet at", process.env.TESTNET_FAUCET_URL);
      throw new Error("Insufficient testnet balance");
    }
    
    const Factory = await ethers.getContractFactory("RATLRFactory");
    factory = await Factory.deploy(feeCollector.address, DEPLOYMENT_FEE);
    await factory.waitForDeployment();
    
    console.log("Factory deployed to:", await factory.getAddress());
  });
  
  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await factory.owner()).to.equal(owner.address);
    });
    
    it("Should set the correct fee collector", async function () {
      expect(await factory.feeCollector()).to.equal(feeCollector.address);
    });
    
    it("Should set the correct deployment fee", async function () {
      expect(await factory.deploymentFee()).to.equal(DEPLOYMENT_FEE);
    });
  });
  
  describe("ERC20 Deployment", function () {
    it("Should deploy ERC20 token with correct parameters", async function () {
      const tx = await factory.connect(user).deployERC20(
        TOKEN_PARAMS,
        18, // decimals
        ethers.parseEther("1000000"), // initial supply
        ethers.parseEther("10000000"), // max supply
        { value: DEPLOYMENT_FEE }
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log) => log.fragment?.name === "TokenDeployed"
      );
      expect(event).to.not.be.undefined;
      
      const tokenAddress = event?.args?.[0];
      const token = await ethers.getContractAt("RATLRToken20", tokenAddress);
      
      expect(await token.name()).to.equal(TOKEN_PARAMS.name);
      expect(await token.symbol()).to.equal(TOKEN_PARAMS.symbol);
      expect(await token.metadata()).to.equal(TOKEN_PARAMS.metadata);
      expect(await token.feePercentage()).to.equal(TOKEN_PARAMS.feePercentage);
      
      console.log("ERC20 token deployed to:", tokenAddress);
    });
  });
  
  describe("ERC721 Deployment", function () {
    it("Should deploy ERC721 token with correct parameters", async function () {
      const tx = await factory.connect(user).deployERC721(
        TOKEN_PARAMS,
        1000, // max supply
        { value: DEPLOYMENT_FEE }
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log) => log.fragment?.name === "TokenDeployed"
      );
      expect(event).to.not.be.undefined;
      
      const tokenAddress = event?.args?.[0];
      const token = await ethers.getContractAt("RATLRToken721", tokenAddress);
      
      expect(await token.name()).to.equal(TOKEN_PARAMS.name);
      expect(await token.symbol()).to.equal(TOKEN_PARAMS.symbol);
      expect(await token.metadata()).to.equal(TOKEN_PARAMS.metadata);
      expect(await token.feePercentage()).to.equal(TOKEN_PARAMS.feePercentage);
      
      console.log("ERC721 token deployed to:", tokenAddress);
    });
  });
  
  describe("ERC1155 Deployment", function () {
    it("Should deploy ERC1155 token with correct parameters", async function () {
      const tx = await factory.connect(user).deployERC1155(
        TOKEN_PARAMS,
        "https://api.example.com/token/{id}",
        { value: DEPLOYMENT_FEE }
      );
      
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log) => log.fragment?.name === "TokenDeployed"
      );
      expect(event).to.not.be.undefined;
      
      const tokenAddress = event?.args?.[0];
      const token = await ethers.getContractAt("RATLRToken1155", tokenAddress);
      
      expect(await token.metadata()).to.equal(TOKEN_PARAMS.metadata);
      expect(await token.feePercentage()).to.equal(TOKEN_PARAMS.feePercentage);
      
      console.log("ERC1155 token deployed to:", tokenAddress);
    });
  });
  
  describe("Token Tracking", function () {
    beforeEach(async function () {
      // Deploy one of each token type
      await factory.connect(user).deployERC20(
        TOKEN_PARAMS,
        18,
        ethers.parseEther("1000000"),
        ethers.parseEther("10000000"),
        { value: DEPLOYMENT_FEE }
      );
      
      await factory.connect(user).deployERC721(
        TOKEN_PARAMS,
        1000,
        { value: DEPLOYMENT_FEE }
      );
      
      await factory.connect(user).deployERC1155(
        TOKEN_PARAMS,
        "https://api.example.com/token/{id}",
        { value: DEPLOYMENT_FEE }
      );
    });
    
    it("Should track all deployed tokens", async function () {
      expect(await factory.getTokenCount()).to.equal(3);
      
      const allTokens = await factory.getAllTokens();
      expect(allTokens.length).to.equal(3);
      
      console.log("All deployed tokens:", allTokens);
    });
    
    it("Should track tokens by creator", async function () {
      const userTokens = await factory.getTokensByCreator(user.address);
      expect(userTokens.length).to.equal(3);
      
      const ownerTokens = await factory.getTokensByCreator(owner.address);
      expect(ownerTokens.length).to.equal(0);
      
      console.log("User's deployed tokens:", userTokens);
    });
  });
});