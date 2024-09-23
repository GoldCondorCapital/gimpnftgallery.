import { client } from "@/consts/client";
import type { NFT, ThirdwebContract } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export function OwnedItem(props: { nft: NFT; nftCollection: ThirdwebContract }) {
  const { nft, nftCollection } = props;

  return (
    <>
      <a
        href={`/collection/${nftCollection.chain.id}/${nftCollection.address}/token/${nft.id.toString()}`}
        className="link"
        style={{
          borderRadius: "12px",
          textDecoration: "none",
          width: "250px",
          display: "block",
        }}
      >
        <div className="flex-container" style={{ flexDirection: "column" }}>
          <MediaRenderer client={client} src={nft.metadata.image} />
          <span className="text">{nft.metadata?.name ?? "Unknown item"}</span>
        </div>
      </a>
    </>
  );
}
