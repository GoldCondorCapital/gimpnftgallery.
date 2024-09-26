"use client";

import { client } from "@/consts/client";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { NFT_CONTRACTS } from "consts/nft_contracts";
import { SUPPORTED_TOKENS, Token } from "@/consts/supported_tokens";
import { getSupplyInfo, SupplyInfo } from "../extensions/getLargestCirculatingTokenId";
import { createContext, type ReactNode, useContext } from "react";
import { getContract, type ThirdwebContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { isERC721 } from "thirdweb/extensions/erc721";
import {
  type DirectListing,
  type EnglishAuction,
  getAllAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

import "../styles/global.css";

export type NftType = "ERC1155" | "ERC721";

/**
 * Support for English auction coming soon.
 */
const SUPPORT_AUCTION = false;

type TMarketplaceContext = {
  marketplaceContract: ThirdwebContract;
  nftContract: ThirdwebContract;
  type: NftType;
  isLoading: boolean;
  allValidListings: DirectListing[] | undefined;
  allAuctions: EnglishAuction[] | undefined;
  contractMetadata:
    | {
        [key: string]: any;
        name: string;
        symbol: string;
      }
    | undefined;
  refetchAllListings: Function;
  isRefetchingAllListings: boolean;
  listingsInSelectedCollection: DirectListing[] | [];
  supplyInfo: SupplyInfo | undefined;
  supportedTokens: Token[] | [];
};

const MarketplaceContext = createContext<TMarketplaceContext | undefined>(
  undefined
);

export default function MarketplaceProvider({
  chainId,
  contractAddress,
  children,
}: {
  chainId: string;
  contractAddress: string;
  children: ReactNode;
}) {
  let _chainId: number;

  // Improved chainId parsing with logging
  try {
    if (!chainId || isNaN(Number(chainId))) {
      throw new Error(`Invalid chain ID: ${chainId}`);
    }
    _chainId = Number.parseInt(chainId);
    console.log("Parsed Chain ID:", _chainId);  // Debug: Log the parsed chain ID
  } catch (err) {
    console.error("Error parsing chain ID:", err);  // Debug: Log chain parsing error
    throw new Error("Invalid chain ID");
  }

  // Find the marketplace contract for the given chain
  const marketplaceContract = MARKETPLACE_CONTRACTS.find(
    (item) => item.chain.id === _chainId
  );
  console.log("Marketplace contract found:", marketplaceContract); // Debug: Log marketplace contract

  if (!marketplaceContract) {
    console.error("Marketplace not supported on this chain:", _chainId);  // Debug: Log unsupported chain
    throw new Error("Marketplace not supported on this chain");
  }

  // Find if the collection is supported on this marketplace
  const collectionSupported = NFT_CONTRACTS.find(
    (item) =>
      item.address.toLowerCase() === contractAddress.toLowerCase() &&
      item.chain.id === _chainId
  );
  console.log("Collection supported:", collectionSupported);  // Debug: Log collection support

  // Setup the NFT contract
  const contract = getContract({
    chain: marketplaceContract.chain,
    client,
    address: contractAddress.toLowerCase(), // Ensure address is in lowercase
  });
  console.log("NFT Contract:", contract); // Debug: Log NFT contract

  // Setup the marketplace contract
  const marketplace = getContract({
    address: marketplaceContract.address,
    chain: marketplaceContract.chain,
    client,
  });
  console.log("Marketplace Contract:", marketplace); // Debug: Log marketplace contract

  // Check for ERC721 or ERC1155 contract type
  const { data: is721, isLoading: isChecking721 } = useReadContract(isERC721, {
    contract,
    queryOptions: {
      enabled: !!marketplaceContract,
    },
  });
  console.log("Is ERC721:", is721, "Loading:", isChecking721); // Debug: Log ERC721 check

  const { data: is1155, isLoading: isChecking1155 } = useReadContract(
    isERC1155,
    { contract, queryOptions: { enabled: !!marketplaceContract } }
  );
  console.log("Is ERC1155:", is1155, "Loading:", isChecking1155); // Debug: Log ERC1155 check

  const isNftCollection = is1155 || is721;
  console.log("Is NFT Collection:", isNftCollection); // Debug: Log NFT collection type

  if (!isNftCollection && !isChecking1155 && !isChecking721)
    throw new Error("Not a valid NFT collection");

  // Fetch contract metadata
  const { data: contractMetadata, isLoading: isLoadingContractMetadata } =
    useReadContract(getContractMetadata, {
      contract,
      queryOptions: {
        enabled: isNftCollection,
      },
    });
  console.log("Contract Metadata:", contractMetadata); // Debug: Log contract metadata

  // Fetch all valid listings for the marketplace
  const {
    data: allValidListings,
    isLoading: isLoadingValidListings,
    refetch: refetchAllListings,
    isRefetching: isRefetchingAllListings,
  } = useReadContract(getAllValidListings, {
    contract: marketplace,
    queryOptions: {
      enabled: isNftCollection,
    },
  });
  console.log("All Valid Listings:", allValidListings); // Debug: Log all valid listings

  // Filter listings for the selected collection
  const listingsInSelectedCollection = allValidListings?.length
    ? allValidListings.filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
          contract.address.toLowerCase()
      )
    : [];
  console.log("Listings in Selected Collection:", listingsInSelectedCollection);  // Debug: Log selected collection listings

  // Fetch all auctions for the marketplace (if auction is supported)
  const { data: allAuctions, isLoading: isLoadingAuctions } = useReadContract(
    getAllAuctions,
    {
      contract: marketplace,
      queryOptions: { enabled: isNftCollection && SUPPORT_AUCTION },
    }
  );
  console.log("All Auctions:", allAuctions);  // Debug: Log all auctions

  // Fetch supply information for the NFT collection
  const { data: supplyInfo, isLoading: isLoadingSupplyInfo } = useReadContract(
    getSupplyInfo,
    {
      contract,
    }
  );
  console.log("Supply Info:", supplyInfo);  // Debug: Log supply information

  // Loading state
  const isLoading =
    isChecking1155 ||
    isChecking721 ||
    isLoadingAuctions ||
    isLoadingContractMetadata ||
    isLoadingValidListings ||
    isLoadingSupplyInfo;
  console.log("Is Loading:", isLoading);  // Debug: Log loading state

  // Fetch supported tokens for the marketplace
  const supportedTokens: Token[] =
    SUPPORTED_TOKENS.find(
      (item) => item.chain.id === marketplaceContract.chain.id
    )?.tokens || [];
  console.log("Supported Tokens:", supportedTokens);  // Debug: Log supported tokens

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceContract: marketplace,
        nftContract: contract,
        isLoading,
        type: is1155 ? "ERC1155" : "ERC721",
        allValidListings,
        allAuctions,
        contractMetadata,
        refetchAllListings,
        isRefetchingAllListings,
        listingsInSelectedCollection,
        supplyInfo,
        supportedTokens,
      }}
    >
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      "useMarketplaceContext must be used inside MarketplaceProvider"
    );
  }
  return context;
}
