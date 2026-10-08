import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("----------------------------------------------------");
  console.log("Deploying HoneyChain Contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  console.log("----------------------------------------------------");

  // 1. Deploy HoneyBatchRegistry
  const HoneyBatchRegistryFactory = await ethers.getContractFactory("HoneyBatchRegistry");
  const registry = await HoneyBatchRegistryFactory.deploy(deployer.address);
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  const deployTx = registry.deploymentTransaction();
  console.log("✅ HoneyBatchRegistry deployed to:", registryAddress);
  if (deployTx) {
    console.log("🔗 Deployment Tx Hash:", deployTx.hash);
    console.log(`🔍 Arbiscan: https://sepolia.arbiscan.io/tx/${deployTx.hash}`);
  }

  // 2. Grant roles to deployer for local testing
  const BEEKEEPER_ROLE = await registry.BEEKEEPER_ROLE();
  const LABORATORY_ROLE = await registry.LABORATORY_ROLE();
  const PROCESSOR_ROLE = await registry.PROCESSOR_ROLE();
  const PACKAGER_ROLE = await registry.PACKAGER_ROLE();
  const DISTRIBUTOR_ROLE = await registry.DISTRIBUTOR_ROLE();

  console.log("Authorizing deployer with all supply chain roles for testing...");
  await (await registry.authorizeOrganization(BEEKEEPER_ROLE, deployer.address)).wait();
  await (await registry.authorizeOrganization(LABORATORY_ROLE, deployer.address)).wait();
  await (await registry.authorizeOrganization(PROCESSOR_ROLE, deployer.address)).wait();
  await (await registry.authorizeOrganization(PACKAGER_ROLE, deployer.address)).wait();
  await (await registry.authorizeOrganization(DISTRIBUTOR_ROLE, deployer.address)).wait();
  console.log("✅ All supply chain roles authorized.");

  // 3. Export deployment artifacts for the Next.js frontend
  const deploymentsDir = path.join(__dirname, "../../src/lib/blockchain/deployed");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentData = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    registryAddress,
    transactionHash: deployTx?.hash || "",
    deployerAddress: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "contractAddresses.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("📁 Deployment addresses written to src/lib/blockchain/deployed/contractAddresses.json");
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
