import { Navbar } from "../components/shared/Navbar";
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
          <MarketplaceProvider chainId="56" contractAddress="0x142bB2aDF4782aEEd93EBFD641acb9B3037779D1">
            <Navbar />
            {/* Add a container to wrap around the children */}
            <div className="container">{children}</div>
          </MarketplaceProvider>
        </Providers>
      </body>
    </html>
  );
}
