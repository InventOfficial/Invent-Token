/* eslint-disable camelcase */
import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
dotenv.config();

import ADDR_CONFIG from "./addressConfig";
const private_key_test = process.env.PRIVATE_KEY_TEST || "";
const bscscan_api_key = process.env.BSCSCAN_API_KEY || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// Deploy INVENT token...
task("deploy-invent", "Deploys INVENT", async (taskArgs, hre) => {

  // Figure out which network we're connecting to...
  let NETWORK: "" | "LOCAL" | "TEST" | "MAIN" = "";
  if (hre.network.name === "bscTestnet") { NETWORK = "TEST"; }
  if (NETWORK === "") { return; }

  // Get arguments based on network...
  const PANCAKE_SWAP = ADDR_CONFIG[NETWORK].PancakeSwapRouterV2;
  const MARKETING_WALLET = ADDR_CONFIG[NETWORK].MarketingWallet;
  const BUYBACK_WALLET = ADDR_CONFIG[NETWORK].BuyBackWallet;

  /*
  const balance = await hre.ethers.provider.getBalance(MARKETING_WALLET);
  console.log(`Balance: ${balance.toString()}`);
  console.log(`Network: ${NETWORK}`);
  console.log("Exiting");
  return;
  */

  

  const Invent = await hre.ethers.getContractFactory("INVENT");
  const invent = await Invent.deploy(PANCAKE_SWAP, MARKETING_WALLET, BUYBACK_WALLET);
  console.log("Deployed INVENT at: ".padEnd(35), invent.address);

  console.log(
      `To verify: npx hardhat verify --network ${hre.network.name} ${invent.address} "${PANCAKE_SWAP}" "${MARKETING_WALLET}" "${BUYBACK_WALLET}"`,
  );
});

task("deploy-presale", "Deploys INVT_PRE and Presale", async (taskArgs, hre) => {

  // Figure out which network we're connecting to...
  let NETWORK: "" | "LOCAL" | "TEST" | "MAIN" = "";
  if (hre.network.name === "bscTestnet") { NETWORK = "TEST"; }
  if (NETWORK === "") { return; }

  /*
  // Get arguments based on network...
  const PANCAKE_SWAP = ADDR_CONFIG[NETWORK].PancakeSwapRouterV2;
  const MARKETING_WALLET = ADDR_CONFIG[NETWORK].MarketingWallet;
  const BUYBACK_WALLET = ADDR_CONFIG[NETWORK].BuyBackWallet;
  const PRESALE_WALLET = ADDR_CONFIG[NETWORK].BuyBackWallet;
  const INVENT = ADDR_CONFIG.TEST.INVENT_18;

  // Deploy InventPresale...
  const rate = 1;
  const InventPresale = await hre.ethers.getContractFactory("InventPresale");
  const inventPresale = await InventPresale.deploy(rate, PRESALE_WALLET, INVENT);
  console.log("Deployed InventPresale at: ".padEnd(35), inventPresale.address);
  console.log(
    `To verify: npx hardhat verify --network ${hre.network.name} ${inventPresale.address} "${rate}" "${PRESALE_WALLET}" "${INVENT}"`,
  );
  */


    // Deploy token...
    const InventPresaleToken = await hre.ethers.getContractFactory("InventPresaleToken");
    const inventPresaleToken = await InventPresaleToken.deploy();
    console.log("Deployed InventPresaleToken at: ".padEnd(35), inventPresaleToken.address);
    console.log(
      `To verify: npx hardhat verify --network ${hre.network.name} ${inventPresaleToken.address}`,
    );

    // Deploy presale...
    const rate = 1;
    const PRESALE_WALLET = ADDR_CONFIG[NETWORK].BuyBackWallet;
    const InventPresale = await hre.ethers.getContractFactory("InventPresale");
    const inventPresale = await InventPresale.deploy(rate, PRESALE_WALLET, inventPresaleToken.address);
    console.log("Deployed InventPresale at: ".padEnd(35), inventPresale.address);
    console.log(
      `To verify: npx hardhat verify --network ${hre.network.name} ${inventPresale.address} "${rate}" "${PRESALE_WALLET}" "${inventPresaleToken.address}"`,
    );

    // Transfer all tokens to the presale...
    await inventPresaleToken.transfer(inventPresale.address, await inventPresaleToken.totalSupply());
    console.log("Transferred all tokens to the InventPresale");  
});




// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        { version: "0.5.0",  settings: { optimizer: { enabled: true, runs: 200 }, }, },
        { version: "0.5.5",  settings: { optimizer: { enabled: true, runs: 200 }, }, },
        { version: "0.5.10", settings: { optimizer: { enabled: true, runs: 200 }, }, },
        { version: "0.8.3",  settings: { optimizer: { enabled: true, runs: 200 }, }, },
    ],
    settings: { optimizer: { enabled: true } }
  },

  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: [`${private_key_test}`]
    },

    /*
    bscMainnet: {

    }
    */
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },

  etherscan: {
    apiKey: bscscan_api_key,
  },
};

export default config;
