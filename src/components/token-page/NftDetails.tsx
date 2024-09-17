import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { shortenAddress } from "thirdweb/utils";
import Link from "next/link";
import { useState } from "react";
import "../styles/global.css"; // Import global styles

type Props = {
  nft: NFT;
};

export function NftDetails(props: Props) {
  const { type, nftContract } = useMarketplaceContext();
  const { nft } = props;
  const [isOpen, setIsOpen] = useState(false); // State for accordion toggle

  const contractUrl = `${
    nftContract.chain.blockExplorers
      ? nftContract.chain.blockExplorers[0]?.url
      : ""
  }/address/${nftContract.address}`;
  
  const tokenUrl = `${
    nftContract.chain.blockExplorers
      ? nftContract.chain.blockExplorers[0]?.url
      : ""
  }/nft/${nftContract.address}/${nft.id.toString()}`;

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="accordion-item">
      <button className="accordion-button" onClick={toggleAccordion}>
        <span className="accordion-title">Details</span>
        <span className="accordion-icon">{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && (
        <div className="accordion-panel">
          <div className="detail-row">
            <span>Contract address</span>
            <Link href={contractUrl} target="_blank" className="link">
              {shortenAddress(nftContract.address)}
            </Link>
          </div>

          <div className="detail-row">
            <span>Token ID</span>
            <Link href={tokenUrl} target="_blank" className="link">
              {nft?.id.toString()}
            </Link>
          </div>

          <div className="detail-row">
            <span>Token Standard</span>
            <span>{type}</span>
          </div>

          <div className="detail-row">
            <span>Chain</span>
            <span>{nftContract.chain.name ?? "Unnamed chain"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
