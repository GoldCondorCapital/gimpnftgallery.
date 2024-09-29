import { client } from "@/consts/client";
import { balanceOf, getNFT as getERC1155 } from "thirdweb/extensions/erc1155";
import { getNFT as getERC721 } from "thirdweb/extensions/erc721";
import { MediaRenderer, useActiveAccount, useReadContract } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { NftAttributes } from "./NftAttributes";
import { CreateListing } from "./CreateListing";
import { useMarketplaceContext } from "hooks/useMarketplaceContext";
import dynamic from "next/dynamic";
import { NftDetails } from "./NftDetails";
import RelatedListings from "./RelatedListings";
import "../../styles/global.css";

// Dynamic imports for components to prevent SSR issues
const CancelListingButton = dynamic(() => import("./CancelListingButton"), {
  ssr: false,
});
const BuyFromListingButton = dynamic(() => import("./BuyFromListingButton"), {
  ssr: false,
});

// Define the NftAttribute type
interface NftAttribute {
  trait_type: string;
  value: string | number;
}

type Props = {
  tokenId: bigint;
};

export function Token(props: Props) {
  const {
    type,
    nftContract,
    allAuctions,
    isLoading,
    contractMetadata,
    isRefetchingAllListings,
    listingsInSelectedCollection,
  } = useMarketplaceContext();
  const { tokenId } = props;
  const account = useActiveAccount();

  // Fetch NFT data using the appropriate contract
  const { data: nft, isLoading: isLoadingNFT } = useReadContract(
    type === "ERC1155" ? getERC1155 : getERC721,
    {
      tokenId: BigInt(tokenId),
      contract: nftContract,
      includeOwner: true,
    }
  );

  // Fetch the owned quantity for ERC1155 tokens
  const { data: ownedQuantity1155 } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address!,
    tokenId: tokenId,
    queryOptions: {
      enabled: !!account?.address && type === "ERC1155",
    },
  });

  // Filter listings and auctions for the current NFT
  const listings = (listingsInSelectedCollection || []).filter(
    (item) =>
      item.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase() &&
      item.asset.id === BigInt(tokenId)
  );

  const auctions = (allAuctions || []).filter(
    (item) =>
      item.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase() &&
      item.asset.id === BigInt(tokenId)
  );

  // Check if all required data is loaded
  const allLoaded = !isLoadingNFT && !isLoading && !isRefetchingAllListings;

  // Check if the NFT is owned by the current account
  const ownedByYou = nft?.owner?.toLowerCase() === account?.address.toLowerCase();

  // Safely cast attributes to the defined NftAttribute[] type
  const attributes: NftAttribute[] = Array.isArray(nft?.metadata?.attributes)
    ? (nft.metadata.attributes as NftAttribute[])
    : [];

  // Fallback Image URL
  const fallbackImageUrl = "/Digital_Gallery_Images/new batch 17_s.png";

  // Handle image URL, fallback if necessary
  const imageUrl = nft?.metadata.image
    ? nft.metadata.image.startsWith("ipfs://")
      ? nft.metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      : nft.metadata.image
    : fallbackImageUrl;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24px', margin: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', width: '90vw' }}>
        <div style={{ width: '45vw' }}>
          {/* Display the NFT Image with fallback */}
          <img src={imageUrl} alt={nft?.metadata.name || "NFT Image"} style={{ maxWidth: '50%', aspectRatio: '1' }} onError={(e) => (e.currentTarget.src = fallbackImageUrl)} />
          <div>
            {/* Display Description if it exists */}
            {nft?.metadata.description && (
              <div>
                <strong>Description</strong>
                <p>{nft.metadata.description}</p>
              </div>
            )}

            {/* Render NftAttributes Component if attributes are available */}
            {attributes && attributes.length > 0 && <NftAttributes attributes={attributes} />}
            {nft && <NftDetails nft={nft} />}
          </div>
        </div>

        <div style={{ width: '45vw' }}>
          <div>
            {/* Display Collection Information */}
            <strong>Collection: </strong>{contractMetadata?.name}
            <a href={`/collection/${nftContract.chain.id}/${nftContract.address}`} target="_blank">
              (External Link)
            </a>
          </div>
          <p># {nft?.id.toString()}</p>
          <h1>{nft?.metadata.name}</h1>

          {/* Display Owner Information */}
          {type === "ERC1155" ? (
            <>
              {account && ownedQuantity1155 && (
                <div>
                  <strong>You own: </strong>
                  <p>{ownedQuantity1155.toString()}</p>
                </div>
              )}
            </>
          ) : (
            <div>
              <strong>Current owner: </strong>
              <p>{nft?.owner ? shortenAddress(nft.owner) : "N/A"} {ownedByYou && "(You)"}</p>
            </div>
          )}

          {/* Display CreateListing Button if owned by the user */}
          {account && nft && (ownedByYou || (ownedQuantity1155 && ownedQuantity1155 > 0n)) && (
            <CreateListing tokenId={nft?.id} account={account} />
          )}

          {/* Render Listings */}
          <div>
            <strong>Listings ({listings.length})</strong>
            {listings.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Price</th>
                    {type === "ERC1155" && <th>Qty</th>}
                    <th>Expiration</th>
                    <th>From</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((item) => (
                    <tr key={item.id.toString()}>
                      <td>{item.currencyValuePerToken.displayValue} {item.currencyValuePerToken.symbol}</td>
                      {type === "ERC1155" && <td>{item.quantity.toString()}</td>}
                      <td>{getExpiration(item.endTimeInSeconds)}</td>
                      <td>{item.creatorAddress.toLowerCase() === account?.address.toLowerCase() ? "You" : shortenAddress(item.creatorAddress)}</td>
                      <td>
                        {account && item.creatorAddress.toLowerCase() !== account?.address.toLowerCase() ? (
                          <BuyFromListingButton account={account} listing={item} />
                        ) : (
                          <CancelListingButton account={account} listingId={item.id} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>This item is not listed for sale</p>
            )}
          </div>

          {/* Render Related Listings */}
          <RelatedListings excludedListingId={listings[0]?.id ?? -1n} />
        </div>
      </div>
    </div>
  );
}

// Utility function to get expiration date in readable format
function getExpiration(endTimeInSeconds: bigint) {
  const milliseconds = Number(endTimeInSeconds) * 1000;
  const futureDate = new Date(milliseconds);
  return futureDate.toDateString();
}
