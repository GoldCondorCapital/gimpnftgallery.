import { useState } from "react";
import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";
import { ListingGrid } from "./ListingGrid";
import { AllNftsGrid } from "./AllNftsGrid";
import "../../styles/global.css";

export function Collection() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const {
    nftContract,
    isLoading,
    contractMetadata,
    listingsInSelectedCollection,
    supplyInfo,
  } = useMarketplaceContext();

  // Debugging logs to track the state of the data
  console.log("NFT Contract:", nftContract);
  console.log("Is Loading:", isLoading);
  console.log("Contract Metadata:", contractMetadata);
  console.log("Listings in Selected Collection:", listingsInSelectedCollection);
  console.log("Supply Info:", supplyInfo);

  // Use contract metadata image if available
  const thumbnailImage = contractMetadata?.image;

  return (
    <>
      <div className="container">
        <div className="media-wrapper">
          {/* Display the collection image if available */}
          {thumbnailImage ? (
            <img
              src={thumbnailImage}
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "8px",
                width: "200px",
                height: "200px",
                border: "2px solid #ccc",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              alt={contractMetadata?.name || "Collection Image"}
            />
          ) : (
            <div
              style={{
                width: "200px",
                height: "200px",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                border: "2px solid #ccc",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              No Image
            </div>
          )}

          {/* Collection Name */}
          <h1 className="heading">
            {contractMetadata?.name || "Unknown Collection"}
          </h1>

          {/* Collection Description */}
          {contractMetadata?.description && (
            <p className="description">{contractMetadata.description}</p>
          )}

          {/* Tab Navigation for Listings and All Items */}
          <div className="tabs">
            <div className="tab-list">
              {/* Listings Tab */}
              <button
                className={`tab ${tabIndex === 0 ? "active-tab" : ""}`}
                onClick={() => setTabIndex(0)}
              >
                Listings ({listingsInSelectedCollection.length || 0})
              </button>

              {/* All Items Tab */}
              <button
                className={`tab ${tabIndex === 1 ? "active-tab" : ""}`}
                onClick={() => setTabIndex(1)}
              >
                All items{" "}
                {supplyInfo
                  ? `(${(
                      supplyInfo.endTokenId - supplyInfo.startTokenId + 1n
                    ).toString()})`
                  : ""}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Wrapper: Display Listings or All Items based on the selected tab */}
      <div className="content-wrapper">
        {tabIndex === 0 && <ListingGrid />}
        {tabIndex === 1 && <AllNftsGrid />}
      </div>
    </>
  );
}
