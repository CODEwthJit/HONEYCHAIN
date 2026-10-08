import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { rpcUrl } from "./config";

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(rpcUrl),
});

export const REGISTRY_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const ACCESS_CONTROL_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

