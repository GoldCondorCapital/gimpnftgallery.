import { useReadContract } from "thirdweb/react"; // Ensure this is correctly imported
import { getNFTs as getNFTs1155 } from "thirdweb/extensions/erc1155"; // Import the ERC1155 function
import { getNFTs as getNFTs721 } from "thirdweb/extensions/erc721"; // Import the ERC721 function
import { useState } from "react";
import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";
import "../../styles/global.css";

export function AllNftsGrid() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { nftContract, type, supplyInfo } = useMarketplaceContext();

  const itemsPerPage = 20;
  const startTokenId = supplyInfo?.startTokenId ?? 0n;
  const totalItems = supplyInfo
    ? supplyInfo.endTokenId - supplyInfo.startTokenId + 1n
    : 0n;

  const numberOfPages = Number(
    (totalItems + BigInt(itemsPerPage) - 1n) / BigInt(itemsPerPage)
  );
  const pages = [];

  for (let i = 0; i < numberOfPages; i++) {
    const currentStartTokenId = startTokenId + BigInt(i * itemsPerPage);
    const remainingItems = totalItems - BigInt(i * itemsPerPage);
    const count = remainingItems < BigInt(itemsPerPage) ? Number(remainingItems) : itemsPerPage;
    pages.push({ start: Number(currentStartTokenId), count: count });
  }

  const safePageIndex = Math.min(currentPageIndex, pages.length - 1);

  // Use the correct function reference based on the contract type
  const { data: allNFTs, isLoading } = useReadContract(
    type === "ERC1155" ? getNFTs1155 : getNFTs721,
    {
      contract: nftContract,
      start: pages[safePageIndex]?.start || 0,
      count: pages[safePageIndex]?.count || itemsPerPage,
    }
  );

  if (!allNFTs && !isLoading) return <div>No NFTs found in this collection.</div>;

  return (
    <div className="nft-grid-container">
      {allNFTs && allNFTs.length > 0 ? (
        allNFTs.map((item) => (
          <div className="nft-card" key={item.id}>
            <div className="nft-card-content">
              {/* Display the NFT image only if it's available */}
              {item.metadata.image && (
                <img
                  src={item.metadata.image}
                  alt={item.metadata?.name || "NFT Image"}
                  className="nft-image"
                />
              )}
              <p className="nft-name">{item.metadata?.name || "Unknown item"}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}
