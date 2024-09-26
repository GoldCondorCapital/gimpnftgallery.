"use client";

import { NFT_CONTRACTS } from "../consts/nft_contracts";
import Link from "next/link";
import "../styles/global.css"; // Corrected path for global.css

export default function Home() {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1 className="heading">Welcome to Ock's Digital Art Gallery</h1>
        <p className="subheading">Explore a vast collection of Digital Art and NFTs</p>
      </div>

      <h2 className="trending-heading">Trending Collections</h2>

      <div className="nft-grid">
        {NFT_CONTRACTS.map((item) => (
          <Link
            key={item.address}
            href={`/collection/${item.chain.id.toString()}/${item.address}`}
          >
            <div className="frame-container">
              {/* Background Image (Frame) */}
              <img
                src={`/Digital_Gallery_Images/4.png`}
                alt="Frame"
                className="frame-background"
              />
              {/* Foreground Image (NFT Image) */}
              <img
                src={`/Digital_Gallery_Images/new batch 17_s.png`}
                alt={item.title}
                className="nft-image"
              />
              <p className="nft-title">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}




