"use client";

import { client } from "@/consts/client";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { SUPPORTED_TOKENS, Token } from "@/consts/supported_tokens";
import { getSupplyInfo, SupplyInfo } from "../extensions/getLargestCirculatingTokenId";
import { createContext, type ReactNode, useContext } from "react";
import { getContract, type ThirdwebContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { isERC721 } from "thirdweb/extensions/erc721";
import { type DirectListing, type EnglishAuction, getAllAuctions, getAllValidListings } from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import "../styles/global.css"; // Import global styles

export type NftType = "ERC1155" | "ERC721";

// Context type definition
type TMarketplaceContext = {
  marketplaceContract: ThirdwebContract;
  nftContract: ThirdwebContract;
  type: NftType;
  isLoading: boolean;
  allValidListings: DirectListing[] | undefined;
  allAuctions: EnglishAuction[] | undefined;
  contractMetadata: Record<string, any> | undefined;
  refetchAllListings: Function;
  isRefetchingAllListings: boolean;
  listingsInSelectedCollection: DirectListing[];
  supplyInfo: SupplyInfo | undefined;
  supportedTokens: Token[];
};

// Create context for marketplace data
const MarketplaceContext = createContext<TMarketplaceContext | undefined>(undefined);

// Provider component for the marketplace context
export default function MarketplaceProvider({
  chainId,
  contractAddress,
  children,
}: {
  chainId: string;
  contractAddress: string;
  children: ReactNode;
}) {
  const { _chainId, marketplaceContract, collectionSupported } = useMarketplaceContracts(
    chainId,
    contractAddress
  );

  const nftContract = marketplaceContract
  ? setupNFTContract(_chainId, contractAddress, marketplaceContract.chain)
  : undefined;

  const marketplace = setupMarketplaceContract(marketplaceContract);

  const { is721, is1155, isLoading: isNftTypeLoading } = useNftTypeCheck(nftContract);

  const { contractMetadata, isLoading: isMetadataLoading } = useContractMetadata(nftContract, is1155 || is721);

  const { allValidListings, refetchAllListings, isRefetchingAllListings } = useListings(
    marketplace,
    is1155 || is721
  );

  const listingsInSelectedCollection = filterListings(allValidListings, nftContract);

  const { allAuctions, isLoading: isAuctionLoading } = useAuctions(marketplace, is1155 || is721);

  const { supplyInfo, isLoading: isSupplyInfoLoading } = useSupplyInfo(nftContract);

  const supportedTokens = getSupportedTokens(marketplaceContract.chain.id);

  const isLoading = isNftTypeLoading || isMetadataLoading || isAuctionLoading || isSupplyInfoLoading;

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceContract: marketplace,
        nftContract,
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
      {isLoading && <LoadingOverlay />} {/* Use LoadingOverlay component */}
    </MarketplaceContext.Provider>
  );
}

// Loading overlay component using standard HTML and global CSS
function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}

// Utility functions and hooks for cleaner component logic

// Centralized hook to check for ERC1155 or ERC721 types
function useNftTypeCheck(contract: ThirdwebContract) {
  const { data: is721, isLoading: is721Loading } = useReadContract(isERC721, { contract });
  const { data: is1155, isLoading: is1155Loading } = useReadContract(isERC1155, { contract });
  return { is721, is1155, isLoading: is721Loading || is1155Loading };
}

// Fetch and handle contract metadata
function useContractMetadata(contract: ThirdwebContract, isEnabled: boolean) {
  return useReadContract(getContractMetadata, { contract, queryOptions: { enabled: isEnabled } });
}

// Fetch and manage all listings for the marketplace
function useListings(marketplace: ThirdwebContract, isEnabled: boolean) {
  const { data, refetch, isRefetching } = useReadContract(getAllValidListings, {
    contract: marketplace,
    queryOptions: { enabled: isEnabled },
  });
  return { allValidListings: data, refetchAllListings: refetch, isRefetchingAllListings: isRefetching };
}

// Filter listings based on selected collection
function filterListings(listings: DirectListing[] | undefined, nftContract: ThirdwebContract) {
  return listings?.filter(
    (item) => item.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase()
  ) || [];
}

function useAuctions(marketplace: ThirdwebContract, isEnabled: boolean) {
  // Ensure that both conditions are properly defined and valid
  const isQueryEnabled = typeof isEnabled === 'boolean' && SUPPORT_AUCTION;

  // Log the values to ensure they are correct (for debugging)
  console.log("isQueryEnabled: ", isQueryEnabled);

  // Use the updated `isQueryEnabled` value in `queryOptions`
  return useReadContract(getAllAuctions, {
    contract: marketplace,
    queryOptions: { enabled: isQueryEnabled },
  });
}



  // Use the updated `isQueryEnabled` value in `queryOptions`
  return useReadContract(getAllAuctions, {
    contract: marketplace,
    queryOptions: { enabled: isQueryEnabled },
  });
}


// Fetch supply information
function useSupplyInfo(contract: ThirdwebContract) {
  return useReadContract(getSupplyInfo, { contract });
}

// Setup the NFT contract
function setupNFTContract(chainId: number, address: string, chain: any) {
  return getContract({ address: address.toLowerCase(), chain, client });
}

// Setup the marketplace contract
function setupMarketplaceContract(marketplaceContract: any) {
  return getContract({ address: marketplaceContract.address, chain: marketplaceContract.chain, client });
}

// Parse and validate marketplace contracts
function useMarketplaceContracts(chainId: string, contractAddress: string) {
  const _chainId = parseChainId(chainId);
  const marketplaceContract = MARKETPLACE_CONTRACTS.find((item) => item.chain.id === _chainId);
  const collectionSupported = NFT_CONTRACTS.find(
    (item) => item.address.toLowerCase() === contractAddress.toLowerCase() && item.chain.id === _chainId
  );
  return { _chainId, marketplaceContract, collectionSupported };
}

// Parse and validate the chain ID
function parseChainId(chainId: string) {
  try {
    const parsedId = Number.parseInt(chainId);
    if (isNaN(parsedId)) throw new Error(`Invalid chain ID: ${chainId}`);
    return parsedId;
  } catch (err) {
    throw new Error(`Error parsing chain ID: ${err}`);
  }
}

// Get supported tokens for a given chain
function getSupportedTokens(chainId: number) {
  return SUPPORTED_TOKENS.find((item) => item.chain.id === chainId)?.tokens || [];
}

// Hook to access the marketplace context
export function useMarketplaceContext() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplaceContext must be used inside MarketplaceProvider");
  }
  return context;
}
