"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import Link from "next/link";
import "../app/styles//global.css"; 





export default function Home() {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1 className="heading">Welcome to The Digital Art Gallery</h1>
        <p className="subheading">Explore a vast collection of Digital Art and NFTs</p>
      </div>

      <h2 className="trending-heading">Trending Collections</h2>

      <div className="nft-grid">
        {NFT_CONTRACTS.map((item) => (
          <Link
            key={item.address}
            href={`/collection/${item.chain.id.toString()}/${item.address}`}
          >
            <div className="nft-card">
              <img src={item.thumbnailUrl} alt={item.title} className="nft-image" />
              <p className="nft-title">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
