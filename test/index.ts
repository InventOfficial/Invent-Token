import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "@ethersproject/contracts";
const { BN, constants, time, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import { INVENT } from "../typechain/INVENT";
import { InventPresale } from "../typechain/InventPresale";

import ADDR_CONFIG from "../addressConfig";
const NETWORK = "LOCAL";
const PANCAKE_SWAP = ADDR_CONFIG[NETWORK].PancakeSwapRouterV2;
const MARKETING_WALLET = ADDR_CONFIG[NETWORK].MarketingWallet;
const BUYBACK_WALLET = ADDR_CONFIG[NETWORK].BuyBackWallet;

async function printAccountValues(accountName: string, account: string, invent: INVENT): Promise<void> {
    console.log(accountName);
    console.log("      BNB: ", (await ethers.provider.getBalance(account)).toString());
    console.log("   Invent: ", (await invent.balanceOf(account)).toString());
}

describe("INVENT", function() {
    let invent: INVENT;

    this.beforeEach(async () => {
        const Invent = await ethers.getContractFactory("INVENT");
        invent = await Invent.deploy(PANCAKE_SWAP, MARKETING_WALLET, BUYBACK_WALLET) as INVENT;
        console.log(`INVENT deployed at ${invent.address}`);
    });

    it ("Should deploy", async function() {
        // Doesn't work at the moment
    });

});

describe.only("Presale", function() {
    const decimals = new BN("1000000000000");           // 12 deciamals
    const decimals18 = new BN("1000000000000000000");   // 18 deciamals
    const balance100k = (new BN(100_000)).mul(decimals);
    const balance20k = (new BN(20_000)).mul(decimals);
    const balance10k = (new BN(10_000)).mul(decimals);
    const balance1k  = (new BN(1_000)).mul(decimals);

    let deployer: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;
    let charlie: SignerWithAddress, daniel: SignerWithAddress, emily: SignerWithAddress;
    let pancakeSwap: string;
    let marketingWallet: string;
    let buybackWallet: string;
    let presaleWallet: string;

    let invent: INVENT;
    let inventPresale: InventPresale;

    this.beforeEach(async () => {
        [deployer, alice, bob, charlie, daniel, emily] = await ethers.getSigners();
        pancakeSwap = emily.address;
        marketingWallet = daniel.address;
        buybackWallet = daniel.address;
        presaleWallet = charlie.address;  
        
        console.log("Deployer: ", deployer.address);
        console.log("Alice: ", alice.address);

        // Deploy INVENT...
        const Invent = await ethers.getContractFactory("INVENT");
        invent = await Invent.deploy(pancakeSwap, marketingWallet, buybackWallet) as INVENT;
        console.log(`INVENT deployed at ${invent.address}`);

        // Deploy InventPresale...
        // 1 token for every 1000 wei ==> 0.001 * 10^12 ==> 1 * 10^9
        // Send 5,000 wei ==> 5000 * (1 * 10^9) = 5000 * 10^9 = 5 * 10^12 = 5 Invent tokens
        //const rate = decimals.div(new BN(1_000)).toString();
        // NOTE:
        // Because INVENT uses 12 decimals, our rate has to be at least 10^6 (10^18 / 10^12)
        //const rate = 10_000_000;
        const rate = 1;
        const InventPresale = await ethers.getContractFactory("InventPresale");
        inventPresale = await InventPresale.deploy(rate, presaleWallet, invent.address) as InventPresale;
        console.log(`InventPresale deployed at ${inventPresale.address}`);
    });

    it("Can buy from presale", async () => {
        // Verify owner has full balance...
        await printAccountValues("Deployer", deployer.address, invent);

        // Send tokens to the contract...
        await invent.transfer(inventPresale.address, (new BN(1_000_000_000)).mul(decimals).toString());
        await printAccountValues("Presale", inventPresale.address, invent);

        await printAccountValues("Deployer", deployer.address, invent);

        // Let Alice buy from the presale...
        await inventPresale.connect(alice).buyTokens(alice.address, { from: alice.address, value: 1000000 });
        /*
        await alice.sendTransaction({ 
            to: inventPresale.address, 
            value: "1000000000000000000"
            //value: ethers.utils.parseEther("1.0") 
        });
        */
        await printAccountValues("Alice", alice.address, invent);


        

        
    });
});