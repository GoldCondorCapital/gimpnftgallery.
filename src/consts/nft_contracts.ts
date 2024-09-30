import type { Chain } from "thirdweb";
import { bsc } from "./chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

/**
 * Below is a list of all NFT contracts supported by your marketplace(s)
 * This is of course hard-coded for demo purpose
 *
 * In reality, the list should be dynamically fetched from your own data source
 */
export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9",
    chain: bsc,
    title: "",
    thumbnailUrl:
      "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmXeyhLck39TMYZNWJNQWcdzjWptaKPRk5T9SEZdQGqj3e/Screenshot%202024-09-19%20210248.png",
    type: "ERC721",
  },
];
