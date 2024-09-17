"use client";

import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { useState, useRef } from "react";
import Link from "next/link";
import { FaRegMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import "../styles/global.css"; // Import global styles

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const { data: ensName } = useGetENSName({ address: account?.address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const wallet = useActiveWallet();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger-button" ref={btnRef} onClick={toggleMenu}>
        &#9776; {/* Hamburger Icon */}
      </button>

      {/* Sidebar Drawer */}
      <div className={`side-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button className="theme-toggle" onClick={toggleColorMode}>
            {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
          </button>
          <button className="close-button" onClick={toggleMenu}>
            &times; {/* Close Icon */}
          </button>
        </div>
        <div className="drawer-body">
          <div>
            <ConnectButton theme={colorMode} client={client} />
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
