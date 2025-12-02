"use client";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { prepareContractCall } from "thirdweb";
import { useState } from "react";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

const CONTRACT_ADDRESS = "0x2DFE6709D0Ed2fD09ddD83664B64f54F37B538A4";

export default function Mint() {
  const account = useActiveAccount();
  const { mutate: sendTx, isLoading } = useSendTransaction();
  const [status, setStatus] = useState("");

  const doMint = async () => {
    try {
      setStatus("Minting...");
      const contract = getContract({
        client,
        address: CONTRACT_ADDRESS,
        chain: "polygon",
      });

      const tx = prepareContractCall({
        contract,
        method: "mintTo",
        params: [account.address, 1],
      });

      await sendTx(tx);
      setStatus("Mint successful!");
    } catch (e) {
      setStatus("Mint failed");
      console.error(e);
    }
  };

  if (!account) return <p>Connect wallet to mint.</p>;

  return (
    <div style={{marginTop:20}}>
      <button onClick={doMint} disabled={isLoading} style={{padding:"10px 20px",borderRadius:8}}>
        {isLoading ? "Minting..." : "Mint"}
      </button>
      <p>{status}</p>
    </div>
  );
}
