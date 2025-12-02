"use client";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export default function Connect() {
  return <ConnectButton client={client} connectModal={{size:"compact"}} wallets={wallets}/>;
}
