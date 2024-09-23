import { blo } from "blo";
import { shortenAddress } from "thirdweb/utils";
import { useState, useEffect } from "react";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import { OwnedItem } from "./OwnedItem";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import Link from "next/link";
import { getOwnedERC1155s } from "@/extensions/getOwnedERC1155s";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import "../styles/global.css"; // Import global CSS

type Props = {
  address: string;
};

export function ProfileSection(props: Props) {
  const { address } = props;
  
  // Log props and ensure address is correct
  console.log('ProfileSection Address:', address);

  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  
  // Debug active account
  console.log('Active account:', account);

  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });

  // Log ENS data
  console.log('ENS Name:', ensName);
  console.log('ENS Avatar:', ensAvatar);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS.length > 0 ? NFT_CONTRACTS[0] : null // Check if the array is populated
  );

  useEffect(() => {
    if (!selectedCollection) {
      console.error('No selected collection available');
    }
  }, [selectedCollection]);

  const contract = getContract({
    address: selectedCollection?.address,
    chain: selectedCollection?.chain,
    client,
  });

  const {
    data,
    isLoading: isLoadingOwnedNFTs,
  } = useReadContract(
    selectedCollection?.type === "ERC1155" ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 50,
      queryOptions: {
        enabled: !!address,
      },
    }
  );

  // Debug data from contracts
  console.log('Owned NFTs Data:', data);
  
  const chain = contract?.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain?.id
  )?.address;

  if (!marketplaceContractAddress) {
    console.error("No marketplace contract found");
    return null; // Avoid breaking the app
  }

  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });

  const { data: allValidListings, isLoading: isLoadingValidListings } =
    useReadContract(getAllValidListings, {
      contract: marketplaceContract,
      queryOptions: { enabled: data && data.length > 0 },
    });

  const listings = allValidListings?.length
    ? allValidListings.filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
            contract?.address.toLowerCase() &&
          item.creatorAddress.toLowerCase() === address.toLowerCase()
      )
    : [];

  return (
    <div className="profile-section-container">
      <div className="profile-header">
        <img
          src={ensAvatar ?? blo(address as `0x${string}`)}
          alt="Profile Avatar"
          className="profile-avatar"
        />
        <div>
          <h2>{ensName ?? "Unnamed"}</h2>
          <p className="profile-address">{shortenAddress(address)}</p>
        </div>
      </div>

      <div className="profile-content">
        <ProfileMenu
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        {isLoadingOwnedNFTs ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="tabs-container">
              <div className="tabs">
                <button
                  className={`tab-button ${tabIndex === 0 ? "active" : ""}`}
                  onClick={() => setTabIndex(0)}
                >
                  Owned ({data?.length})
                </button>
                <button
                  className={`tab-button ${tabIndex === 1 ? "active" : ""}`}
                  onClick={() => setTabIndex(1)}
                >
                  Listings ({listings.length || 0})
                </button>
              </div>
              <Link
                href={`/collection/${selectedCollection?.chain.id}/${selectedCollection?.address}`}
                className="view-collection-link"
              >
                View collection
              </Link>
            </div>

            <div className="grid-container">
              {tabIndex === 0 ? (
                data && data.length > 0 ? (
                  data?.map((item) => (
                    <OwnedItem
                      key={item.id.toString()}
                      nftCollection={contract}
                      nft={item}
                    />
                  ))
                ) : (
                  <div>
                    <p>
                      {isYou ? "You" : ensName ? ensName : shortenAddress(address)}{" "}
                      {isYou ? "do" : "does"} not own any NFT in this collection
                    </p>
                  </div>
                )
              ) : (
                listings && listings.length > 0 ? (
                  listings?.map((item) => (
                    <div className="nft-card" key={item.id}>
                      <Link
                        href={`/collection/${contract?.chain.id}/${contract?.address}/token/${item.asset.id.toString()}`}
                        className="nft-link"
                      >
                        <div className="nft-card-content">
                          <MediaRenderer
                            client={client}
                            src={item.asset.metadata.image}
                          />
                          <p>{item.asset?.metadata?.name ?? "Unknown item"}</p>
                          <p>Price</p>
                          <p>{toEther(item.pricePerToken)} {item.currencyValuePerToken.symbol}</p>
                        </div>
                      </Link>
                    </div>
                ))
                ) : (
                  <div>
                    You do not have any listing with this collection
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
