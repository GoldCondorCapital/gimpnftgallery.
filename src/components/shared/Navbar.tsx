"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers'; // Correct import for ethers v6
import styles from '../../app/styles/Navbar.module.css';

export function Navbar() {
  const [account, setAccount] = useState<string | null>(null);

  // Check if MetaMask is installed and connect to it
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider); // Cast to Eip1193Provider
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address); // User is already connected
          }
        } catch (error) {
          console.error("Error fetching accounts", error);
        }
      }
    };
    checkMetaMaskConnection();
  }, []);

  const handleLoginLogout = async () => {
    if (account) {
      setAccount(null); // Disconnect wallet
    } else {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider); // Cast to Eip1193Provider
          await provider.send("eth_requestAccounts", []); // Prompt MetaMask to connect
          const signer = await provider.getSigner(); // Await the promise to resolve the signer object
          const userAccount = await signer.getAddress(); // Get the connected address
          setAccount(userAccount); // Set account after successful connection
        } catch (error) {
          console.error("MetaMask connection failed", error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
      }
    }
  };

  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        The Digital Art Gallery
      </Link>
      <div className={styles.profileMenu}>
        <ProfileButton account={account} handleLoginLogout={handleLoginLogout} />
      </div>
    </div>
  );
}

interface ProfileButtonProps {
  account: string | null;
  handleLoginLogout: () => void;
}

function ProfileButton({ account, handleLoginLogout }: ProfileButtonProps) {
  return account ? (
    <div>
      <p>{`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`}</p>
      <button onClick={handleLoginLogout}>Disconnect</button>
    </div>
  ) : (
    <button onClick={handleLoginLogout}>Connect Wallet</button>
  );
}
