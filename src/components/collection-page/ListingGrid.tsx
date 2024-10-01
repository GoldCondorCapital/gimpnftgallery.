import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";
import Link from "next/link";
import "../../styles/global.css"; // Assuming you're using a global CSS file

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;

  if (!listingsInSelectedCollection || !len) return null;

  return (
    <div className="listing-grid-container">
      {listingsInSelectedCollection.map((item) => (
        <div className="listing-card" key={item.id}>
          <Link
            href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}
            className="listing-link"
          >
            <div className="listing-card-content">
              {/* Removed the image and only display NFT details */}
              <p className="nft-name">{item.asset?.metadata?.name ?? "Unknown item"}</p>
              <p className="nft-price-label">Price</p>
              <p className="nft-price">
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
