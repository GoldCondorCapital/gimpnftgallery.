import { Navbar } from "../components/shared/Navbar"; // Corrected import
import "../styles/global.css";
import { Providers } from "../components/shared/Providers";
import MarketplaceProvider from "../hooks/useMarketplaceContext";

export const metadata = {
  title: "Digital Art Gallery - Profile",
  description: "Profile section of the Digital Art Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: "100px" }}>
        <Providers>
          {/* Ensure you pass actual chainId and contractAddress */}
          <MarketplaceProvider chainId="56" contractAddress="0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9">
            <Navbar /> {/* Navbar should now be properly rendered */}
            {/* Add a container to wrap around the children */}
            <div className="container">{children}</div>
          </MarketplaceProvider>
        </Providers>
      </body>
    </html>
  );
}
