"use client";

import Link from "next/link";
import "../styles/global.css";
import { NFT_CONTRACTS } from "../consts/nft_contracts"; // Assuming NFT_CONTRACTS is a list of NFT collections

// Array of frame colors for dynamic assignment
const frameColors = ["#c2830c", "#ffcc00", "#ff5722", "#4caf50", "#3f51b5", "#e91e63", "#795548"];

export default function Home() {
  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-section box frame-content">
        <h1 className="heading">Welcome to Ock's Digital Art Gallery</h1>
        <p className="subheading">Explore a vast collection of Digital Art and NFTs</p>
      </div>

      {/* Navigation Section */}
      <div className="navigation-section frame-content">
        <Link href="/profile">
          <button className="collection-button">Your NFT Collection</button>
        </Link>
        <Link href="/listed">
          <button className="collection-button">Your Listed NFTs</button>
        </Link>
      </div>

      {/* Trending Collections Section */}
      <h2 className="trending-heading">99 Billion Gimps by Ock</h2>
      <div className="nft-grid frame-content">
        {NFT_CONTRACTS.map((item, index) => (
          <Link
            key={item.address}
            href={`/collection/${item.chain.id.toString()}/${item.address}`}
          >
            <div
              className="frame-container colored-frame"
              style={{ borderColor: frameColors[index % frameColors.length] }} // Apply dynamic frame color
            >
              {/* Background Image (Frame) */}
              <img
                src={`/Digital_Gallery_Images/4.png`} // Placeholder background image for frame
                alt="Frame"
                className="frame-background"
              />
              {/* Foreground Image (NFT Image) */}
              <img
                src={`/Digital_Gallery_Images/background.png`} // New Image for NFTs
                alt={item.title}
                className="nft-image"
              />
              <p className="nft-title">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Content Box for Styling */}
      <div className="extra-content-box frame-content">
        <h2 className="heading">More to Explore</h2>
        <p className="subheading">Stay tuned for upcoming collections and surprises!</p>
      </div>
    </div>
  );
}
