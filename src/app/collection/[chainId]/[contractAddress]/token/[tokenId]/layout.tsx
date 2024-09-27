import "styles/global.css"; // Global styles
import "styles/Navbar.module.css"; // Navbar-specific styles

export default function TokenPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="full-height-body">
      <header>
        {/* Apply the existing CSS styles from Navbar.module.css */}
        <nav className="navbar">
          {/* Modified link to use a button-like class */}
          <a href="/profile" className="collection-button">
            Your NFT Collection
          </a>
        </nav>
      </header>

      {/* Main content area and footer in a flex container */}
      <div className="content-container">
        <main className="main-content">
          {/* Ensure the frame content fits correctly within the box */}
          <div className="frame-content">{children}</div>
        </main>
        <footer className="footer">
          <p>© 2024 The Digital Art Gallery. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
