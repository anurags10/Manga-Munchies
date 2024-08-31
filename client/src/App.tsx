import React, {useState, useEffect} from "react";
import {ethers} from 'ethers';
import abi from './contractJSON/RestaurantDApp.json';
// import 'dotenv/config';
// import { wait } from "@testing-library/user-event/dist/utils";
import './App.css';


const contract_address = "0x6C0Fb71E7f6Ca463cC61BA26e5f98Fe6c8755665";
const contract_abi = abi.abi;

const App : React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [orderCount,setOrderCount] = useState<string | null>("0");
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  useEffect(() => {
    const init = async () =>{
      // const {ethereum} = window
      if(window.ethereum && contract_address){
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contract_address,contract_abi,signer);
        setSigner(signer);
        setProvider(provider);
        setContract(contract);

        await getOrderCount(contract, signer);

      } else {
        console.error("Please install Metamask!!");
        
      }
    }
    init();
  }, []);

  const getOrderCount = async (contractInstance: ethers.Contract, signerInstance : ethers.Signer) =>{
    if(contractInstance && signerInstance){
      try {
        const userAddress = await signerInstance.getAddress();
        // console.log(userAddress);
        
        const count: ethers.BigNumberish = await contractInstance.orderCount(userAddress);
        // console.log(count);
        
        setOrderCount(count.toString())
      } catch (error) {
        console.error("Error fetching order count :", error);
        
      }

    }
  }

  const placeOrder = async () => {
    if (contract && signer){
      setIsPlacingOrder(true);
      try {
        const tx = await contract.placeOrder();
        await tx.wait();
        // await getOrderCount(contract, signer); // update the ordercount after placing order
      } catch (error) {
        console.error("Error placing an Order :",error);
        
      } finally {
        setIsPlacingOrder(false);
      }
    }
  }

  return (
    <div className="app-container">
      <h1 className="app-title">MANGA MUNCHIES</h1>
      <div className="button-container">
      <button className="order-button" onClick={placeOrder} disabled = {isPlacingOrder}>
        {isPlacingOrder ? "Placing order ....." : "Place Order"}
      </button>
      <button className="refresh-button" onClick={() => getOrderCount(contract!,signer!)}> Update Counts</button>
      </div>
      <div className="order-count">
      {orderCount != null ? (
        <p>Total Order Count: {orderCount}</p>
      ):(
        <p>Loading Order Count .....</p>
      )}
      </div>



    </div>
  )

}
export default App;