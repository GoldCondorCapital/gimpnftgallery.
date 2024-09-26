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

const CancelListingButton = dynamic(() => import("./CancelListingButton"), {
  ssr: false,
});
const BuyFromListingButton = dynamic(() => import("./BuyFromListingButton"), {
  ssr: false,
});

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

  const { data: nft, isLoading: isLoadingNFT } = useReadContract(
    type === "ERC1155" ? getERC1155 : getERC721,
    {
      tokenId: BigInt(tokenId),
      contract: nftContract,
      includeOwner: true,
    }
  );

  const { data: ownedQuantity1155 } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address!,
    tokenId: tokenId,
    queryOptions: {
      enabled: !!account?.address && type === "ERC1155",
    },
  });

  const listings = (listingsInSelectedCollection || []).filter(
    (item) =>
      item.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId)
  );

  const auctions = (allAuctions || []).filter(
    (item) =>
      item.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId)
  );

  const allLoaded = !isLoadingNFT && !isLoading && !isRefetchingAllListings;

  const ownedByYou =
    nft?.owner?.toLowerCase() === account?.address.toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24px', margin: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', width: '90vw' }}>
        <div style={{ width: '45vw' }}>
          <img src={nft?.metadata.image} alt={nft?.metadata.name} style={{ maxWidth: '100%', aspectRatio: '1' }} />
          <div>
            {nft?.metadata.description && (
              <div>
                <strong>Description</strong>
                <p>{nft.metadata.description}</p>
              </div>
            )}

            {nft?.metadata?.attributes?.length > 0 && (
              <NftAttributes attributes={nft.metadata.attributes} />
            )}

            {nft && <NftDetails nft={nft} />}
          </div>
        </div>

        <div style={{ width: '45vw' }}>
          <div>
            <strong>Collection: </strong>{contractMetadata?.name}
            <a href={`/collection/${nftContract.chain.id}/${nftContract.address}`} target="_blank">
              (External Link)
            </a>
          </div>
          <p># {nft?.id.toString()}</p>
          <h1>{nft?.metadata.name}</h1>

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

          {account && nft && (ownedByYou || (ownedQuantity1155 && ownedQuantity1155 > 0n)) && (
            <CreateListing tokenId={nft?.id} account={account} />
          )}

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
                  {listings.map((item) => {
                    const listedByYou = item.creatorAddress.toLowerCase() === account?.address.toLowerCase();
                    return (
                      <tr key={item.id.toString()}>
                        <td>{item.currencyValuePerToken.displayValue} {item.currencyValuePerToken.symbol}</td>
                        {type === "ERC1155" && <td>{item.quantity.toString()}</td>}
                        <td>{getExpiration(item.endTimeInSeconds)}</td>
                        <td>{listedByYou ? "You" : shortenAddress(item.creatorAddress)}</td>
                        <td>
                          {account && !listedByYou ? (
                            <BuyFromListingButton account={account} listing={item} />
                          ) : (
                            <CancelListingButton account={account} listingId={item.id} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>This item is not listed for sale</p>
            )}
          </div>

          <RelatedListings excludedListingId={listings[0]?.id ?? -1n} />
        </div>
      </div>
    </div>
  );
}

function getExpiration(endTimeInSeconds: bigint) {
  const currentDate = new Date();
  const milliseconds: bigint = endTimeInSeconds * 1000n;
  const futureDate = new Date(currentDate.getTime() + Number(milliseconds));
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    timeZoneName: "short",
  };
  
  return futureDate.toLocaleDateString("en-US", options);
}
