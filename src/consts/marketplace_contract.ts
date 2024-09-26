import type { Chain } from "thirdweb";
import { bsc } from "./chains"; // Ensure 'bsc' is being exported from './chains'

type MarketplaceContract = {
  address: string;
  chain: Chain;
};

/**
 * You need a marketplace contract on each of the chain you want to support
 * Only list one marketplace contract address for each chain
 */
export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [
  {
    address: "0xCBdA2CE8eadF3E9b4aa2aA68ED1E20B946924c6A",
    chain: bsc,
  },
];