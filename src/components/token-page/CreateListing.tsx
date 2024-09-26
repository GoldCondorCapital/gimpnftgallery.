import { NATIVE_TOKEN_ICON_MAP, Token } from "@/consts/supported_tokens";
import { useMarketplaceContext } from "hooks/useMarketplaceContext";
import { useRef, useState } from "react";
import { NATIVE_TOKEN_ADDRESS, sendAndConfirmTransaction } from "thirdweb";
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import {
  isApprovedForAll as isApprovedForAll721,
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import { createListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  tokenId: bigint;
  account: Account;
};

export function CreateListing(props: Props) {
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { tokenId, account } = props;
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [currency, setCurrency] = useState<Token | undefined>(undefined);

  const {
    nftContract,
    marketplaceContract,
    refetchAllListings,
    type,
    supportedTokens,
  } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  const nativeToken: Token = {
    tokenAddress: NATIVE_TOKEN_ADDRESS,
    symbol: chain.nativeCurrency?.symbol || "NATIVE TOKEN",
    icon: NATIVE_TOKEN_ICON_MAP[chain.id] || "",
  };

  const options: Token[] = [nativeToken].concat(supportedTokens);

  // Notify user with an alert (replace with any notification system you prefer)
  const notify = (message: string, type: "success" | "error") => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <div>
      <br />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {type === "ERC1155" ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                ref={priceRef}
                placeholder="Enter a price"
              />
            </div>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                ref={qtyRef}
                defaultValue={1}
                placeholder="Quantity to sell"
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              ref={priceRef}
              placeholder="Enter a price for your listing"
            />
          </div>
        )}

        <div>
          <label htmlFor="currency">Select currency</label>
          <select
            id="currency"
            value={currency?.tokenAddress}
            onChange={(e) => {
              const selectedToken = options.find(
                (token) => token.tokenAddress === e.target.value
              );
              setCurrency(selectedToken);
            }}
          >
            <option value="">Select currency</option>
            {options.map((token) => (
              <option key={token.tokenAddress} value={token.tokenAddress}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={async () => {
            const value = priceRef.current?.value;
            if (!value) {
              return notify("Please enter a price for this listing", "error");
            }
            if (!currency) {
              return notify("Please select a currency for the listing", "error");
            }
            if (activeChain?.id !== nftContract.chain.id) {
              await switchChain(nftContract.chain);
            }
            const _qty = BigInt(qtyRef.current?.value ?? 1);
            if (type === "ERC1155") {
              if (!_qty || _qty <= 0n) {
                return notify("Invalid quantity", "error");
              }
            }

            // Check for approval
            const checkApprove =
              type === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;

            const isApproved = await checkApprove({
              contract: nftContract,
              owner: account.address,
              operator: marketplaceContract.address,
            });

            if (!isApproved) {
              const setApproval =
                type === "ERC1155"
                  ? setApprovalForAll1155
                  : setApprovalForAll721;

              const approveTx = setApproval({
                contract: nftContract,
                operator: marketplaceContract.address,
                approved: true,
              });

              await sendAndConfirmTransaction({
                transaction: approveTx,
                account,
              });
            }

            const transaction = createListing({
              contract: marketplaceContract,
              assetContractAddress: nftContract.address,
              tokenId,
              quantity: type === "ERC721" ? 1n : _qty,
              currencyContractAddress: currency?.tokenAddress,
              pricePerToken: value,
            });

            await sendAndConfirmTransaction({
              transaction,
              account,
            });
            refetchAllListings();
            notify("Listing created successfully", "success");
          }}
        >
          List
        </button>
      </div>
    </div>
  );
}
