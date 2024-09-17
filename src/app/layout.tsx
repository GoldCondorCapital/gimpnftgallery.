import { Navbar } from "@/components/shared/Navbar";
import "../styles/global.css"; // Correct import path for global.css after moving



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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
