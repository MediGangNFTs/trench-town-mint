import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const CONTRACT_ADDRESS = "0x2DFE6709D0Ed2fD09ddD83664B64f54F37B538A4";
const POLYGON_CHAIN_ID = "0x89"; // Polygon Mainnet (POL)
const POLYGON_RPC = "https://polygon-rpc.com";
const COLLECTION_IMAGE = "YOUR_COLLECTION_IMAGE_URL"; // Replace with your Thirdweb collection image URL

// Floating bubble animation component
const Bubble = ({ delay, size, left }) => (
  <div
    className="absolute rounded-full bg-cyan-400/20 border border-cyan-300/30 animate-float"
    style={{
      width: size,
      height: size,
      left: left,
      bottom: '-10%',
      animationDelay: delay,
      animationDuration: '8s'
    }}
  />
);

export default function TrenchTownMint() {
  const [account, setAccount] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [mintPrice, setMintPrice] = useState("0.01");
  const [maxMintAmount] = useState(10);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        checkNetwork();
      }

      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
    }
  };

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsCorrectNetwork(chainId === POLYGON_CHAIN_ID);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask to use this app");
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
      checkNetwork();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_CHAIN_ID }],
      });
      setIsCorrectNetwork(true);
      setError(null);
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_CHAIN_ID,
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
              rpcUrls: [POLYGON_RPC],
              blockExplorerUrls: ['https://polygonscan.com/'],
            }],
          });
          setIsCorrectNetwork(true);
          setError(null);
        } catch (addErr) {
          setError(addErr.message);
        }
      } else {
        setError(err.message);
      }
    }
  };

  const mintNFT = async () => {
    if (!account || !isCorrectNetwork) return;

    setIsMinting(true);
    setError(null);
    setTxHash(null);

    try {
      const totalPrice = (parseFloat(mintPrice) * mintAmount).toString();
      const valueInWei = `0x${(parseFloat(totalPrice) * 1e18).toString(16)}`;

      const mintData = `0x` + 
        `a0712d68` +
        `000000000000000000000000${account.slice(2)}` +
        `${mintAmount.toString(16).padStart(64, '0')}`;

      const transactionParameters = {
        to: CONTRACT_ADDRESS,
        from: account,
        value: valueInWei,
        data: mintData,
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setTxHash(txHash);
      setError(null);
    } catch (err) {
      setError(err.message || "Transaction failed");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 via-teal-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated bubbles */}
      <Bubble delay="0s" size="60px" left="10%" />
      <Bubble delay="2s" size="40px" left="25%" />
      <Bubble delay="1s" size="80px" left="50%" />
      <Bubble delay="3s" size="50px" left="75%" />
      <Bubble delay="1.5s" size="35px" left="85%" />
      <Bubble delay="2.5s" size="70px" left="5%" />
      
      {/* Underwater grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          {/* Collection Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-lime-500 to-cyan-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
              <img 
                src={COLLECTION_IMAGE}
                alt="Trench Town Collection"
                className="relative w-64 h-64 object-cover rounded-2xl border-4 border-cyan-400/50 shadow-2xl"
              />
            </div>
          </div>

          <div className="inline-block relative">
            <h1 className="text-6xl md:text-7xl font-black mb-2 tracking-tight" style={{
              textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.05em'
            }}>
              <span className="text-cyan-300">TRENCH</span>{' '}
              <span className="text-lime-300">TOWN</span>
            </h1>
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-lime-400 to-cyan-400 rounded-full" />
          </div>
          <p className="text-xl md:text-2xl text-cyan-200 mt-4 font-bold tracking-wide">
            DIVE INTO THE DEPTHS 🌊
          </p>
          <p className="text-sm text-cyan-300/70 mt-2 uppercase tracking-widest">
            Urban Underwater • Polygon Network
          </p>
        </header>

        <div className="max-w-lg mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-cyan-500/30 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-lime-400 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-cyan-400 rounded-br-3xl" />

          {!account ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-lime-500 rounded-full flex items-center justify-center animate-pulse">
                <Wallet className="w-12 h-12 text-slate-900" />
              </div>
              <h2 className="text-3xl font-black mb-3 text-cyan-300">CONNECT UP</h2>
              <p className="text-slate-300 mb-8 text-lg">Link your wallet to enter the trenches</p>
              <button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-cyan-500 via-lime-500 to-cyan-500 hover:from-cyan-400 hover:via-lime-400 hover:to-cyan-400 text-slate-900 font-black py-4 px-8 rounded-xl transition-all transform hover:scale-105 text-lg uppercase tracking-wider shadow-lg shadow-cyan-500/50"
              >
                Connect Wallet
              </button>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-slate-900" />
              </div>
              <h2 className="text-3xl font-black mb-3 text-yellow-300">WRONG NETWORK</h2>
              <p className="text-slate-300 mb-8 text-lg">Switch to Polygon to continue</p>
              <button
                onClick={switchToPolygon}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-black py-4 px-8 rounded-xl transition-all transform hover:scale-105 text-lg uppercase tracking-wider shadow-lg shadow-yellow-500/50"
              >
                Switch Network
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8 p-4 bg-slate-950/50 rounded-xl border border-cyan-500/30">
                <p className="text-xs text-cyan-400 mb-1 uppercase tracking-widest font-bold">Connected</p>
                <p className="text-sm font-mono text-lime-300">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-black mb-4 text-cyan-300 uppercase tracking-wider">
                  How Many NFTs?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                    className="bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 w-14 h-14 rounded-xl font-black text-2xl shadow-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxMintAmount}
                    value={mintAmount}
                    onChange={(e) => setMintAmount(Math.min(maxMintAmount, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="flex-1 bg-slate-950/70 border-2 border-cyan-500/50 rounded-xl px-4 py-3 text-center text-3xl font-black text-lime-300"
                  />
                  <button
                    onClick={() => setMintAmount(Math.min(maxMintAmount, mintAmount + 1))}
                    className="bg-gradient-to-br from-lime-600 to-lime-700 hover:from-lime-500 hover:to-lime-600 w-14 h-14 rounded-xl font-black text-2xl shadow-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-8 p-6 bg-slate-950/70 rounded-xl border-2 border-lime-500/30">
                <div className="flex justify-between mb-3">
                  <span className="text-slate-400 uppercase text-sm tracking-wider">Price Each:</span>
                  <span className="font-black text-cyan-300">{mintPrice} POL</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-3" />
                <div className="flex justify-between">
                  <span className="text-lime-400 uppercase text-sm tracking-wider font-bold">Total Cost:</span>
                  <span className="font-black text-2xl text-lime-300">
                    {(parseFloat(mintPrice) * mintAmount).toFixed(4)} POL
                  </span>
                </div>
              </div>

              <button
                onClick={mintNFT}
                disabled={isMinting}
                className="w-full bg-gradient-to-r from-cyan-500 via-lime-500 to-cyan-500 hover:from-cyan-400 hover:via-lime-400 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-700 text-slate-900 font-black py-5 px-8 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl uppercase tracking-wider shadow-lg shadow-lime-500/50"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    MINTING...
                  </>
                ) : (
                  `MINT ${mintAmount} NFT${mintAmount > 1 ? 'S' : ''}`
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-900/30 border-2 border-red-500 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {txHash && (
                <div className="mt-6 p-4 bg-lime-900/30 border-2 border-lime-500 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-lime-400" />
                    <p className="text-sm font-black text-lime-300 uppercase">Transaction Sent!</p>
                  </div>
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-300 hover:text-cyan-200 underline break-all font-mono"
                  >
                    View on PolygonScan →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-cyan-400/70 uppercase tracking-widest">
          <p>⚠️ Make sure you have POL for gas fees ⚠️</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) translateX(20px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 8s infinite ease-in;
        }
      `}</style>
    </div>
  );
}