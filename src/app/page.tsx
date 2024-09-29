"use client";

import Link from "next/link";
import "../styles/global.css";
import { NFT_CONTRACTS } from "../consts/nft_contracts"; // Assuming NFT_CONTRACTS is a list of NFT collections

export default function Home() {
  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="heading">Welcome to Ock's Digital Art Gallery</h1>
        <p className="subheading">Explore a vast collection of Digital Art and NFTs</p>
      </div>

      {/* Navigation Section */}
      <div className="navigation-section">
        <Link href="/profile">
          <button className="collection-button">Your NFT Collection</button>
        </Link>
        <Link href="/listed">
          <button className="collection-button">Your Listed NFTs</button>
        </Link>
      </div>

      {/* Trending Collections Section */}
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
                src={`/Digital_Gallery_Images/4.png`} // Placeholder background image for frame
                alt="Frame"
                className="frame-background"
              />
              {/* Foreground Image (NFT Image) */}
              <img
                src={`/Digital_Gallery_Images/new batch 17_s.png`} // New Image for NFTs
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
