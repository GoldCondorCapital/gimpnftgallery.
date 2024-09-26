import { client } from "@/consts/client";
import { useMarketplaceContext } from "hooks/useMarketplaceContext";
import {
	type Hex,
	NATIVE_TOKEN_ADDRESS,
	getContract,
	sendAndConfirmTransaction,
	sendTransaction,
	toTokens,
	waitForReceipt,
} from "thirdweb";
import { allowance, approve, decimals } from "thirdweb/extensions/erc20";
import {
	type DirectListing,
	buyFromListing,
} from "thirdweb/extensions/marketplace";
import {
	useActiveWalletChain,
	useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
	listing: DirectListing;
	account: Account;
};

export default function BuyFromListingButton(props: Props) {
	const { account, listing } = props;
	const { marketplaceContract, refetchAllListings, nftContract } =
		useMarketplaceContext();
	const switchChain = useSwitchActiveWalletChain();
	const activeChain = useActiveWalletChain();

	const notify = (message: string, type: "success" | "error") => {
		// Simple browser notification logic; can be replaced with any notification service
		alert(`${type.toUpperCase()}: ${message}`);
		console.log(`[${type}] ${message}`);
	};

	return (
		<button
			onClick={async () => {
				if (activeChain?.id !== nftContract.chain.id) {
					await switchChain(nftContract.chain);
				}
				try {
					// Check if the listing's currency is not the native token
					if (
						listing.currencyContractAddress.toLowerCase() !==
						NATIVE_TOKEN_ADDRESS.toLowerCase()
					) {
						const customTokenContract = getContract({
							address: listing.currencyContractAddress as Hex,
							client,
							chain: nftContract.chain,
						});
						const result = await allowance({
							contract: customTokenContract,
							owner: account.address,
							spender: marketplaceContract.address as Hex,
						});

						if (result < listing?.pricePerToken) {
							const _decimals = await decimals({
								contract: customTokenContract,
							});
							const transaction = approve({
								contract: customTokenContract,
								spender: marketplaceContract.address as Hex,
								amount: toTokens(listing?.pricePerToken, _decimals),
							});
							await sendAndConfirmTransaction({ transaction, account });
						}
					}

					// Proceed with buying the NFT
					const transaction = buyFromListing({
						contract: marketplaceContract,
						listingId: listing.id,
						quantity: listing.quantity,
						recipient: account.address,
					});
					console.log(transaction);

					const receipt = await sendTransaction({
						transaction,
						account,
					});

					await waitForReceipt({
						transactionHash: receipt.transactionHash,
						client,
						chain: nftContract.chain,
					});

					notify(
						"Purchase completed! The asset(s) should arrive in your account shortly",
						"success"
					);

					refetchAllListings();
				} catch (err) {
					console.error(err);
					if ((err as Error).message.startsWith("insufficient funds for gas")) {
						notify(
							`You don't have enough funds for this purchase. Make sure you have enough gas for the transaction + ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`,
							"error"
						);
					} else {
						notify("An error occurred during the transaction.", "error");
					}
				}
			}}
		>
			Buy
		</button>
	);
}
