//layout.tsx

import "styles/global.css"; // Ensure the path is correct for your file structure

export default function TokenPage({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="navbar">
            <a href="/" className="logo">
              The Digital Art Gallery
            </a>
            <div className="profile-menu">
              <a href="/profile">Profile</a>
              <button className="theme-toggle">Toggle Theme</button>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
