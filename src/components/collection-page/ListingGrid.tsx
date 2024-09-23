import { client } from "@/consts/client";
import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";

import Link from "next/link";
import { MediaRenderer } from "thirdweb/react";
import "../styles/global.css"; // Assuming you're using a global CSS file

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;

  if (!listingsInSelectedCollection || !len) return null;

  return (
    <div className="grid-container">
      {listingsInSelectedCollection.map((item) => (
        <div className="grid-card" key={item.id}>
          <Link href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}>
            <div className="card-content">
              <MediaRenderer client={client} src={item.asset.metadata.image} />
              <p className="nft-name">{item.asset?.metadata?.name ?? "Unknown item"}</p>
              <p className="nft-price">Price</p>
              <p className="nft-value">
                {item.currencyValuePerToken.displayValue}{" "}
                {item.currencyValuePerToken.symbol}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
