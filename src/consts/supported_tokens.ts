import type { Chain } from "thirdweb";
import { bsc } from "./chains";

export type Token = {
  tokenAddress: string;
  symbol: string;
  icon: string;
};

export type SupportedTokens = {
  chain: Chain;
  tokens: Token[];
};

/**
 * By default you create listings with the payment currency in the native token of the network (eth, avax, matic etc.)
 *
 * If you want to allow users to transact using different ERC20 tokens, you can add them to the config below
 * Keep in mind this is for front-end usage. Make sure your marketplace v3 contracts accept the ERC20s
 * check that in https://thirdweb.com/<chain-id>/<marketplace-v3-address>/permissions -> Asset
 * By default the Marketplace V3 contract supports any asset (token)
 */
export const SUPPORTED_TOKENS: SupportedTokens[] = [
  {
    chain: bsc,
    tokens: [
      {
        tokenAddress: "0x092aC429b9c3450c9909433eB0662c3b7c13cF9A",
        symbol: "GCC",
        icon: "/erc20-icons/GCC.png",
      },
      {
        tokenAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        symbol: "BNB",
        icon: "/erc20-icons/bnb.jpg",
      },
      // Add more ERC20 here...
    ],
  },

  

  
];

export const NATIVE_TOKEN_ICON_MAP: { [key in Chain["id"]]: string } = {
  1: "/native-token-icons/GCC.png",
  [bsc.id]: "/native-token-icons/bsc.png",
  
};
