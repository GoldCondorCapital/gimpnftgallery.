"use client"; // Next.js directive to mark the component as client-side

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../../app/styles/Navbar.module.css';

// Define the type for ProfileButton props
interface ProfileButtonProps {
  isLoggedIn: boolean;
  handleLoginLogout: () => void;
}

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Simulate user login state persisting across sessions (optional)
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Toggle between login and logout
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.setItem('isLoggedIn', 'false'); // Clear local storage on logout
    } else {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Set local storage on login
    }
  };

  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        The Digital Art Gallery
      </Link>
      <div className={styles.profileMenu}>
        {/* Profile Section */}
        <ProfileButton isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
        {/* Toggle theme button */}
        <button className={styles.themeButton} onClick={() => { /* Theme toggle logic here */ }}>
          {/* Theme toggle button logic */}
        </button>
      </div>
    </div>
  );
}

// ProfileButton component with typed props
function ProfileButton({ isLoggedIn, handleLoginLogout }: ProfileButtonProps) {
  return isLoggedIn ? (
    <div>
      <Link href="/profile">Profile</Link>
      <button onClick={handleLoginLogout}>Logout</button>
    </div>
  ) : (
    <div>
      <Link href="/login">Login</Link>
      <button onClick={handleLoginLogout}>Login</button>
    </div>
  );
}
