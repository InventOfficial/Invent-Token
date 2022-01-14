import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "@ethersproject/contracts";
const { BN, constants, time, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import { INVENT } from "../typechain/INVENT";

describe("INVENT", function() {
    let invent: INVENT;

    this.beforeEach(async () => {
        const Invent = await ethers.getContractFactory("INVENT");
        invent = await Invent.deploy();
        console.log(`INVENT deployed at ${invent.address}`);
    });

    it ("Should deploy", async function() {
        // Doesn't work at the moment
    });

});