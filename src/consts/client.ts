import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";

// Define your wallet options
const wallets = [
  createWallet("io.metamask"), // MetaMask Wallet
  createWallet("com.coinbase.wallet"), // Coinbase Wallet
  createWallet("me.rainbow"), // Rainbow Wallet
  createWallet("com.trustwallet.app"), // Trust Wallet
  createWallet("com.binance"), // Binance Wallet
  createWallet("io.zerion.wallet"), // Zerion Wallet
  createWallet("io.rabby"), // Rabby Wallet
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
];

// Create the thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID as string, // Using the provided environment variable
  wallets, // Attach wallets array to client configuration
});
