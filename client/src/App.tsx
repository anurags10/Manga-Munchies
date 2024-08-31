import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./contractJSON/RestaurantDApp.json";
import "./App.css";
import image1 from './image/image 1.png';
import image2 from './image/image 2.png';
import image3 from './image/image 3.png';



const contract_address = "0x6C0Fb71E7f6Ca463cC61BA26e5f98Fe6c8755665";
const contract_abi = abi.abi;

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [orderCount, setOrderCount] = useState<string | null>("0");
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>("Not connected");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum && contract_address) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts.length > 0) {
            const userAccount = accounts[0];
            setAccount(userAccount);
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contract_address, contract_abi, signer);
            setSigner(signer);
            setContract(contract);

            await getOrderCount(contract, signer);
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", handleAccountsChanged);
        } catch (error) {
          console.error("Error initializing application:", error);
        }
      } else {
        console.error("Please install Metamask!!");
      }
    };

    init();

    // Cleanup function to remove the listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAccount = accounts[0];
      setAccount(newAccount);
      if (provider) {
        const newSigner = await provider.getSigner();
        const newContract = new ethers.Contract(contract_address, contract_abi, newSigner);
        setSigner(newSigner);
        setContract(newContract);
        await getOrderCount(newContract, newSigner);
      }
    } else {
      setAccount("Not connected");
      setOrderCount("0");
    }
  };

  const getOrderCount = async (contractInstance: ethers.Contract, signerInstance: ethers.Signer) => {
    if (contractInstance && signerInstance) {
      try {
        const userAddress = await signerInstance.getAddress();
        const count: ethers.BigNumberish = await contractInstance.orderCount(userAddress);
        setOrderCount(count.toString());
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
    }
  };

  const placeOrder = async () => {
    if (contract && signer) {
      setIsPlacingOrder(true);
      try {
        const tx = await contract.placeOrder();
        await tx.wait();
        // if (account) {
        //   await getOrderCount(contract, signer);
        // }
      } catch (error) {
        console.error("Error placing an Order:", error);
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  return (
    <>
    <div className="title-container">
      <h1 className="app-title">MANGA MUNCHIES</h1>
    </div>
    <div className="app-container">
      <header className="app-header">
        <p>Note: Customers who complete 100 orders will receive an NFT as a loyalty reward!</p>
      </header>
      <p className=" account-info">Account Connected: {`${account?.substring(0,6)}....${account?.substring(account.length - 4)}`}</p>
      <div className="button-container">
        <button className="order-button" onClick={placeOrder} disabled={isPlacingOrder}>
          {isPlacingOrder ? "Placing order ....." : "Place Order"}
        </button>
        <button className="refresh-button" onClick={() => contract && signer && getOrderCount(contract, signer)}>
          Update Counts
        </button>
      </div>
      <div className="order-count">
        {orderCount !== null ? <p>Total Order Count: {orderCount}</p> : <p>Loading Order Count .....</p>}
      </div>
      <footer className="app-footer">
        <img src={image1} alt="Image 1" className="footer-image" />
        <img src={image2} alt="Image 2" className="footer-image" />
        <img src={image3} alt="Image 3" className="footer-image" />
      </footer>
    </div>
    </>
  );
};

export default App;
