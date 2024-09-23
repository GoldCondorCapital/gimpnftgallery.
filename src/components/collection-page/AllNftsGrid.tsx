"use client";

import { client } from "@/consts/client";
import { useMarketplaceContext } from "../../hooks/useMarketplaceContext";
import Link from "next/link";
import { useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getNFTs as getNFTs1155 } from "thirdweb/extensions/erc1155";
import { getNFTs as getNFTs721 } from "thirdweb/extensions/erc721";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import "../app/styles//global.css";

export function AllNftsGrid() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const { nftContract, type, supplyInfo } = useMarketplaceContext();
  const startTokenId = supplyInfo?.startTokenId ?? 0n;
  const totalItems: bigint = supplyInfo
    ? supplyInfo.endTokenId - supplyInfo.startTokenId + 1n
    : 0n;
  const numberOfPages: number = Number(
    (totalItems + BigInt(itemsPerPage) - 1n) / BigInt(itemsPerPage)
  );
  const pages: { start: number; count: number }[] = [];

  for (let i = 0; i < numberOfPages; i++) {
    const currentStartTokenId = startTokenId + BigInt(i * itemsPerPage);
    const remainingItems = totalItems - BigInt(i * itemsPerPage);
    const count =
      remainingItems < BigInt(itemsPerPage)
        ? Number(remainingItems)
        : itemsPerPage;
    pages.push({ start: Number(currentStartTokenId), count: count });
  }
  const { data: allNFTs } = useReadContract(
    type === "ERC1155" ? getNFTs1155 : getNFTs721,
    {
      contract: nftContract,
      start: pages[currentPageIndex].start,
      count: pages[currentPageIndex].count,
    }
  );
  const len = allNFTs?.length ?? 0;

  console.log({ pages, currentPageIndex, length: pages.length });

  return (
    <>
      <div className="nft-grid-container">
        {allNFTs && allNFTs.length > 0 ? (
          allNFTs.map((item) => (
            <div className="nft-card" key={item.id}>
              <Link href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.id.toString()}`}>
                <div className="nft-card-content">
                  <MediaRenderer client={client} src={item.metadata.image} />
                  <p>{item.metadata?.name ?? "Unknown item"}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>

      <div className="pagination-container">
        <button
          onClick={() => setCurrentPageIndex(0)}
          disabled={currentPageIndex === 0}
          className="pagination-button"
        >
          <MdKeyboardDoubleArrowLeft />
        </button>
        <button
          disabled={currentPageIndex === 0}
          onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
          className="pagination-button"
        >
          <RiArrowLeftSLine />
        </button>
        <span>
          Page {currentPageIndex + 1} of {pages.length}
        </span>
        <button
          disabled={currentPageIndex === pages.length - 1}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
          className="pagination-button"
        >
          <RiArrowRightSLine />
        </button>
        <button
          onClick={() => setCurrentPageIndex(pages.length - 1)}
          disabled={currentPageIndex === pages.length - 1}
          className="pagination-button"
        >
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>
    </>
  );
}
