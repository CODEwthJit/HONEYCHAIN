import { createConfig } from "@ponder/core";
import { http } from "viem";
import HoneyBatchRegistryAbi from "../src/lib/blockchain/abi/HoneyBatchRegistry.json";

export default createConfig({
  networks: {
    arbitrumSepolia: {
      chainId: 421614,
      transport: http(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc"),
    },
  },
  contracts: {
    HoneyBatchRegistry: {
      network: "arbitrumSepolia",
      abi: HoneyBatchRegistryAbi as any,
      address: (process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: 18000000,
    },
  },
});
