import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia : {
      url: SEPOLIA_RPC_URL,
      accounts : [PRIVATE_KEY],
    }
  },
  etherscan : {
    apiKey : ETHERSCAN_API_KEY,
  },

  sourcify : {
    enabled: true,
  }

};

// console.log("Sepolia RPC URL:", SEPOLIA_RPC_URL);
// console.log("Private Key:",PRIVATE_KEY);

export default config;
