import { useMarketplaceContext } from "hooks/useMarketplaceContext";
import { sendAndConfirmTransaction } from "thirdweb";
import { cancelListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  account: Account;
  listingId: bigint;
};

export default function CancelListingButton(props: Props) {
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const { account, listingId } = props;

  const notify = (message: string, type: "success" | "error") => {
    // Simple browser notification logic; replace with any notification service
    alert(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <button
      onClick={async () => {
        try {
          // Ensure the wallet is on the correct chain
          if (activeChain?.id !== nftContract.chain.id) {
            await switchChain(nftContract.chain);
          }

          // Cancel the listing
          const transaction = cancelListing({
            contract: marketplaceContract,
            listingId,
          });

          // Send and confirm the transaction
          await sendAndConfirmTransaction({
            transaction,
            account,
          });

          // Notify the user of success
          notify("Listing cancelled successfully", "success");

          // Refetch the listings after cancellation
          refetchAllListings();
        } catch (error) {
          console.error(error);
          notify("An error occurred while cancelling the listing", "error");
        }
      }}
    >
      Cancel
    </button>
  );
}
