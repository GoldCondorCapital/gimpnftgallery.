import { client } from "@/consts/client";
import { useMarketplaceContext } from "hooks/useMarketplaceContext";
import { toEther } from "thirdweb";
import Link from "next/link";
import { useState } from "react";
import "../../styles/global.css"; // Import global styles

export default function RelatedListings({
  excludedListingId,
}: {
  excludedListingId: bigint;
}) {
  const { nftContract, allValidListings } = useMarketplaceContext();
  const [isOpen, setIsOpen] = useState(false); // For managing accordion open state

  // Filter out excluded listing and ensure the correct contract address
  const listings = allValidListings?.filter(
    (o) =>
      o.id !== excludedListingId &&
      o.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase()
  );

  if (!listings || !listings.length) return null;

  const toggleAccordion = () => setIsOpen(!isOpen);

  // Fallback image for NFTs without an image
  const fallbackImage = "/Digital_Gallery_Images/background.png";

// Use contract metadata image if available, otherwise fallback to default image
  const thumbnailImage = contractMetadata?.image || fallbackImage;
  
  return (
    <div className="accordion-item">
      <button className="accordion-button" onClick={toggleAccordion}>
        <span className="accordion-title">More from this collection</span>
        <span className="accordion-icon">{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && (
        <div className="accordion-panel">
          <div className="listings-container">
            {listings?.map((item) => (
              <div key={item.id.toString()} className="listing-card">
                <Link
                  href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}
                  className="listing-link"
                >
                  <div className="listing-content">
                    {/* Use a standard HTML <img> tag for displaying images */}
                    <img
                      src={item.asset.metadata.image || fallbackImage}
                      alt={item.asset.metadata?.name ?? "Unknown item"}
                      className="nft-thumbnail"
                      onError={(e) => (e.currentTarget.src = fallbackImage)} // Fallback image handler
                    />
                    <p className="nft-title">{item.asset.metadata?.name ?? "Unknown item"}</p>
                    <p className="nft-price">Price</p>
                    <p className="nft-value">
                      {toEther(item.pricePerToken)} {item.currencyValuePerToken.symbol}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
