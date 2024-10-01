"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '@/consts/client'; // Use the updated client
import { useActiveAccount, useConnectModal } from "thirdweb/react"; // Use thirdweb hooks
import styles from '../../styles/Navbar.module.css'; // CSS file for Navbar styling

export function Navbar() {
  const [account, setAccount] = useState<string | null>(null);
  const activeAccount = useActiveAccount(); // Check for active account
  const { connect, disconnect } = useConnectModal(); // Use thirdweb's connect/disconnect

  useEffect(() => {
    if (activeAccount) {
      setAccount(activeAccount.address); // Set account if already connected
    }
  }, [activeAccount]);

  const handleLoginLogout = async () => {
    if (account) {
      setAccount(null); // Clear account on disconnect
      disconnect(); // Call disconnect function
    } else {
      await connect({ client }); // Use the updated client configuration for connection
    }
  };

  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Back to Start 
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
