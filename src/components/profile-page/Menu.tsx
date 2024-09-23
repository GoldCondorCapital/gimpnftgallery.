import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  selectedCollection: NftContract;
  setSelectedCollection: Dispatch<SetStateAction<NftContract>>;
};

export function ProfileMenu(props: Props) {
  const { selectedCollection, setSelectedCollection } = props;

  const handleAccordionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const accordionContent = e.currentTarget.nextElementSibling;
    if (accordionContent) {
      accordionContent.classList.toggle("open");
      const icon = e.currentTarget.querySelector(".accordion-icon");
      icon?.classList.toggle("rotate");
    }
  };

  return (
    <div className="box">
      <div className="accordion-item">
        <div className="accordion-header" onClick={handleAccordionClick}>
          <span className="accordion-button">
            <span>Collections</span>
            <span className="accordion-icon">▼</span>
          </span>
        </div>
        <div className="accordion-content">
          {NFT_CONTRACTS.map((item) => (
            <button
              key={item.address}
              className="button"
              style={{
                opacity: item.address === selectedCollection.address ? 1 : 0.4,
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 0',
              }}
              onClick={() => setSelectedCollection(item)}
            >
              <img
                src={item.thumbnailUrl ?? ""}
                className="image"
                alt="thumbnail"
                style={{ width: '40px', height: '40px' }}
              />
              <div style={{ marginLeft: '15px' }}>
                <span className="text">{item.title ?? "Unknown collection"}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
