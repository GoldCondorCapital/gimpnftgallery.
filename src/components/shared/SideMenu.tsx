"use client";

import { createThirdwebClient } from "thirdweb"; // Import the createThirdwebClient function
import { useGetENSAvatar } from "../../hooks/useGetENSAvatar";
import { useGetENSName } from "../../hooks/useGetENSName";
import { useState, useRef } from "react";
import Link from "next/link";
import { FaRegMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import "../styles/global.css"; // Import global styles

// Create a ThirdwebClient instance
const client = createThirdwebClient({
  clientId: "NEXT_PUBLIC_TW_CLIENT_ID", // Replace this with your actual client ID
});

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const { data: ensName } = useGetENSName({ address: account?.address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const wallet = useActiveWallet();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger-button" ref={btnRef} onClick={toggleMenu}>
        &#9776; {/* Hamburger Icon */}
      </button>

      {/* Sidebar Drawer */}
      <div className={`side-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FaRegMoon /> : <IoSunny />}
          </button>
          <button className="close-button" onClick={toggleMenu}>
            &times; {/* Close Icon */}
          </button>
        </div>
        <div className="drawer-body">
          <div>
            <ConnectButton theme={isDarkMode ? "dark" : "light"} client={client} />
          </div>
          {account && (
            <Link href="/profile">
              Profile {ensName ? `(${ensName})` : ""}
            </Link>
          )}
        </div>
        <div className="drawer-footer">
          {account && (
            <button
              className="logout-button"
              onClick={() => {
                if (wallet) disconnect(wallet);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Backdrop for when the drawer is open */}
      {isOpen && <div className="backdrop" onClick={toggleMenu}></div>}
    </>
  );
}
