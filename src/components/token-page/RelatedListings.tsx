import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { toEther } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import Link from "next/link";
import { useState } from "react";
import "../styles/global.css"; // Import global styles

export default function RelatedListings({
  excludedListingId,
}: {
  excludedListingId: bigint;
}) {
  const { nftContract, allValidListings } = useMarketplaceContext();
  const [isOpen, setIsOpen] = useState(false); // For managing accordion open state

  const listings = allValidListings?.filter(
    (o) =>
      o.id !== excludedListingId &&
      o.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase()
  );
  
  if (!listings || !listings.length) return <></>;

  const toggleAccordion = () => setIsOpen(!isOpen);

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
                    <MediaRenderer
                      client={client}
                      src={item.asset.metadata.image}
                    />
                    <p>{item.asset.metadata?.name ?? "Unknown item"}</p>
                    <p>Price</p>
                    <p>
                      {toEther(item.pricePerToken)}{" "}
                      {item.currencyValuePerToken.symbol}
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
