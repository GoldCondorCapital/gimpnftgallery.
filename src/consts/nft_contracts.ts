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
    address: "0x142bB2aDF4782aEEd93EBFD641acb9B3037779D1",
    chain: bsc,
    title: "",
    thumbnailUrl:
      "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeidpjcxupgvd6n6n3ehbsghay5ycpqtp7ukhbvbmmyeho2zoyle53q/",
    type: "ERC721",
  },
];
