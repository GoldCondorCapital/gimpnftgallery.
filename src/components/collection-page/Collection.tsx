import { MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFT as getNFT721 } from "thirdweb/extensions/erc721";
import { getNFT as getNFT1155 } from "thirdweb/extensions/erc1155";
import { client } from "../../consts/client";
import { useState } from "react";
import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";
import { ListingGrid } from "./ListingGrid";
import { AllNftsGrid } from "./AllNftsGrid";
import "../../styles/global.css"; // Assuming you're using global.css

export function Collection() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const {
    type,
    nftContract,
    isLoading,
    contractMetadata,
    listingsInSelectedCollection,
    supplyInfo,
  } = useMarketplaceContext();

  const { data: firstNFT, isLoading: isLoadingFirstNFT } = useReadContract(
    type === "ERC1155" ? getNFT1155 : getNFT721,
    {
      contract: nftContract,
      tokenId: BigInt(0),
      queryOptions: {
        enabled: isLoading || !!contractMetadata?.image,
      },
    }
  );

  const thumbnailImage =
    contractMetadata?.image || firstNFT?.metadata.image || "";

  return (
    <>
      <div className="container">
        <div className="media-wrapper">
          <MediaRenderer
            client={client}
            src={thumbnailImage}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: "20px",
              width: "200px",
              height: "200px",
            }}
          />
          <h1 className="heading">
            {contractMetadata?.name || "Unknown collection"}
          </h1>
          {contractMetadata?.description && (
            <p className="description">
              {contractMetadata.description}
            </p>
          )}

          <div className="tabs">
            <div className="tab-list">
              <button
                className={`tab ${tabIndex === 0 ? "active-tab" : ""}`}
                onClick={() => setTabIndex(0)}
              >
                Listings ({listingsInSelectedCollection.length || 0})
              </button>
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
      <div className="content-wrapper">
        {tabIndex === 0 && <ListingGrid />}
        {tabIndex === 1 && <AllNftsGrid />}
      </div>
    </>
  );
}
