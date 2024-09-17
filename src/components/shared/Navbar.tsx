"use client"; // Mark it as a client component

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Navbar.module.css'; // Updated path for CSS module

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode'); // Toggle the dark mode class on the body
  };

  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        The Digital Art Gallery
      </Link>
      <div className={styles.profileMenu}>
        {/* Profile Section */}
        <ProfileButton />
        {/* Toggle theme button */}
        <button className={styles.themeButton} onClick={toggleTheme}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}

function ProfileButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Just a mock state

  return isLoggedIn ? (
    <div>
      <Link href="/profile">Profile</Link>
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
    </div>
  ) : (
    <Link href="/login">Login</Link>
  );
}
